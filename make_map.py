# -*- coding: utf-8 -*-
"""Generate an accurate, branded Southeast Asia SVG map from real GeoJSON."""
import json

d = json.load(open("scratch_world.geojson"))

# View bounding box (lon/lat) covering the SEA region + operating markets.
LON0, LON1 = 93.0, 142.0
LAT0, LAT1 = -11.0, 24.0
W = 1000.0
H = W * (LAT1 - LAT0) / (LON1 - LON0)

OPERATING = {"MYS", "THA", "IDN"}          # highlighted (SG shown as marker)
CONTEXT = {"VNM", "PHL", "KHM", "LAO", "MMR", "BRN"}
SHOW = OPERATING | CONTEXT


def project(lon, lat):
    x = (lon - LON0) / (LON1 - LON0) * W
    y = (LAT1 - lat) / (LAT1 - LAT0) * H
    return x, y


def ring_to_path(ring):
    # bbox cull: skip rings entirely outside an expanded view
    lons = [p[0] for p in ring]
    lats = [p[1] for p in ring]
    if max(lons) < LON0 - 3 or min(lons) > LON1 + 3:
        return None
    if max(lats) < LAT0 - 3 or min(lats) > LAT1 + 3:
        return None
    if len(ring) < 6:
        return None
    pts = []
    last = None
    for lon, lat in ring:
        x, y = project(lon, lat)
        c = f"{x:.1f},{y:.1f}"
        if c != last:
            pts.append(c)
            last = c
    if len(pts) < 4:
        return None
    return "M" + "L".join(pts) + "Z"


def country_paths(geom):
    paths = []
    t = geom["type"]
    polys = geom["coordinates"] if t == "MultiPolygon" else [geom["coordinates"]]
    for poly in polys:
        for ring in poly:  # first ring = outer; keep holes too but they're rare here
            p = ring_to_path(ring)
            if p:
                paths.append(p)
    return paths


# country polygons keyed by id
country_d = {}
for f in d["features"]:
    cid = f["id"]
    if cid not in SHOW:
        continue
    paths = country_paths(f["geometry"])
    if paths:
        country_d[cid] = "".join(paths)

# Static (non-interactive) context countries.
context_parts = []
for cid in CONTEXT:
    if cid in country_d:
        context_parts.append(
            f'<path d="{country_d[cid]}" fill="#dbe2ec" stroke="#ffffff" '
            f'stroke-width="0.8" stroke-linejoin="round"/>'
        )

# Markers grouped by market: (label, lon, lat, is_hq, label_dx, label_anchor)
market_markers = {
    "thailand": [("Bangkok", 100.50, 13.75, False, 10, "start")],
    "malaysia": [
        ("Penang", 100.33, 5.41, False, -10, "end"),
        ("Kuala Lumpur", 101.69, 3.14, False, 10, "start"),
    ],
    "singapore": [("Singapore (HQ)", 103.85, 1.29, True, 12, "start")],
    "indonesia": [
        ("Jakarta", 106.85, -6.20, False, 10, "start"),
        ("Bali", 115.22, -8.65, False, 10, "start"),
    ],
}
market_country = {"malaysia": "MYS", "thailand": "THA", "indonesia": "IDN"}
market_label = {
    "singapore": "Singapore — Regional HQ",
    "malaysia": "Malaysia — Kuala Lumpur & Penang",
    "thailand": "Thailand — Bangkok",
    "indonesia": "Indonesia — Jakarta & Bali",
}


def marker_svg(label, lon, lat, hq, dx, anchor):
    x, y = project(lon, lat)
    r = 7 if hq else 5
    color = "#003861" if hq else "#506075"
    out = []
    if hq:
        out.append(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="16" fill="#003861" opacity="0.12"/>')
    else:
        # invisible larger hit target so small city dots are easy to tap
        out.append(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="18" fill="#000" opacity="0"/>')
    out.append(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="{r}" fill="{color}"/>')
    weight = "700" if hq else "600"
    out.append(
        f'<text x="{x + dx:.1f}" y="{y + 4:.1f}" text-anchor="{anchor}" '
        f'font-family="\'Plus Jakarta Sans\',sans-serif" font-size="16" '
        f'font-weight="{weight}" fill="#003861" '
        f'stroke="#f8f9fe" stroke-width="3" paint-order="stroke">{label}</text>'
    )
    return "".join(out)


groups = []
for market in ("thailand", "malaysia", "indonesia", "singapore"):
    inner = []
    cid = market_country.get(market)
    if cid and cid in country_d:
        inner.append(
            f'<path class="sea-region" d="{country_d[cid]}" fill="#9ecaff" '
            f'stroke="#ffffff" stroke-width="0.8" stroke-linejoin="round"/>'
        )
    if market == "singapore":
        # clickable hit halo behind the HQ marker (SG has no polygon at this scale)
        sx, sy = project(103.85, 1.29)
        inner.append(f'<circle class="sea-region" cx="{sx:.1f}" cy="{sy:.1f}" r="22" fill="#9ecaff" opacity="0.55"/>')
    for m in market_markers[market]:
        inner.append(marker_svg(*m))
    groups.append(
        f'<g class="sea-market" data-market="{market}" role="button" tabindex="0" '
        f'aria-label="{market_label[market]}">{"".join(inner)}</g>'
    )

svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W:.0f} {H:.0f}" role="img" aria-label="IncoBev Asia regional footprint across Singapore, Malaysia, Thailand and Indonesia">
  <rect x="0" y="0" width="{W:.0f}" height="{H:.0f}" fill="#eef3fa"/>
  {''.join(context_parts)}
  {''.join(groups)}
</svg>
'''

open("assets/images/sea-map.svg", "w", encoding="utf-8").write(svg)
print("wrote assets/images/sea-map.svg", len(svg), "bytes; viewBox", int(W), int(H))
