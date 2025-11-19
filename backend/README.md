Smart Food Recommender — Backend
This is the backend API service for the Smart Food Recommender application. It provides endpoints to fetch food recommendations based on user location and weather, and to generate step-by-step recipes and food descriptions using AI.

Features
Accepts latitude, longitude, and location to return food recommendations tailored to weather and context.

Integrates with OpenWeather API to fetch live weather data per user location.

AI-assisted endpoints that generate recipes and food descriptions as JSON strings with rich formatting.

Supports meal context categorization for breakfast, lunch, dinner, snacks, and late-night meals.

Tech stack
Python 3.x with Flask or FastAPI.

Requests or httpx for OpenWeather API calls.

AI model integration via local services or API (e.g., Perplexity).

Local JSON data store (food_data.json or similar) for food meta-data and ratings.

Setup
Clone this repository.

Create and activate a Python virtual environment.

Install requirements using pip install -r requirements.txt.

Create a .env (or config.py) file with your OpenWeather API key:
OPENWEATHER_API_KEY=your_api_key_here

Run the backend server using python app.py or equivalent command.

API endpoints
POST /recommend
Request body (JSON):

```
json
{
  "latitude": 40.7128,
  "longitude": -74.0060,
  "location": "New York, USA"
}
```

Response (JSON):
```
json
{
  "recommendations": [
    {
      "name": "Spicy Chicken Wings",
      "category": "bbqs",
      "price": "$12.99",
      "rating": 4.5,
      "img": "https://example.com/image.jpg",
      // additional fields...
    },
    ...
  ],
  "weather": {
    "weather": [
      {
        "main": "Clear",
        "description": "clear sky"
      }
    ],
    "main": {
      "temp": 298.15
    },
    "timezone": -14400
  }
}
```

POST /generate_recipe
Request body (JSON):

```
json
{
  "food_name": "Spicy Chicken Wings"
}
```

Response (JSON):
```
json
{
  "recipe": "{\"steps\": \"<ol><li>Step 1...</li></ol>\", \"video_link\": \"https://www.youtube.com/watch?v=abc123\"}"
}
```

POST /generate_description
Request body (JSON):

```
json
{
  "food_name": "Spicy Chicken Wings"
}
```

Response (JSON):
```
json
{
  "description": "{\"description\": \"A delicious spicy chicken wings recipe ...\"}"
}
```

Configuration
OPENWEATHER_API_KEY: Your API key for accessing OpenWeather data.

food_data.json: Local dataset with food items, categories, prices, ratings, and images.

Meal category mapping logic (modifiable in meal_time.py or equivalent).

Workflow
The backend fetches weather info using OpenWeather API for the given coordinates.

Based on weather and meal time, filters and ranks foods from local data.

Generates AI-powered recipe and description upon request using consistent prompt structure.

Returns recommendation lists and AI content to frontend.

Running locally
Install and activate Python environment.

Run Flask/FastAPI dev server: e.g., flask run or uvicorn app:app --reload.

Make POST requests using curl, Postman, or frontend app.

Dependencies
Flask or FastAPI (or your chosen framework).

Requests, httpx.

python-dotenv (for env vars).

Any AI integration library/sdk you use.

Notes
Make sure backend properly caches or limits API calls to OpenWeather for cost-efficiency.

Validate input coordinates and sanitize user parameters for security.

AI responses should be sanitized if directly embedded as HTML in frontend.