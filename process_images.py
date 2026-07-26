# -*- coding: utf-8 -*-
"""Optimize source photography/logos into web-ready assets for the build."""
import io, os
from PIL import Image

SRC = r"D:/INCOBEV WEBSITE"
OUT = r"D:/INCOBEV WEBSITE/incobev-site/assets"

os.makedirs(os.path.join(OUT, "images"), exist_ok=True)
os.makedirs(os.path.join(OUT, "logos"), exist_ok=True)
os.makedirs(os.path.join(OUT, "certs"), exist_ok=True)


def save_photo(src, dest, max_w=1600, quality=82):
    try:
        im = Image.open(src)
        im = im.convert("RGB")
        if im.width > max_w:
            h = int(im.height * max_w / im.width)
            im = im.resize((max_w, h), Image.LANCZOS)
        im.save(dest, "JPEG", quality=quality, optimize=True, progressive=True)
        print("photo  OK ", os.path.basename(dest), im.size)
    except Exception as e:
        print("photo  FAIL", os.path.basename(dest), "|", src, "|", e)


def save_logo(src, dest, max_w=420):
    try:
        im = Image.open(src)
        keep_alpha = im.mode in ("RGBA", "LA", "P") and dest.lower().endswith(".png")
        if keep_alpha:
            im = im.convert("RGBA")
        else:
            im = im.convert("RGB")
        if im.width > max_w:
            h = int(im.height * max_w / im.width)
            im = im.resize((max_w, h), Image.LANCZOS)
        if dest.lower().endswith(".png"):
            im.save(dest, "PNG", optimize=True)
        else:
            im.save(dest, "JPEG", quality=88, optimize=True)
        print("logo   OK ", os.path.basename(dest), im.size)
    except Exception as e:
        print("logo   FAIL", os.path.basename(dest), "|", src, "|", e)


# ---- Photos (max 1600w JPEG) ----
photos = {
    "Latte Art Pulling.jpg": "hero-home.jpg",
    "KKbanner-03.jpg": "heritage.jpg",
    "Homepage_Brands.jpg": "brands-hero.jpg",
    "foodservice_01.jpg": "solutions-hero.jpg",
    "sustainability.jpeg": "sustainability-hero.jpg",
    "Schaerer_Coffee_Machines_Mood_Latte_Cappuccino_01.jpg": "contact-hero.jpg",
    "Schaerer_Coffee_Machine_Club_Location_People_3_CMYK.jpg": "people.jpg",
    "Schaerer_Coffee_Machines_Soul.jpg": "equipment-soul.jpg",
    "C8 Capsule Machine_workspace.jpg": "equipment-c8.jpg",
    "hospitality_inroom.jpg": "hospitality.jpg",
    "hospitality_inroom_02.jpg": "hospitality-2.jpg",
    "flexibleplans.jpg": "flexible.jpg",
    "technical support.jpg": "technical.jpg",
    "shutterstock_2190512903.jpg": "sustainability-2.jpg",
    "groupproduct.png": "group-product.jpg",
}
for s, d in photos.items():
    save_photo(os.path.join(SRC, "Assets", s), os.path.join(OUT, "images", d))

# Franke Mytico coffee-shop shot (nested)
save_photo(
    os.path.join(SRC, "Assets", "Mytico line", "Coffee shop", "FRANKE_Mytico_Coffeeshop_02_087.jpg"),
    os.path.join(OUT, "images", "coffeeshop.jpg"),
)

# ---- Certs ----
certs = {
    "ISO-14001-logo (1).png": "iso-14001.png",
    "championofgood_withoutwatermark.png": "champion-of-good.png",
    "ecovadis.png": "ecovadis.png",
    "logo-bizSAFE-logo-level-3.jpg": "bizsafe.jpg",
    "Halal-Logo.avif": "halal.png",
}
for s, d in certs.items():
    save_logo(os.path.join(SRC, "Assets", "Certs and logos", s), os.path.join(OUT, "certs", d), max_w=300)

# ---- Brand logos ----
L = os.path.join(SRC, "Logo asset")
logos = {
    ("Franke", "Franke Logo.png"): "franke.png",
    ("Schaerer", "Schaere Logo.png"): "schaerer.png",
    ("La Marzocco", "La Marzoco Logo.png"): "la-marzocco.png",
    ("Sanremo - Copy", "Sanremo+Coffee+Machines+-+Positive+Logo@4x.webp"): "sanremo.png",
    ("LSM", "LaSanMarco_black.png"): "la-san-marco.png",
    ("Zummo", "Zummo.png"): "zummo.png",
    ("Fiorenzato", "Fiorenzato Logo.png"): "fiorenzato.png",
    ("Bravilor", "Bravilor Bonamat.png"): "bravilor.png",
    ("Reneka", "Reneka Logo.png"): "reneka.png",
    ("Hario", "Hario Logo.png"): "hario.png",
    ("Cafetto", "Cafetto logo.png"): "cafetto.png",
    ("Robert Timms", "Robert Timms Logo.png"): "robert-timms.png",
    ("Suzuki", "Suzuki Logo.png"): "suzuki.png",
    ("Tea Forte", "Tea Forte Logo.png"): "tea-forte.png",
    ("Gifel Tea", "Gifel Tea Logo.png"): "gifel-tea.png",
    ("Metz Tea", "metz_tea_logo_hor.png"): "metz-tea.png",
    ("Mist Valley", "Mist Valley Logo.png"): "mist-valley.png",
    ("Goodman", "Goodman Logo.png"): "goodman.png",
    ("Oatbedient", "Oatbedient logo.jpg"): "oatbedient.jpg",
}
for (folder, fname), d in logos.items():
    save_logo(os.path.join(L, folder, fname), os.path.join(OUT, "logos", d))

# Kaffa Kaldi (in Assets, not Logo asset)
save_logo(
    os.path.join(SRC, "Assets", "Kaffa Kaldi Logo", "KK Logo FA-Colour.png"),
    os.path.join(OUT, "logos", "kaffa-kaldi.png"),
)

print("done")
