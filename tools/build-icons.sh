#!/usr/bin/env bash
# Renders the source icons in tools/icon-sources/ into PNGs at all four
# extension icon sizes (16, 32, 48, 128) for every style and both states.
#
# Output layout:
#   src/icons/<style>/icon-<size>.png         (inactive)
#   src/icons/<style>/icon-active-<size>.png  (active)
#
# Source filename convention in tools/icon-sources/:
#   <style>-inactive.{svg,png}
#   <style>-active.{svg,png}
#
# SVG sources render via macOS qlmanage (the script strips explicit
# width/height attributes first so qlmanage's -s flag scales the viewBox
# to fill the canvas instead of corner-anchoring at native size).
#
# PNG sources are first center-cropped (sips -c) to a tighter square
# (CROP_PX × CROP_PX) to trim surrounding transparent padding, then
# resized via sips -Z. Without the crop step, decorative icons with
# generous padding render as a tiny dot at 16×16 in the toolbar.
# Tune CROP_PX if a new source has different padding.
#
# No external dependencies — qlmanage and sips ship with macOS.

set -euo pipefail

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
EXT_ROOT="$(cd "${HERE}/.." && pwd)"
SRC_DIR="${HERE}/icon-sources"
DST_DIR="${EXT_ROOT}/src/icons"
SIZES=(16 32 48 128)
STYLES=(venetian-mask)
# Centred square crop applied to PNG sources before resize. Lower =
# tighter crop = mask fills more of the 16×16 toolbar slot. Tune per
# source artwork if padding differs.
CROP_PX=600

if [[ ! -d "${SRC_DIR}" ]]; then
  echo "Missing source directory: ${SRC_DIR}" >&2
  exit 1
fi

TMP="$(mktemp -d)"
trap 'rm -rf "${TMP}"' EXIT

render_svg() {
  local src="$1" size="$2" dst="$3"
  local stripped="${TMP}/$(basename "${src}")"
  sed -E 's/ width="[0-9]+"//; s/ height="[0-9]+"//' "${src}" > "${stripped}"
  qlmanage -t -s "${size}" -o "${TMP}" "${stripped}" >/dev/null 2>&1
  mv "${TMP}/$(basename "${stripped}").png" "${dst}"
}

render_png() {
  local src="$1" size="$2" dst="$3"
  sips -Z "${size}" "${src}" --out "${dst}" >/dev/null
}

count=0
for style in "${STYLES[@]}"; do
  mkdir -p "${DST_DIR}/${style}"
  for state in inactive active; do
    svg_src="${SRC_DIR}/${style}-${state}.svg"
    png_src="${SRC_DIR}/${style}-${state}.png"

    if [[ -f "${svg_src}" ]]; then
      src="${svg_src}"
      kind=svg
    elif [[ -f "${png_src}" ]]; then
      # Centre-crop first to remove transparent padding, then resize
      # each size from the cropped working copy.
      cropped="${TMP}/${style}-${state}-cropped.png"
      sips -c "${CROP_PX}" "${CROP_PX}" "${png_src}" --out "${cropped}" >/dev/null
      src="${cropped}"
      kind=png
    else
      echo "Missing source for ${style}-${state} (.svg or .png)" >&2
      exit 1
    fi

    prefix="icon"
    if [[ "${state}" == "active" ]]; then
      prefix="icon-active"
    fi

    for size in "${SIZES[@]}"; do
      dst="${DST_DIR}/${style}/${prefix}-${size}.png"
      if [[ "${kind}" == "svg" ]]; then
        render_svg "${src}" "${size}" "${dst}"
      else
        render_png "${src}" "${size}" "${dst}"
      fi
      count=$((count + 1))
    done
  done
done

echo "Wrote ${count} PNGs to ${DST_DIR}"
