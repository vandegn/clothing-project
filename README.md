# Color Palette Analyzer

A web application that analyzes selfies to extract eye, hair, and skin colors, determines your seasonal color palette, and recommends matching clothing.

## Features

- **AI-Powered Color Analysis**: Uses Google MediaPipe and OpenCV to detect facial features and extract colors
- **Seasonal Color Theory**: Determines if you're a Spring, Summer, Autumn, or Winter type
- **Personalized Palette**: Generates a 16-color palette tailored to your coloring
- **Clothing Recommendations**: Suggests clothing items that match your colors (via Amazon)

## Tech Stack

- **Frontend**: Next.js 14, React 18, Tailwind CSS
- **Backend**: Python FastAPI
- **Image Processing**: Google MediaPipe, OpenCV, scikit-learn
- **Product Search**: Axesso API (via RapidAPI) with mock fallback

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Python 3.11+
- pip

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
   cp .env.local.example .env.local
   ```

4. **Configure environment variables**

   Edit `frontend/.env.local` and add your RapidAPI key (optional - uses mock data without it):
   ```
   RAPIDAPI_KEY=your_rapidapi_key_here
   ```

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
- API Docs: http://localhost:8000/docs

## Project Structure

```
clothing-project/
├── frontend/                 # Next.js application
│   ├── src/
│   │   ├── app/             # Pages and API routes
│   │   ├── components/      # React components
│   │   └── lib/             # Utilities and types
│   └── package.json
├── backend/                  # FastAPI application
│   ├── app/
│   │   ├── main.py          # FastAPI entry point
│   │   ├── routers/         # API endpoints
│   │   ├── services/        # Business logic
│   │   └── models/          # Pydantic schemas
│   └── requirements.txt
├── docker-compose.yml
└── README.md
```

## API Endpoints

### Backend (FastAPI)

- `POST /api/analyze` - Analyze an image and return color palette
  - Body: `{ "image": "base64_encoded_image" }`
  - Returns: Season, colors, palette, undertone, contrast

### Frontend (Next.js)

- `GET /api/products?color=olive&category=shirt` - Search for products
  - Uses Axesso API if key is configured, otherwise returns mock data

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
