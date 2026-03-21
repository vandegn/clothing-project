"""
Test script: Serper.dev Google Image Search query.
Fetches 3 product images per color/gender/category combo using different query styles.

Usage:
  python test_image_search.py

Requires SERPER_API_KEY in backend/.env
"""

import os
import requests
from dotenv import load_dotenv

load_dotenv(".env")

API_KEY = os.getenv("SERPER_API_KEY", "YOUR_SERPER_API_KEY_HERE")

# Test with one specific combo
COLOR = "Coral"
GENDER = "Womens"
CATEGORY = "Top"

# Three different query styles for variety
queries = [
    f"{GENDER} {COLOR} {CATEGORY} product photo no model front view",
    f"{GENDER} {COLOR} {CATEGORY} flat lay",
    f"{GENDER} {COLOR} {CATEGORY} flat lay no model",
]

url = "https://google.serper.dev/images"
headers = {
    "X-API-KEY": API_KEY,
    "Content-Type": "application/json",
}

folder = f"test_images/{GENDER}_{COLOR}_{CATEGORY}"
os.makedirs(folder, exist_ok=True)

for i, query in enumerate(queries):
    print(f"\n[{i+1}] Query: {query}")

    response = requests.post(url, headers=headers, json={"q": query, "num": 1})

    if response.status_code != 200:
        print(f"    Error: {response.text}")
        continue

    data = response.json()
    if "images" not in data or len(data["images"]) == 0:
        print("    No results found.")
        continue

    item = data["images"][0]
    image_url = item.get("imageUrl", "")
    title = item.get("title", "Unknown")
    source = item.get("source", "Unknown")

    print(f"    Title: {title}")
    print(f"    Source: {source}")
    print(f"    URL: {image_url}")

    filename = f"{folder}/{i+1}.jpg"

    try:
        img_response = requests.get(image_url, timeout=10, headers={
            "User-Agent": "Mozilla/5.0"
        })
        if img_response.status_code == 200:
            with open(filename, "wb") as f:
                f.write(img_response.content)
            size_kb = len(img_response.content) / 1024
            print(f"    Saved: {filename} ({size_kb:.1f} KB)")
        else:
            print(f"    Failed to download: HTTP {img_response.status_code}")
    except Exception as e:
        print(f"    Failed to download: {e}")
