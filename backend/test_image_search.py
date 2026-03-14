"""
Test script: Single Google Custom Search API image query.
Fetches the first product image for one color/gender/category combo.

Usage:
  python test_image_search.py

Requires GOOGLE_API_KEY and GOOGLE_CSE_ID in backend/.env
"""

import os
import requests
from dotenv import load_dotenv

load_dotenv(".env")

API_KEY = os.getenv("GOOGLE_API_KEY") or os.getenv("GEMINI_API_KEY", "YOUR_GOOGLE_API_KEY_HERE")
CSE_ID = os.getenv("GOOGLE_CSE_ID", "f13b4900822b844f9")

# Test with one specific combo
COLOR = "Coral"
GENDER = "Womens"
CATEGORY = "Top"

query = f"{GENDER} {COLOR} color {CATEGORY}"
print(f"Query: {query}")

# Google Custom Search API - image search
url = "https://www.googleapis.com/customsearch/v1"
params = {
    "key": API_KEY,
    "cx": CSE_ID,
    "q": query,
    "searchType": "image",
    "num": 1,
    "imgType": "photo",
    "safe": "active",
}

response = requests.get(url, params=params)
print(f"Status: {response.status_code}")

if response.status_code != 200:
    print(f"Error: {response.text}")
    exit(1)

data = response.json()

if "items" not in data or len(data["items"]) == 0:
    print("No results found.")
    exit(1)

item = data["items"][0]
image_url = item["link"]
title = item.get("title", "Unknown")
source = item.get("displayLink", "Unknown")

print(f"Title: {title}")
print(f"Source: {source}")
print(f"Image URL: {image_url}")

# Download the image
os.makedirs("test_images", exist_ok=True)
filename = f"test_images/{GENDER}_{COLOR}_{CATEGORY}.jpg"

img_response = requests.get(image_url, timeout=10, headers={
    "User-Agent": "Mozilla/5.0"
})

if img_response.status_code == 200:
    with open(filename, "wb") as f:
        f.write(img_response.content)
    size_kb = len(img_response.content) / 1024
    print(f"Saved: {filename} ({size_kb:.1f} KB)")
else:
    print(f"Failed to download image: {img_response.status_code}")
