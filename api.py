from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import json

app = Flask(__name__)
CORS(app)

# Swiggy API endpoint
SWIGGY_API = "https://www.swiggy.com/dapi/restaurants/list/v5"

@app.route('/api/restaurants', methods=['GET'])
def get_restaurants():
    location = request.args.get('location', 'Bangalore')
    cuisine = request.args.get('cuisine', '')
    
    try:
        # Fetch from Swiggy
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
        
        # Get coordinates for location (simplified)
        lat, lng = get_coordinates(location)
        
        params = {
            'lat': lat,
            'lng': lng,
            'page_type': 'DESKTOP_WEB_LISTING'
        }
        
        response = requests.get(SWIGGY_API, params=params, headers=headers)
        data = response.json()
        
        restaurants = process_swiggy_data(data)
        
        return jsonify({
            'success': True,
            'restaurants': restaurants,
            'count': len(restaurants)
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

def get_coordinates(location):
    # Simplified coordinate mapping
    coordinates = {
        'Whitefield': (12.9698, 77.7499),
        'Koramangala': (12.9352, 77.6245),
        'Indiranagar': (12.9784, 77.6408),
        'MG Road': (12.9733, 77.6101),
        'HSR Layout': (12.9081, 77.6476),
        'Electronic City': (12.8458, 77.6717),
        'JP Nagar': (12.9078, 77.5859),
        'Jayanagar': (12.9299, 77.5838)
    }
    return coordinates.get(location, (12.9716, 77.5946))

def process_swiggy_data(data):
    restaurants = []
    
    if 'data' in data and 'cards' in data['data']:
        for card in data['data']['cards']:
            if 'card' in card and 'card' in card['card']:
                grid = card['card']['card'].get('gridElements', {})
                if 'infoWithStyle' in grid and 'restaurants' in grid['infoWithStyle']:
                    for rest in grid['infoWithStyle']['restaurants']:
                        info = rest.get('info', {})
                        restaurants.append({
                            'id': info.get('id', ''),
                            'name': info.get('name', ''),
                            'cuisine': ', '.join(info.get('cuisines', [])),
                            'rating': info.get('avgRating', 4.0),
                            'review_count': info.get('totalRatingsString', '100+'),
                            'price_range': info.get('costForTwo', '₹200 for two'),
                            'delivery_time': info.get('sla', {}).get('deliveryTime', 30),
                            'address': info.get('locality', 'Bangalore'),
                            'image': info.get('cloudinaryImageId', ''),
                            'menu': generate_menu(info.get('cuisines', ['Indian']))
                        })
    
    return restaurants

def generate_menu(cuisines):
    menu = []
    
    for cuisine in cuisines[:2]:  # Top 2 cuisines
        if 'Indian' in cuisine or 'North Indian' in cuisine:
            menu.extend([
                {'name': 'Butter Chicken', 'price': 280, 'is_veg': False},
                {'name': 'Paneer Tikka', 'price': 220, 'is_veg': True},
                {'name': 'Naan', 'price': 40, 'is_veg': True},
                {'name': 'Biryani', 'price': 250, 'is_veg': False}
            ])
        elif 'South Indian' in cuisine:
            menu.extend([
                {'name': 'Masala Dosa', 'price': 80, 'is_veg': True},
                {'name': 'Idli Sambar', 'price': 60, 'is_veg': True},
                {'name': 'Vada', 'price': 50, 'is_veg': True},
                {'name': 'Filter Coffee', 'price': 30, 'is_veg': True}
            ])
        elif 'Chinese' in cuisine:
            menu.extend([
                {'name': 'Kung Pao Chicken', 'price': 220, 'is_veg': False},
                {'name': 'Veg Noodles', 'price': 160, 'is_veg': True},
                {'name': 'Spring Rolls', 'price': 120, 'is_veg': True},
                {'name': 'Fried Rice', 'price': 140, 'is_veg': True}
            ])
        elif 'Italian' in cuisine or 'Pizza' in cuisine:
            menu.extend([
                {'name': 'Margherita Pizza', 'price': 280, 'is_veg': True},
                {'name': 'Pasta Alfredo', 'price': 240, 'is_veg': True},
                {'name': 'Garlic Bread', 'price': 80, 'is_veg': True},
                {'name': 'Tiramisu', 'price': 180, 'is_veg': True}
            ])
    
    if not menu:
        menu = [
            {'name': 'Special Dish', 'price': 200, 'is_veg': True},
            {'name': 'Chef\'s Special', 'price': 250, 'is_veg': False}
        ]
    
    return menu

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)