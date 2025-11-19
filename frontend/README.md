Smart Food Recommender — Frontend

A React-based demo UI that suggests foods using location, weather, time of day, and user context, with a professional light/dark theme, formatted recipe rendering, and a single embedded YouTube video.

Features
Location-aware suggestions with selectable demo locations and current location support.

Professional theme with light/dark toggle, responsive layout, emoji accents, and smooth interactions.

Sorting by name, price, or rating with graceful handling of prices formatted like “$12.99.”

Weather-aware header that adapts to the selected location’s local time and conditions.

Rich recipe pop-up with HTML-formatted steps, YouTube embed, fallback image, and an “Order now” button.

Tech stack
React with functional components and hooks.

Plain CSS with theme variables and responsive design.

Fetch/axios-based API client pointed at the local backend.

Prerequisites
Node.js 18+ and npm installed.

A backend running locally on port 5000 (or provide a different API URL via environment variable).

Quick start
Open a terminal in the frontend directory.

Install dependencies with npm install.

Create a .env file with REACT_APP_API_URL (see below).

Start the app with npm start and open the shown local address in a browser.

Environment variables
REACT_APP_API_URL: Base URL for the backend (default is http://localhost:5000 if unset).

Example .env contents:

REACT_APP_API_URL=http://localhost:5000

Scripts
Start development server: npm start

Build for production: npm run build

Preview production build (if configured): npm run preview

Project structure
src/

components/

App-level UI: LocationInput, RecommendationList, FoodCard, FoodDetailModal

services/

api.js (client for POST /recommend and other endpoints)

assets/

Image_not_available.png and background images for initial screen

index.css (global styles, theme variables, responsive rules)

App.js (root app, theme toggle, fetch + sorting + layout)

App flow
LocationInput sets latitude/longitude/name either from the browser’s geolocation or from the demo dropdown.

App triggers a fetch when location changes, receives recommendations and weather, builds a helpful weather/time message, and renders a grid.

RecommendationList renders FoodCard tiles. Clicking a tile opens FoodDetailModal.

FoodDetailModal can generate recipe steps (HTML string) and an about text; it embeds one YouTube video and shows a local fallback image if the remote URL fails.

Backend API contract (expected)
POST /recommend

Body: { latitude, longitude, location }

Returns: { recommendations: [...], weather: { weather: [{ main }], main: { temp }, timezone } }

POST /generate_recipe

Body: { food_name }

Returns: { recipe: "<stringified JSON>" } where the string parses to { steps: "<HTML string>", video_link: "<YouTube URL>" }

POST /generate_description

Body: { food_name }

Returns: { description: "<stringified JSON>" } where the string parses to { description: "<text>" }

Theming
Light/dark mode is controlled by a theme state and applied to the root element via data-theme.

Colors are defined as CSS variables in index.css for both modes.

Dark mode is tuned to be professional and not overly dark.

Sorting
Controlled by a select input in the top bar: name, price, or rating.

Prices can be numbers or strings like “$12.99”; a helper strips non-numeric characters before numeric comparison.

Ratings sort descending and names sort lexicographically.

Recipe rendering and video
The recipe “steps” value is an HTML string and is rendered with a safe container using dangerouslySetInnerHTML; only use content from trusted sources.

The video link is converted from a standard watch URL to an embed URL inside the modal’s iframe.

The assistant is instructed to return exactly one YouTube link.

Order now button
In the modal’s header row, an “Order now” button opens a new tab with a prefilled search like “order <food name> online.”

You can change this to a real partner or restaurant link later.

Images and fallbacks
FoodDetailModal and FoodCard support a local fallback image (Image_not_available.png) if the provided img URL is missing or broken.

Place your fallback image under src/assets and update the imports accordingly.

Demo locations and local time
LocationInput provides several far-apart cities to showcase different time-of-day and weather messages.

Selecting “Current Location” prompts a fresh geolocation request so the app can refetch for your position.

Windows notes
Use a standard terminal or PowerShell to run npm commands.

Place .env in the frontend root and restart the dev server after changes.

Troubleshooting
Current Location reselect does nothing: ensure the dropdown calls geolocation again and that browser location permissions are granted.

Duplicate key warnings in lists: use a composite key like name-index when items might share names.

YouTube not loading: ensure the link is a proper watch URL and is transformed to an embed path before rendering.

Strange temperatures: ensure the backend requests weather with metric units and passes the timezone offset so the UI can compute local time correctly.

Price sorting wrong: ensure the app strips currency symbols and parses the number before comparing.

Customization
Update demo locations in LocationInput to match your target audience.

Tweak theme variables in index.css for brand colors and contrast.

Adjust weather text generation in App.js to reflect your tone and categories.

Style FoodCard with additional badges like rating or price bands.

Security considerations
Rendering HTML from an external source can be risky; only allow trusted content and sanitize if needed.

Do not expose secrets in the frontend; use environment variables and keep keys server-side.

License

Acknowledgements
Thanks to the open-source React ecosystem and weather/data providers used by the backend.