from datetime import datetime, time
from timezonefinder import TimezoneFinder
import pytz

def get_meal_time_category(lat, lon):
    tf = TimezoneFinder()
    timezone_str = tf.timezone_at(lng=lon, lat=lat)
    if not timezone_str:
        timezone_str = "UTC"
    user_tz = pytz.timezone(timezone_str)
    user_time = datetime.now(user_tz).time()

    # Define meal time ranges
    if time(5, 0) <= user_time <= time(10, 59):
        return "breakfast"
    elif time(11, 0) <= user_time <= time(14, 59):
        return "lunch"
    elif time(15, 0) <= user_time <= time(17, 59):
        return "snack"
    elif time(18, 0) <= user_time <= time(21, 59):
        return "dinner"
    else:
        return "late-night"
