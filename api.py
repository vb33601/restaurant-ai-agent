from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import json
import random

app = Flask(__name__)
CORS(app)

# OpenStreetMap APIs
NOMINATIM_API = "https://nominatim.openstreetmap.org/search"
OVERPASS_API = "https://overpass-api.de/api/interpreter"

@app.route('/api/restaurants', methods=['GET'])
def get_restaurants():
    location = request.args.get('location', 'Bangalore')
    cuisine = request.args.get('cuisine', '')
    
    try:
        # Step 1: Get coordinates from Nominatim
        coords = get_coordinates(location)
        if not coords:
            return jsonify({'success': False, 'error': 'Location not found'}), 404
        
        # Step 2: Search restaurants using Overpass API
        restaurants = search_overpass(coords['lat'], coords['lon'], cuisine)
        
        if len(restaurants) == 0:
            # Fallback: Use Nominatim search
            restaurants = search_nominatim(location, cuisine)
        
        return jsonify({
            'success': True,
            'restaurants': restaurants,
            'count': len(restaurants),
            'location': location,
            'cuisine': cuisine
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

def get_coordinates(location):
    try:
        params = {
            'format': 'json',
            'q': f'{location}, Bangalore, India'
        }
        response = requests.get(NOMINATIM_API, params=params, timeout=10)
        data = response.json()
        
        if data and len(data) > 0:
            return {
                'lat': float(data[0]['lat']),
                'lon': float(data[0]['lon'])
            }
        return None
    except Exception as e:
        print(f"Error getting coordinates: {e}")
        return None

def search_overpass(lat, lon, cuisine):
    try:
        # Build cuisine filter
        cuisine_filter = ''
        if cuisine:
            cuisine_map = {
                'indian': 'indian',
                'chinese': 'chinese',
                'italian': 'italian',
                'mexican': 'mexican',
                'thai': 'thai',
                'japanese': 'japanese',
                'american': 'american',
                'fast food': 'fast_food'
            }
            
            cuisine_lower = cuisine.lower()
            if cuisine_lower in cuisine_map:
                cuisine_filter = f'["cuisine"~"{cuisine_map[cuisine_lower]}"]'
        
        # Overpass query
        query = f"""
            [out:json];
            node["amenity"="restaurant"]{cuisine_filter}(around:5000,{lat},{lon});
            out body;
        """
        
        response = requests.post(OVERPASS_API, data=query, timeout=15)
        data = response.json()
        
        restaurants = []
        if 'elements' in data:
            for element in data['elements']:
                tags = element.get('tags', {})
                restaurants.append({
                    'id': element.get('id', ''),
                    'name': tags.get('name', 'Unnamed Restaurant'),
                    'cuisine': tags.get('cuisine', 'Multi-Cuisine'),
                    'rating': round(random.uniform(3.5, 4.8), 1),
                    'review_count': random.randint(50, 5000),
                    'price_range': tags.get('price_range', '₹₹'),
                    'delivery_time': random.randint(20, 45),
                    'address': tags.get('addr:street', 'Bangalore'),
                    'phone': tags.get('phone', 'N/A'),
                    'tags': (tags.get('cuisine', 'restaurant')).split(';'),
                    'menu': generate_menu(tags.get('cuisine', 'Indian'))
                })
        
        return restaurants
    except Exception as e:
        print(f"Error with Overpass: {e}")
        return []

def search_nominatim(location, cuisine):
    try:
        query = f"{cuisine} restaurants in {location} Bangalore" if cuisine else f"restaurants in {location} Bangalore"
        
        params = {
            'format': 'json',
            'q': query
        }
        
        response = requests.get(NOMINATIM_API, params=params, timeout=10)
        data = response.json()
        
        restaurants = []
        if data:
            for i, place in enumerate(data[:10]):  # Limit to 10 results
                display_name = place.get('display_name', '')
                name = display_name.split(',')[0] if display_name else 'Restaurant'
                
                restaurants.append({
                    'id': place.get('place_id', i),
                    'name': name,
                    'cuisine': cuisine or 'Multi-Cuisine',
                    'rating': round(random.uniform(3.5, 4.8), 1),
                    'review_count': random.randint(50, 5000),
                    'price_range': '₹₹',
                    'delivery_time': random.randint(20, 45),
                    'address': display_name or location,
                    'phone': 'N/A',
                    'tags': [cuisine or 'restaurant'],
                    'menu': generate_menu(cuisine or 'Indian')
                })
        
        return restaurants
    except Exception as e:
        print(f"Error with Nominatim: {e}")
        return []

def generate_menu(cuisine):
    menu_map = {
        'indian': [
            {'name': 'Butter Chicken', 'price': 280, 'is_veg': False},
            {'name': 'Paneer Tikka', 'price': 220, 'is_veg': True},
            {'name': 'Naan', 'price': 40, 'is_veg': True},
            {'name': 'Biryani', 'price': 250, 'is_veg': False},
            {'name': 'Dal Makhani', 'price': 180, 'is_veg': True},
            {'name': 'Tandoori Roti', 'price': 30, 'is_veg': True},
            {'name': 'Chicken Tikka', 'price': 260, 'is_veg': False},
            {'name': 'Gulab Jamun', 'price': 60, 'is_veg': True}
        ],
        'south indian': [
            {'name': 'Masala Dosa', 'price': 80, 'is_veg': True},
            {'name': 'Idli Sambar', 'price': 60, 'is_veg': True},
            {'name': 'Vada', 'price': 50, 'is_veg': True},
            {'name': 'Uttapam', 'price': 70, 'is_veg': True},
            {'name': 'Filter Coffee', 'price': 30, 'is_veg': True},
            {'name': 'Rava Dosa', 'price': 85, 'is_veg': True},
            {'name': 'Pongal', 'price': 65, 'is_veg': True},
            {'name': 'Kesari Bath', 'price': 55, 'is_veg': True}
        ],
        'chinese': [
            {'name': 'Kung Pao Chicken', 'price': 220, 'is_veg': False},
            {'name': 'Veg Hakka Noodles', 'price': 160, 'is_veg': True},
            {'name': 'Spring Rolls', 'price': 120, 'is_veg': True},
            {'name': 'Manchurian', 'price': 180, 'is_veg': True},
            {'name': 'Fried Rice', 'price': 140, 'is_veg': True},
            {'name': 'Chilli Chicken', 'price': 200, 'is_veg': False},
            {'name': 'Dim Sum', 'price': 150, 'is_veg': True},
            {'name': 'Hot and Sour Soup', 'price': 90, 'is_veg': True}
        ],
        'italian': [
            {'name': 'Margherita Pizza', 'price': 280, 'is_veg': True},
            {'name': 'Pasta Alfredo', 'price': 240, 'is_veg': True},
            {'name': 'Garlic Bread', 'price': 80, 'is_veg': True},
            {'name': 'Tiramisu', 'price': 180, 'is_veg': True},
            {'name': 'Lasagna', 'price': 260, 'is_veg': False},
            {'name': 'Bruschetta', 'price': 120, 'is_veg': True},
            {'name': 'Risotto', 'price': 220, 'is_veg': True},
            {'name': 'Panna Cotta', 'price': 150, 'is_veg': True}
        ]
    }
    
    cuisine_lower = (cuisine or 'indian').lower()
    
    for key, menu in menu_map.items():
        if key in cuisine_lower:
            return menu
    
    return menu_map['indian']

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'ok'})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)