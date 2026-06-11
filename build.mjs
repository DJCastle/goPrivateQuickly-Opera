#!/usr/bin/env node
// build.mjs — assemble dist/opera/ from manifest.json + src/.
//
// Copies src/ verbatim into dist/opera/ and drops manifest.json at its root.
// With --zip, also writes the store-upload bundle dist/opera.zip (manifest
// at the zip root, as the Opera Add-ons store expects).
//
// Usage:
//   node build.mjs           # build dist/opera/
//   node build.mjs --zip     # build, then also write dist/opera.zip
//
// Zero dependencies — Node built-ins only. There's no native Node ZIP, so the
// bundle is written by hand with node:zlib raw deflate + a CRC32 table;
// timestamps are pinned so identical inputs produce identical zips.

import { readFile, writeFile, rm, mkdir, cp, readdir } from "node:fs/promises";
import { dirname, join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { deflateRawSync } from "node:zlib";

const HERE = dirname(fileURLToPath(import.meta.url));
const SRC = join(HERE, "src");
const DIST = join(HERE, "dist");
const TARGET = "opera";
const ZIP = process.argv.includes("--zip");

async function build() {
  const outDir = join(DIST, TARGET);
  await rm(outDir, { recursive: true, force: true });
  await mkdir(outDir, { recursive: true });
  await cp(SRC, outDir, { recursive: true });
  await cp(join(HERE, "manifest.json"), join(outDir, "manifest.json"));
  console.log(`Built dist/${TARGET}/`);
}

// ---- Minimal, dependency-free ZIP writer --------------------------------

const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

async function listFilesRel(dir, base = dir) {
  const entries = (await readdir(dir, { withFileTypes: true })).sort((a, b) =>
    a.name < b.name ? -1 : 1,
  );
  const out = [];
  for (const e of entries) {
    const full = join(dir, e.name);
    if (e.isDirectory()) out.push(...(await listFilesRel(full, base)));
    else out.push(relative(base, full));
  }
  return out;
}

// Pinned DOS timestamp (1980-01-01 00:00) so identical inputs zip identically.
const DOS_TIME = 0;
const DOS_DATE = 0x0021;

async function zipDir(srcDir, outPath) {
  const rels = await listFilesRel(srcDir);
  const local = [];
  const central = [];
  let offset = 0;

  for (const rel of rels) {
    const data = await readFile(join(srcDir, rel));
    const name = Buffer.from(rel.split(sep).join("/"), "utf8"); // ZIP uses "/"
    const crc = crc32(data);
    const comp = deflateRawSync(data);

    const lfh = Buffer.alloc(30);
    lfh.writeUInt32LE(0x04034b50, 0); // local file header signature
    lfh.writeUInt16LE(20, 4); // version needed
    lfh.writeUInt16LE(0, 6); // flags
    lfh.writeUInt16LE(8, 8); // method: deflate
    lfh.writeUInt16LE(DOS_TIME, 10);
    lfh.writeUInt16LE(DOS_DATE, 12);
    lfh.writeUInt32LE(crc, 14);
    lfh.writeUInt32LE(comp.length, 18);
    lfh.writeUInt32LE(data.length, 22);
    lfh.writeUInt16LE(name.length, 26);
    lfh.writeUInt16LE(0, 28); // extra length
    local.push(lfh, name, comp);

    const cdh = Buffer.alloc(46);
    cdh.writeUInt32LE(0x02014b50, 0); // central directory header signature
    cdh.writeUInt16LE(20, 4); // version made by
    cdh.writeUInt16LE(20, 6); // version needed
    cdh.writeUInt16LE(0, 8); // flags
    cdh.writeUInt16LE(8, 10); // method: deflate
    cdh.writeUInt16LE(DOS_TIME, 12);
    cdh.writeUInt16LE(DOS_DATE, 14);
    cdh.writeUInt32LE(crc, 16);
    cdh.writeUInt32LE(comp.length, 20);
    cdh.writeUInt32LE(data.length, 24);
    cdh.writeUInt16LE(name.length, 28);
    cdh.writeUInt16LE(0, 30); // extra length
    cdh.writeUInt16LE(0, 32); // comment length
    cdh.writeUInt16LE(0, 34); // disk number
    cdh.writeUInt16LE(0, 36); // internal attrs
    cdh.writeUInt32LE(0, 38); // external attrs
    cdh.writeUInt32LE(offset, 42); // local header offset
    central.push(cdh, name);

    offset += lfh.length + name.length + comp.length;
  }

  const centralBuf = Buffer.concat(central);
  const eocd = Buffer.alloc(22);
  eocd.writeUInt32LE(0x06054b50, 0); // end of central directory signature
  eocd.writeUInt16LE(rels.length, 8); // entries on this disk
  eocd.writeUInt16LE(rels.length, 10); // total entries
  eocd.writeUInt32LE(centralBuf.length, 12);
  eocd.writeUInt32LE(offset, 16); // central directory offset

  await writeFile(outPath, Buffer.concat([...local, centralBuf, eocd]));
}

// ---- Run ----------------------------------------------------------------

await build();

if (ZIP) {
  const outZip = join(DIST, `${TARGET}.zip`);
  await zipDir(join(DIST, TARGET), outZip);
  console.log(`Zipped dist/${TARGET}.zip`);
}
