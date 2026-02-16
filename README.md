# Chromatic — Discover Your Color Season

A web application that analyzes selfies to extract eye, hair, and skin colors, determines your seasonal color palette, and recommends matching clothing.

## Features

- **AI-Powered Color Analysis**: Uses Google MediaPipe for face mesh and image segmentation, plus K-means clustering to extract dominant eye, hair, and skin colors
- **Seasonal Color Theory**: Determines if you're a Spring, Summer, Autumn, or Winter type based on undertone and contrast
- **Personalized Palette**: Generates a curated 16-color palette tailored to your coloring
- **Clothing Recommendations**: Links to Amazon search results for clothing in your recommended colors, filtered by gender and category (tops/bottoms)
- **Virtual Try-On** (coming soon): Upload a full-body photo and a clothing item to see how it looks on you
- **Authentication**: Google OAuth via Supabase for the try-on feature

## Tech Stack

- **Frontend**: Next.js 16, React 19, Tailwind CSS 4
- **Backend**: Python FastAPI
- **Image Processing**: Google MediaPipe, OpenCV, scikit-learn (K-means)
- **Auth**: Supabase (Google OAuth)
- **Fonts**: Playfair Display (display headings) + DM Sans (body text)

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Python 3.11+

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/clothing-project.git
   cd clothing-project
   ```

2. **Set up the backend**
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

3. **Set up the frontend**
   ```bash
   cd frontend
   npm install
   ```

4. **Configure environment variables**

   Create `frontend/.env.local`:
   ```
   NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

   The Supabase variables are required for the `/tryon` auth flow. The color analysis feature on the home page works without them.

### Running the Application

**Option 1: Run separately**

Terminal 1 (Backend):
```bash
cd backend
source venv/bin/activate  # On Windows: venv\Scripts\activate
uvicorn app.main:app --reload
```

Terminal 2 (Frontend):
```bash
cd frontend
npm run dev
```

**Option 2: Docker Compose**
```bash
docker-compose up
```

### Access the Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs (Swagger): http://localhost:8000/docs

## Project Structure

```
clothing-project/
├── frontend/                 # Next.js application
│   ├── src/
│   │   ├── app/             # Pages (home, login, tryon, auth callback)
│   │   ├── components/      # React components
│   │   └── lib/             # API client, types, Supabase clients
│   └── package.json
├── backend/                  # FastAPI application
│   ├── app/
│   │   ├── main.py          # FastAPI entry point
│   │   ├── routers/         # API endpoints (analyze)
│   │   ├── services/        # Image analysis pipeline
│   │   └── models/          # Pydantic schemas + TFLite model
│   └── requirements.txt
├── supabase/                 # Supabase config (migrations, functions)
├── docker-compose.yml
└── README.md
```

## API

### `POST /api/analyze`

Analyze a selfie and return a seasonal color palette.

**Request:**
```json
{ "image": "base64_encoded_image" }
```

**Response:**
```json
{
  "colors": { "eyes": "#4A6741", "hair": "#3B2417", "skin": "#D4A574" },
  "season": "autumn",
  "season_description": "...",
  "undertone": "warm",
  "contrast": "high",
  "palette": [{ "hex": "#8B4513", "name": "Saddle Brown" }, ...],
  "debug_info": { "sample_points": [...], "image_width": 640, "image_height": 480 }
}
```

## Color Theory

The app uses the 4-season color analysis system:

| Season | Undertone | Contrast | Best Colors |
|--------|-----------|----------|-------------|
| Spring | Warm | Low-Medium | Bright, clear, warm |
| Summer | Cool | Low-Medium | Soft, muted, cool |
| Autumn | Warm | Medium-High | Rich, earthy, warm |
| Winter | Cool | Medium-High | Bold, vivid, cool |

## License

MIT
