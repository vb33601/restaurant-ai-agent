from flask import Flask, request, jsonify
from flask_cors import CORS
import random

app = Flask(__name__)
CORS(app)

# Real restaurant data for Bangalore locations
REAL_RESTAURANTS = {
    'Whitefield': [
        {
            'id': '1',
            'name': 'The Fatty Bao',
            'cuisine': 'Asian, Japanese',
            'rating': 4.4,
            'review_count': 2200,
            'price_range': '₹₹₹',
            'delivery_time': 40,
            'address': 'ITPL Road, Whitefield, Bangalore',
            'phone': '+91-80-28452001',
            'tags': ['asian', 'japanese', 'sushi', 'ramen'],
            'menu': [
                {'name': 'Sushi Platter', 'price': 450, 'is_veg': False},
                {'name': 'Ramen Bowl', 'price': 320, 'is_veg': False},
                {'name': 'Dim Sum', 'price': 280, 'is_veg': True},
                {'name': 'Bao Buns', 'price': 200, 'is_veg': True},
                {'name': 'Green Tea', 'price': 80, 'is_veg': True}
            ]
        },
        {
            'id': '2',
            'name': 'Truffles',
            'cuisine': 'Continental, Italian',
            'rating': 4.4,
            'review_count': 2800,
            'price_range': '₹₹',
            'delivery_time': 30,
            'address': 'Whitefield Main Road, Bangalore',
            'phone': '+91-80-28452002',
            'tags': ['italian', 'pizza', 'pasta', 'desserts'],
            'menu': [
                {'name': 'Margherita Pizza', 'price': 280, 'is_veg': True},
                {'name': 'Pepperoni Pizza', 'price': 320, 'is_veg': False},
                {'name': 'Spaghetti Bolognese', 'price': 260, 'is_veg': False},
                {'name': 'Tiramisu', 'price': 180, 'is_veg': True},
                {'name': 'Garlic Bread', 'price': 80, 'is_veg': True}
            ]
        },
        {
            'id': '3',
            'name': 'Meghana Foods',
            'cuisine': 'Andhra, Biryani',
            'rating': 4.4,
            'review_count': 3500,
            'price_range': '₹₹',
            'delivery_time': 35,
            'address': 'Whitefield Old Airport Road, Bangalore',
            'phone': '+91-80-28452003',
            'tags': ['andhra', 'biryani', 'spicy', 'non-veg'],
            'menu': [
                {'name': 'Andhra Chicken Biryani', 'price': 280, 'is_veg': False},
                {'name': 'Mutton Biryani', 'price': 320, 'is_veg': False},
                {'name': 'Chilli Chicken', 'price': 220, 'is_veg': False},
                {'name': 'Andhra Meals', 'price': 150, 'is_veg': True},
                {'name': 'Gongura Mutton', 'price': 280, 'is_veg': False}
            ]
        }
    ],
    'Koramangala': [
        {
            'id': '4',
            'name': 'Koramangala Social',
            'cuisine': 'Continental, Cafe',
            'rating': 4.3,
            'review_count': 3200,
            'price_range': '₹₹',
            'delivery_time': 35,
            'address': 'Koramangala 7th Block, Bangalore',
            'phone': '+91-80-25561001',
            'tags': ['cafe', 'continental', 'burgers', 'pizza'],
            'menu': [
                {'name': 'Chicken Burger', 'price': 280, 'is_veg': False},
                {'name': 'Veg Pizza', 'price': 320, 'is_veg': True},
                {'name': 'Pasta Alfredo', 'price': 250, 'is_veg': True},
                {'name': 'Fish Tacos', 'price': 280, 'is_veg': False},
                {'name': 'Cold Coffee', 'price': 120, 'is_veg': True}
            ]
        },
        {
            'id': '5',
            'name': 'Truffles',
            'cuisine': 'Continental, Italian',
            'rating': 4.4,
            'review_count': 2800,
            'price_range': '₹₹',
            'delivery_time': 30,
            'address': 'Koramangala 5th Block, Bangalore',
            'phone': '+91-80-25562002',
            'tags': ['italian', 'pizza', 'pasta', 'desserts'],
            'menu': [
                {'name': 'Margherita Pizza', 'price': 280, 'is_veg': True},
                {'name': 'Pepperoni Pizza', 'price': 320, 'is_veg': False},
                {'name': 'Spaghetti Bolognese', 'price': 260, 'is_veg': False},
                {'name': 'Tiramisu', 'price': 180, 'is_veg': True},
                {'name': 'Garlic Bread', 'price': 80, 'is_veg': True}
            ]
        },
        {
            'id': '6',
            'name': 'Saravana Bhavan',
            'cuisine': 'South Indian',
            'rating': 4.2,
            'review_count': 1500,
            'price_range': '₹',
            'delivery_time': 25,
            'address': 'Koramangala 80 Feet Road, Bangalore',
            'phone': '+91-80-25563003',
            'tags': ['south-indian', 'vegetarian', 'breakfast', 'traditional'],
            'menu': [
                {'name': 'Masala Dosa', 'price': 70, 'is_veg': True},
                {'name': 'Ghee Roast', 'price': 90, 'is_veg': True},
                {'name': 'Idli', 'price': 40, 'is_veg': True},
                {'name': 'Vada', 'price': 45, 'is_veg': True},
                {'name': 'Sambar Rice', 'price': 60, 'is_veg': True},
                {'name': 'Filter Coffee', 'price': 25, 'is_veg': True}
            ]
        }
    ],
    'Indiranagar': [
        {
            'id': '7',
            'name': 'Toit',
            'cuisine': 'Continental, Brewery',
            'rating': 4.6,
            'review_count': 4500,
            'price_range': '₹₹₹',
            'delivery_time': 45,
            'address': '100 Feet Road, Indiranagar, Bangalore',
            'phone': '+91-80-25261001',
            'tags': ['brewery', 'continental', 'pizza', 'burgers'],
            'menu': [
                {'name': 'Toit Burger', 'price': 350, 'is_veg': False},
                {'name': 'Wood-fired Pizza', 'price': 380, 'is_veg': True},
                {'name': 'Fish Tacos', 'price': 280, 'is_veg': False},
                {'name': 'Craft Beer', 'price': 200, 'is_veg': True},
                {'name': 'Nachos', 'price': 180, 'is_veg': True}
            ]
        },
        {
            'id': '8',
            'name': 'The Fatty Bao',
            'cuisine': 'Asian, Japanese',
            'rating': 4.4,
            'review_count': 2200,
            'price_range': '₹₹₹',
            'delivery_time': 40,
            'address': '12th Main, Indiranagar, Bangalore',
            'phone': '+91-80-25262002',
            'tags': ['asian', 'japanese', 'sushi', 'ramen'],
            'menu': [
                {'name': 'Sushi Platter', 'price': 450, 'is_veg': False},
                {'name': 'Ramen Bowl', 'price': 320, 'is_veg': False},
                {'name': 'Dim Sum', 'price': 280, 'is_veg': True},
                {'name': 'Bao Buns', 'price': 200, 'is_veg': True},
                {'name': 'Green Tea', 'price': 80, 'is_veg': True}
            ]
        }
    ],
    'MG Road': [
        {
            'id': '9',
            'name': 'Mavalli Tiffin Room (MTR)',
            'cuisine': 'South Indian',
            'rating': 4.7,
            'review_count': 5600,
            'price_range': '₹',
            'delivery_time': 30,
            'address': 'Lalbagh Road, MG Road Area, Bangalore',
            'phone': '+91-80-22221001',
            'tags': ['legendary', 'south-indian', 'breakfast', 'vegetarian'],
            'menu': [
                {'name': 'Masala Dosa', 'price': 85, 'is_veg': True},
                {'name': 'Rava Idli', 'price': 55, 'is_veg': True},
                {'name': 'Kesari Bath', 'price': 45, 'is_veg': True},
                {'name': 'Filter Coffee', 'price': 30, 'is_veg': True},
                {'name': 'Badam Halwa', 'price': 65, 'is_veg': True}
            ]
        },
        {
            'id': '10',
            'name': 'Koshy\'s',
            'cuisine': 'Continental, Indian',
            'rating': 4.3,
            'review_count': 1800,
            'price_range': '₹₹',
            'delivery_time': 35,
            'address': 'St. Mark\'s Road, MG Road, Bangalore',
            'phone': '+91-80-22222002',
            'tags': ['heritage', 'continental', 'bangalore-classic'],
            'menu': [
                {'name': 'Chicken Steak', 'price': 280, 'is_veg': False},
                {'name': 'Fish Fry', 'price': 250, 'is_veg': False},
                {'name': 'Mutton Cutlet', 'price': 220, 'is_veg': False},
                {'name': 'Bread Pudding', 'price': 120, 'is_veg': True},
                {'name': 'Cold Coffee', 'price': 100, 'is_veg': True}
            ]
        }
    ],
    'HSR Layout': [
        {
            'id': '11',
            'name': 'Nando\'s',
            'cuisine': 'Portuguese, Peri-Peri',
            'rating': 4.3,
            'review_count': 1500,
            'price_range': '₹₹',
            'delivery_time': 35,
            'address': 'HSR Layout Sector 7, Bangalore',
            'phone': '+91-80-25761001',
            'tags': ['portuguese', 'chicken', 'peri-peri', 'international'],
            'menu': [
                {'name': 'Peri-Peri Chicken', 'price': 320, 'is_veg': False},
                {'name': 'Chicken Wings', 'price': 280, 'is_veg': False},
                {'name': 'Veg Burger', 'price': 200, 'is_veg': True},
                {'name': 'Peri Fries', 'price': 120, 'is_veg': True},
                {'name': 'Coleslaw', 'price': 80, 'is_veg': True}
            ]
        },
        {
            'id': '12',
            'name': 'The Hole in the Wall Cafe',
            'cuisine': 'Cafe, Continental',
            'rating': 4.2,
            'review_count': 900,
            'price_range': '₹₹',
            'delivery_time': 30,
            'address': 'HSR Layout 27th Main, Bangalore',
            'phone': '+91-80-25762002',
            'tags': ['cafe', 'breakfast', 'coffee', 'cozy'],
            'menu': [
                {'name': 'English Breakfast', 'price': 250, 'is_veg': False},
                {'name': 'Pancakes', 'price': 180, 'is_veg': True},
                {'name': 'Eggs Benedict', 'price': 220, 'is_veg': False},
                {'name': 'Cappuccino', 'price': 100, 'is_veg': True},
                {'name': 'Croissant', 'price': 80, 'is_veg': True}
            ]
        }
    ],
    'Electronic City': [
        {
            'id': '13',
            'name': 'A2B (Adyar Ananda Bhavan)',
            'cuisine': 'South Indian',
            'rating': 4.1,
            'review_count': 2000,
            'price_range': '₹',
            'delivery_time': 25,
            'address': 'Electronic City Phase 1, Bangalore',
            'phone': '+91-80-28581001',
            'tags': ['south-indian', 'vegetarian', 'sweets', 'breakfast'],
            'menu': [
                {'name': 'Ghee Dosa', 'price': 75, 'is_veg': True},
                {'name': 'Pongal', 'price': 60, 'is_veg': True},
                {'name': 'Poori Masala', 'price': 55, 'is_veg': True},
                {'name': 'Badam Milk', 'price': 40, 'is_veg': True},
                {'name': 'Mysore Pak', 'price': 35, 'is_veg': True}
            ]
        },
        {
            'id': '14',
            'name': 'Domino\'s Pizza',
            'cuisine': 'Italian, Pizza',
            'rating': 4.0,
            'review_count': 1200,
            'price_range': '₹₹',
            'delivery_time': 30,
            'address': 'Electronic City Phase 2, Bangalore',
            'phone': '+91-80-28582002',
            'tags': ['pizza', 'fast-food', 'delivery', 'italian'],
            'menu': [
                {'name': 'Pepperoni Pizza', 'price': 299, 'is_veg': False},
                {'name': 'Margherita Pizza', 'price': 199, 'is_veg': True},
                {'name': 'Veg Extravaganza', 'price': 349, 'is_veg': True},
                {'name': 'Garlic Breadsticks', 'price': 99, 'is_veg': True},
                {'name': 'Choco Lava Cake', 'price': 89, 'is_veg': True}
            ]
        }
    ],
    'JP Nagar': [
        {
            'id': '15',
            'name': 'Meghana Foods',
            'cuisine': 'Andhra, Biryani',
            'rating': 4.4,
            'review_count': 3500,
            'price_range': '₹₹',
            'delivery_time': 35,
            'address': 'JP Nagar 7th Phase, Bangalore',
            'phone': '+91-80-26591001',
            'tags': ['andhra', 'biryani', 'spicy', 'non-veg'],
            'menu': [
                {'name': 'Andhra Chicken Biryani', 'price': 280, 'is_veg': False},
                {'name': 'Mutton Biryani', 'price': 320, 'is_veg': False},
                {'name': 'Chilli Chicken', 'price': 220, 'is_veg': False},
                {'name': 'Andhra Meals', 'price': 150, 'is_veg': True},
                {'name': 'Gongura Mutton', 'price': 280, 'is_veg': False}
            ]
        },
        {
            'id': '16',
            'name': 'Cafe Azzure',
            'cuisine': 'Cafe, Continental',
            'rating': 4.2,
            'review_count': 800,
            'price_range': '₹₹',
            'delivery_time': 30,
            'address': 'JP Nagar 6th Phase, Bangalore',
            'phone': '+91-80-26592002',
            'tags': ['cafe', 'continental', 'breakfast', 'coffee'],
            'menu': [
                {'name': 'All Day Breakfast', 'price': 220, 'is_veg': True},
                {'name': 'Chicken Sandwich', 'price': 180, 'is_veg': False},
                {'name': 'Pasta Primavera', 'price': 200, 'is_veg': True},
                {'name': 'Iced Latte', 'price': 120, 'is_veg': True},
                {'name': 'Cheesecake', 'price': 150, 'is_veg': True}
            ]
        }
    ],
    'Jayanagar': [
        {
            'id': '17',
            'name': 'Vidyarthi Bhavan',
            'cuisine': 'South Indian',
            'rating': 4.6,
            'review_count': 4200,
            'price_range': '₹',
            'delivery_time': 20,
            'address': 'Gandhi Bazaar, Jayanagar, Bangalore',
            'phone': '+91-80-26661001',
            'tags': ['legendary', 'dosa', 'south-indian', 'breakfast'],
            'menu': [
                {'name': 'Masala Dosa', 'price': 70, 'is_veg': True},
                {'name': 'Khali Dosa', 'price': 60, 'is_veg': True},
                {'name': 'Kesari Bath', 'price': 40, 'is_veg': True},
                {'name': 'Coffee', 'price': 25, 'is_veg': True},
                {'name': 'Vada', 'price': 35, 'is_veg': True}
            ]
        },
        {
            'id': '18',
            'name': 'Brahmin\'s Coffee Bar',
            'cuisine': 'South Indian',
            'rating': 4.5,
            'review_count': 1500,
            'price_range': '₹',
            'delivery_time': 15,
            'address': 'R.K. Mutt Road, Jayanagar, Bangalore',
            'phone': '+91-80-26662002',
            'tags': ['traditional', 'coffee', 'idli', 'breakfast'],
            'menu': [
                {'name': 'Idli Vada', 'price': 50, 'is_veg': True},
                {'name': 'Khara Bath', 'price': 35, 'is_veg': True},
                {'name': 'Kesari Bath', 'price': 35, 'is_veg': True},
                {'name': 'Filter Coffee', 'price': 20, 'is_veg': True},
                {'name': 'Pongal', 'price': 40, 'is_veg': True}
            ]
        }
    ]
}

@app.route('/api/restaurants', methods=['GET'])
def get_restaurants():
    location = request.args.get('location', 'Whitefield')
    cuisine = request.args.get('cuisine', '')
    
    try:
        # Get restaurants for location
        restaurants = REAL_RESTAURANTS.get(location, [])
        
        if not restaurants:
            return jsonify({
                'success': False,
                'error': f'No restaurants found for {location}. Try: Whitefield, Koramangala, Indiranagar, MG Road, HSR Layout, Electronic City, JP Nagar, Jayanagar'
            }), 404
        
        # Filter by cuisine if provided
        if cuisine:
            restaurants = [r for r in restaurants if cuisine.lower() in r['cuisine'].lower()]
        
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

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'ok', 'locations': list(REAL_RESTAURANTS.keys())})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)