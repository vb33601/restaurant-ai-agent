from flask import Flask, request, jsonify, render_template, send_from_directory
from flask_cors import CORS
import time
import os
import requests as http_requests
from urllib.parse import quote

app = Flask(__name__, template_folder='templates', static_folder='static')
CORS(app)

# ── In-memory cache ────────────────────────────────────────────────────────────
_cache: dict = {}
_CACHE_TTL = 300  # 5 minutes


def _cache_get(key):
    entry = _cache.get(key)
    if entry and time.time() - entry['ts'] < _CACHE_TTL:
        return entry['data']
    return None


def _cache_set(key, data):
    _cache[key] = {'ts': time.time(), 'data': data}


# ── Order-link helper ──────────────────────────────────────────────────────────
def _add_order_links(restaurant: dict, location: str) -> dict:
    name = restaurant.get('name', '')
    enc_name = quote(name)
    enc_loc = quote(location)
    restaurant['order_links'] = {
        'swiggy': f'https://www.swiggy.com/search?query={enc_name}',
        'zomato': f'https://www.zomato.com/search?q={enc_name}',
        'ubereats': 'https://www.ubereats.com',
        'google': f'https://www.google.com/search?q={enc_name}+{enc_loc}+restaurant',
    }
    if restaurant.get('website'):
        restaurant['order_links']['website'] = restaurant['website']
    return restaurant


# ── Live search via OpenStreetMap ──────────────────────────────────────────────
def search_osm_restaurants(location: str, cuisine: str = '') -> list:
    cache_key = f'osm|{location.lower()}|{cuisine.lower()}'
    cached = _cache_get(cache_key)
    if cached is not None:
        return cached

    headers = {'User-Agent': 'RestaurantAIAgent/1.0 (open-source food assistant)'}

    geo_url = (
        'https://nominatim.openstreetmap.org/search'
        f'?q={quote(location + ", India")}&format=json&limit=1&countrycodes=in'
    )
    try:
        geo_resp = http_requests.get(geo_url, timeout=10, headers=headers)
        geo_data = geo_resp.json()
    except Exception as e:
        print(f'Nominatim error: {e}')
        return []

    if not geo_data:
        return []

    hit = geo_data[0]
    lat = float(hit['lat'])
    lon = float(hit['lon'])

    bbox = hit.get('boundingbox')  # [south, north, west, east]
    if bbox:
        south, north, west, east = map(float, bbox)
        lat_km = (north - south) * 111
        lon_km = (east  - west)  * 111 * abs(lat) / 90
        diagonal_km = (lat_km ** 2 + lon_km ** 2) ** 0.5
        if diagonal_km >= 8:
            area_filter = f'({south},{west},{north},{east})'
        else:
            area_filter = f'(around:8000,{lat},{lon})'
    else:
        area_filter = f'(around:8000,{lat},{lon})'

    def _overpass(cf: str = '') -> list:
        cuisine_filter = f'["cuisine"~"{cf}",i]' if cf else ''
        q = f"""
[out:json][timeout:60];
(
  node["amenity"="restaurant"]{cuisine_filter}{area_filter};
  way["amenity"="restaurant"]{cuisine_filter}{area_filter};
  node["amenity"="fast_food"]{cuisine_filter}{area_filter};
  node["amenity"="cafe"]{cuisine_filter}{area_filter};
  way["amenity"="cafe"]{cuisine_filter}{area_filter};
  node["amenity"="bar"]{cuisine_filter}{area_filter};
);
out body;
"""
        try:
            resp = http_requests.post(
                'https://overpass-api.de/api/interpreter',
                data={'data': q}, timeout=60, headers=headers,
            )
            return resp.json().get('elements', [])
        except Exception as e:
            print(f'Overpass error: {e}')
            return []

    elements = _overpass(cuisine) if cuisine else _overpass()
    if cuisine and len(elements) < 5:
        elements = _overpass()

    restaurants = []
    seen: set = set()
    for el in elements:
        tags = el.get('tags', {})
        name = tags.get('name', '').strip()
        if not name or name.lower() in seen:
            continue
        seen.add(name.lower())

        cuisine_tag = (
            tags.get('cuisine', 'Various')
            .replace(';', ', ').replace('_', ' ').title()
        )
        address_parts = [
            tags.get('addr:housenumber', ''),
            tags.get('addr:street', ''),
            tags.get('addr:suburb', ''),
            tags.get('addr:city', ''),
        ]
        address = ', '.join(p for p in address_parts if p) or location
        website = tags.get('website') or tags.get('contact:website', '')
        phone = tags.get('phone') or tags.get('contact:phone', '')
        opening_hours = tags.get('opening_hours', '')

        restaurants.append({
            'id': f'osm_{el["id"]}',
            'name': name,
            'cuisine': cuisine_tag,
            'rating': None,
            'review_count': 0,
            'price_range': '₹₹',
            'delivery_time': None,
            'address': address,
            'phone': phone,
            'website': website,
            'opening_hours': opening_hours,
            'tags': [t for t in [cuisine_tag.lower(), tags.get('amenity', '')] if t],
            'menu': [],
            'source': 'OpenStreetMap',
        })

    _cache_set(cache_key, restaurants)
    return restaurants


# ── Flask routes ───────────────────────────────────────────────────────────────

@app.route('/')
def index():
    return render_template('index.html')


@app.route('/api/restaurants', methods=['GET'])
def get_restaurants():
    location = request.args.get('location', '').strip()
    cuisine = request.args.get('cuisine', '').strip()

    if not location:
        return jsonify({'success': False, 'error': 'location parameter is required'}), 400

    restaurants = search_osm_restaurants(location, cuisine)

    if not restaurants:
        return jsonify({
            'success': False,
            'error': (
                f'No restaurants found near "{location}". '
                'Try a more specific area name or a nearby major city.'
            ),
        }), 404

    for r in restaurants:
        _add_order_links(r, location)

    return jsonify({
        'success': True,
        'restaurants': restaurants,
        'count': len(restaurants),
        'location': location,
        'cuisine': cuisine,
        'source': 'OpenStreetMap',
    })


@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'ok', 'source': 'OpenStreetMap'})


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
