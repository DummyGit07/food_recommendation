# Smart Food Recommender

A context-aware food recommendation application that suggests meals based on user location, weather, and time of day. Features a React-based frontend and a Python backend integrating weather data and AI-generated recipes.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Frontend Setup](#frontend-setup)
- [Backend Setup](#backend-setup)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Configuration](#configuration)
- [Theming & UI](#theming--ui)
- [Sorting & Filtering](#sorting--filtering)
- [Recipe & Video Integration](#recipe--video-integration)
- [Order Now Button](#order-now-button)
- [Images & Fallbacks](#images--fallbacks)
- [Demo Locations & Time Awareness](#demo-locations--time-awareness)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgements](#acknowledgements)

---

## Features

- Location and weather-aware food recommendations  
- Professional light/dark mode toggle with clean, responsive UI  
- Selectable demo locations and current geolocation support  
- Sorting by name, price, or rating with currency‑aware filtering  
- AI-generated, step-by-step HTML recipe and food descriptions  
- Single embedded YouTube video per recipe  
- “Order now” button linking to online search for food ordering  
- Fallback images for missing food photos  
- Timezone-aware messages adapting to user location and local time  

---

## Tech Stack

- Frontend: React with Hooks, plain CSS  
- Backend: Python, Flask/FastAPI, OpenWeather API integration  
- AI integration for recipe and description generation  
- Axios or fetch for API requests  

---

## Installation

### Frontend

cd frontend
npm install

```
Create `.env` file:
```

REACT_APP_API_URL=http://localhost:5000

```
Start development server:

npm start
```

### Backend

cd backend
python -m venv venv
source venv/bin/activate # or venv\Scripts\activate on Windows
pip install -r requirements.txt

```
Create `.env` file with:
OPENWEATHER_API_KEY=your_openweather_api_key_here
```

```
Start backend:

python app.py
```

---

## Usage

- Select or use current location on frontend  
- View weather-aware message above recommendations  
- Sort the list by name, price, or rating  
- Click any food card to see recipe, description, and order button  
- Generate recipe steps and watch embedded cooking video  

---

## API Endpoints

- **POST** `/recommend` - Takes `latitude`, `longitude`, `location` and returns recommendations + weather data  
- **POST** `/generate_recipe` - Takes `food_name`, returns JSON with HTML steps and YouTube video link  
- **POST** `/generate_description` - Takes `food_name`, returns JSON with description text  

---

## Configuration

- Backend uses `.env` for API keys  
- Frontend uses `.env` for backend URL  
- Meal category mappings and food data JSON are customizable  

---

## Theming & UI

- CSS variables for light/dark mode applied to root element  
- Professional dark mode selected for readability without harsh blacks  
- Responsive layout with emoji-enhanced headings and buttons  
- Recipe steps rendered as trusted HTML safely  

---

## Sorting & Filtering

- Price strings cleaned from currency symbols for numeric sort  
- Name sorted lexicographically  
- Rating sorted descending

---

## Recipe & Video Integration

- Recipe steps received as HTML string and injected using `dangerouslySetInnerHTML`  
- Single YouTube video link processed and embedded as iframe  
- Backend ensures only one video is returned  

---

## Order Now Button

- Adds an “Order now” button on the modal that links to Google search for ordering the food, opening in a new tab  
- Easily replaceable with restaurant or affiliate URLs  

---

## Images & Fallbacks

- Food images fall back to a local placeholder when missing or broken in both FoodCard and FoodDetailModal  
- Local fallback image located at `src/assets/Image_not_available.png`  

---

## Demo Locations & Time Awareness

- Demo locations include diverse global cities to show timezone-aware weather context  
- Local time at selected location is computed via timezone offset from OpenWeather API  
- Weather messages adapt appropriately by location and time (morning, afternoon, night)  

---

## Troubleshooting

- Duplicate keys in lists fixed by composite `key={`${item.name}-${index}`}` usage  
- Locations dropdown re-fetches geolocation on selecting “Current Location” multiple times  
- Temperature bug fixed by using metric units from backend without Kelvin offset  
- If YouTube videos do not load, ensure proper URL format  
- Ensure API URL matches backend origin  

---

## Contributing

Contributions welcome! Feel free to raise PRs with improvements, bug fixes, or new features. Please maintain code quality and add tests where needed.

---

## License


---

## Acknowledgements

Thanks to React community, OpenWeather, and AI model providers powering this project.

---

*This README was generated based on project structure and best practices for clear documentation.*