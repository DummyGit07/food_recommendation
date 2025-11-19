import requests
from flask import Flask, request, jsonify
import json
import os
from flask_cors import CORS
from .utils.meal_time import get_meal_time_category
from .services.weather_service import get_current_weather
from perplexity import Perplexity

app = Flask(__name__)
CORS(app)  # Enable CORS globally

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_FILE_PATH = os.path.join(BASE_DIR, "data", "food_data.json")

with open(DATA_FILE_PATH, "r", encoding="utf-8") as f:
    raw_food_data = json.load(f)

all_food_items = []
for category, items in raw_food_data.items():
    if isinstance(items, list):
        for item in items:
            item["_category"] = category  # add category info for filtering
            all_food_items.append(item)


# Initialize client
client = Perplexity(api_key=os.environ.get("PERPLEXITY_API_KEY"))

def call_perplexity_api(prompt):
    try:
        completion = client.chat.completions.create(
            model="sonar-pro",   # Use your specific model name
            messages=[
                {"role": "user", "content": prompt}
            ]
        )
        return completion.choices[0].message.content
    except Exception as e:
        print(f"Error calling Perplexity API: {e}")
        return "API request failed"



@app.route("/")
def home():
    return "Food Recommendation API is running. Use POST /recommend"


@app.route("/recommend", methods=["POST"])
def recommend_food():
    data = request.json
    lat = data.get("latitude")
    lon = data.get("longitude")
    user_location = data.get("location", "Your Location")

    # 1. Determine meal time category using user coordinates
    meal_time = get_meal_time_category(lat, lon)

    # 2. Get current weather
    weather = get_current_weather(lat, lon)
    temp = weather.get("main", {}).get("temp", 25)
    weather_desc = weather.get("weather", [{}])[0].get("main", "").lower()

    # 3. Meal time to relevant categories mapping
    meal_category_map = {
        # Lighter, energy-friendly options; avoid making desserts/chocolates the main category
        "breakfast": ["breads", "best-foods", "sandwiches", "drinks"],

        # Heavier options are acceptable here as the main meal of the day
        "lunch": ["bbqs", "burgers", "pizzas", "steaks", "sausages", "fried-chicken"],

        # Treat-focused, but conceptually smaller portions
        "snack": ["sandwiches", "ice-cream", "desserts", "drinks", "chocolates"],

        # Main evening meal; still tasty, but shift the heaviest fried items earlier in the day
        "dinner": ["bbqs", "steaks", "porks", "burgers", "pizzas", "sandwiches"],

        # Keep it light at night; mostly easy-to-digest, avoid fried/very heavy items
        "late-night": ["breads", "sandwiches", "drinks", "chocolates", "desserts"],
    }


    categories_to_include = meal_category_map.get(meal_time.lower(), [])

    # 4. Filter by category and weather conditions
    filtered_items = []
    for item in all_food_items:
        item_cat = item.get("_category", "").lower()
        if item_cat in categories_to_include:
            # Weather filtering: exclude ice cream in cold/rainy weather
            if (temp < 18 or "rain" in weather_desc) and item_cat == "ice-cream":
                continue
            filtered_items.append(item)

    # 5. Generate dynamic order link for each item
    def generate_order_link(dish_name, user_location):
        baseurl = "https://www.google.com/search?q="
        query = f"order {dish_name.replace(' ', '+')} in {user_location.replace(' ', '+')}"
        return baseurl + query

    # After filtering food items and before returning:
    for item in filtered_items:
        item["orderLink"] = generate_order_link(item.get("name", ""), user_location)

    # Your final response:
    return jsonify({
        "mealtime": meal_time,
        "weather": weather,  # Existing weather data includes 'weather' key with description
        "recommendations": filtered_items,
    })


@app.route('/generate_recipe', methods=['POST'])
def generate_recipe():
    food_name = request.json.get('food_name', '')
    prompt = f"You are a professional chef assistant. The user has provided the food name: {food_name}. Please return a JSON object with keys 'steps' and 'video_link'. The value of 'steps' should be an HTML string containing the step-by-step instructions formatted as an ordered list (<ol><li>Step 1</li>...</ol>). The 'video_link' should be a single YouTube URL with no extra text, references, or formatting."
    recipe = call_perplexity_api(prompt)
    if "Error" in recipe:
        return jsonify({"error": recipe}), 500
    return jsonify({"recipe": recipe})


@app.route('/generate_description', methods=['POST'])
def generate_description():
    food_name = request.json.get("food_name", "")
    prompt = f"Write a delicious description for {food_name} in json format with key 'description' without any reference number, formatting etc."
    description_text = call_perplexity_api(prompt)
    if "Error" in description_text:
        return jsonify({"error": description_text}), 500
    return jsonify({"description": description_text})


if __name__ == "__main__":
    app.run(debug=True)
