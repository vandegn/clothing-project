"""
Batch image search: Fetches clothing product images for all unique palette colors.
Saves 3 images per color/gender/category combo for manual selection.

Tops: 3 query variants (no model, flat lay, flat lay no model)
Bottoms (Women): dress, pants, shorts
Bottoms (Men): pants, shorts, joggers

After running, pick the best image from each folder and rename it to:
  frontend/public/clothing-images/{Gender}_{Color}_{Category}.jpg

Usage:
  python batch_image_search.py

Requires SERPER_API_KEY in backend/.env
"""

import os
import time
import requests
from dotenv import load_dotenv
from app.services.palette_generator import PaletteGenerator

load_dotenv(".env")

API_KEY = os.getenv("SERPER_API_KEY", "YOUR_SERPER_API_KEY_HERE")
OUTPUT_DIR = "../frontend/public/clothing-images"

GENDERS = ["Womens", "Mens"]

pg = PaletteGenerator()

url = "https://google.serper.dev/images"
headers = {
    "X-API-KEY": API_KEY,
    "Content-Type": "application/json",
}

total_queries = 0
total_downloaded = 0
total_failed = 0

# Collect all unique colors across all seasons
seen = set()
all_colors = []
for season in ["spring", "summer", "autumn", "winter"]:
    for color in pg.generate(season):
        if color.name not in seen:
            seen.add(color.name)
            all_colors.append(color)

print(f"Found {len(all_colors)} unique colors across all seasons")


def fetch_image(query: str, filepath: str) -> bool:
    """Fetch first image result for a query and save it."""
    global total_queries, total_downloaded, total_failed
    total_queries += 1

    try:
        response = requests.post(url, headers=headers, json={"q": query, "num": 1})
        if response.status_code != 200:
            print(f"    API error: {response.status_code}")
            total_failed += 1
            return False

        data = response.json()
        if "images" not in data or len(data["images"]) == 0:
            print(f"    No results")
            total_failed += 1
            return False

        image_url = data["images"][0].get("imageUrl", "")
        img_response = requests.get(image_url, timeout=10, headers={
            "User-Agent": "Mozilla/5.0"
        })

        if img_response.status_code == 200:
            with open(filepath, "wb") as f:
                f.write(img_response.content)
            size_kb = len(img_response.content) / 1024
            print(f"    Saved: {filepath} ({size_kb:.1f} KB)")
            total_downloaded += 1
            return True
        else:
            print(f"    Download failed: HTTP {img_response.status_code}")
            total_failed += 1
            return False

    except Exception as e:
        print(f"    Error: {e}")
        total_failed += 1
        return False


for gender in GENDERS:
    for color in all_colors:
        safe_name = color.name.replace(" ", "_")

        # --- Tops: 3 query variants ---
        folder = f"{OUTPUT_DIR}/{gender}_{safe_name}_Top"
        os.makedirs(folder, exist_ok=True)

        print(f"\n--- {gender} {color.name} Top ---")
        top_queries = [
            f"{gender} {color.name} Top product photo no model front view",
            f"{gender} {color.name} Top flat lay",
            f"{gender} {color.name} Top flat lay no model",
        ]
        for i, query in enumerate(top_queries):
            print(f"  [{i+1}] {query}")
            fetch_image(query, f"{folder}/{i+1}.jpg")

        time.sleep(0.2)

        # --- Bottoms: garment-specific queries ---
        folder = f"{OUTPUT_DIR}/{gender}_{safe_name}_Bottom"
        os.makedirs(folder, exist_ok=True)

        print(f"\n--- {gender} {color.name} Bottom ---")
        if gender == "Womens":
            bottom_queries = [
                f"Womens {color.name} dress product photo",
                f"Womens {color.name} pants product photo",
                f"Womens {color.name} shorts product photo",
            ]
            labels = ["dress", "pants", "shorts"]
        else:
            bottom_queries = [
                f"Mens {color.name} pants product photo",
                f"Mens {color.name} shorts product photo",
                f"Mens {color.name} joggers product photo",
            ]
            labels = ["pants", "shorts", "joggers"]

        for i, (query, label) in enumerate(zip(bottom_queries, labels)):
            print(f"  [{i+1}] {query}")
            fetch_image(query, f"{folder}/{i+1}_{label}.jpg")

        time.sleep(0.2)

print(f"\n{'='*60}")
print(f"Done! Queries: {total_queries}, Downloaded: {total_downloaded}, Failed: {total_failed}")
print(f"\nNext steps:")
print(f"1. Browse folders in {OUTPUT_DIR}/")
print(f"2. Pick the best image from each folder")
print(f"3. Rename your choice to: {OUTPUT_DIR}/{{Gender}}_{{Color}}_{{Category}}.jpg")
print(f"   Example: {OUTPUT_DIR}/Womens_Coral_Top.jpg")
