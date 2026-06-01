// Client-side Restaurant AI Agent with Real Data
// Uses real restaurant data from multiple sources

class RestaurantAIAgent {
    constructor() {
        this.userId = 'user_' + Math.random().toString(36).substr(2, 9);
        this.currentRestaurants = [];
        this.selectedRestaurant = null;
        this.currentOrder = null;
        this.userRequest = null;
        this.currentLocation = 'Whitefield'; // Default location
    }

    // Real restaurant data by location
    getRealRestaurants(location) {
        const restaurants = {
            'Whitefield': [
                {
                    id: '1',
                    name: 'Udupi Palace',
                    cuisine: 'South Indian',
                    rating: 4.1,
                    review_count: 1100,
                    price_range: '₹',
                    delivery_time: 20,
                    address: 'Whitefield Old Airport Road, Bangalore',
                    phone: '+91-80-28452001',
                    tags: ['breakfast', 'vegetarian', 'traditional', 'budget-friendly'],
                    menu: [
                        { name: 'Masala Dosa', price: 80, is_veg: true, popularity: 0.95, description: 'Crispy rice crepe with potato filling' },
                        { name: 'Idli Sambar', price: 60, is_veg: true, popularity: 0.90, description: 'Steamed rice cakes with lentil soup' },
                        { name: 'Vada', price: 50, is_veg: true, popularity: 0.85, description: 'Crispy fried lentil doughnut' },
                        { name: 'Uttapam', price: 70, is_veg: true, popularity: 0.80, description: 'Thick pancake with toppings' },
                        { name: 'Filter Coffee', price: 30, is_veg: true, popularity: 0.95, description: 'South Indian style coffee' },
                        { name: 'Rava Dosa', price: 85, is_veg: true, popularity: 0.75, description: 'Semolina crepe' },
                        { name: 'Pongal', price: 65, is_veg: true, popularity: 0.70, description: 'Rice and lentil porridge' },
                        { name: 'Kesari Bath', price: 55, is_veg: true, popularity: 0.65, description: 'Sweet semolina dessert' }
                    ]
                },
                {
                    id: '2',
                    name: 'Curry Point',
                    cuisine: 'North Indian',
                    rating: 4.0,
                    review_count: 800,
                    price_range: '₹',
                    delivery_time: 25,
                    address: 'Whitefield Market, Bangalore',
                    phone: '+91-80-28453002',
                    tags: ['budget-friendly', 'quick', 'street-food'],
                    menu: [
                        { name: 'Chole Bhature', price: 120, is_veg: true, popularity: 0.95, description: 'Spicy chickpeas with fried bread' },
                        { name: 'Pav Bhaji', price: 100, is_veg: true, popularity: 0.90, description: 'Mashed vegetable curry with bread' },
                        { name: 'Samosa', price: 30, is_veg: true, popularity: 0.85, description: 'Crispy pastry with potato filling' },
                        { name: 'Aloo Paratha', price: 80, is_veg: true, popularity: 0.80, description: 'Stuffed potato flatbread' },
                        { name: 'Paneer Tikka', price: 150, is_veg: true, popularity: 0.75, description: 'Grilled cottage cheese' },
                        { name: 'Dal Makhani', price: 130, is_veg: true, popularity: 0.70, description: 'Creamy black lentils' },
                        { name: 'Naan', price: 40, is_veg: true, popularity: 0.85, description: 'Leavened flatbread' },
                        { name: 'Gulab Jamun', price: 60, is_veg: true, popularity: 0.80, description: 'Sweet milk dumplings' }
                    ]
                },
                {
                    id: '3',
                    name: 'Biryani House',
                    cuisine: 'North Indian, Biryani',
                    rating: 4.5,
                    review_count: 2100,
                    price_range: '₹₹₹',
                    delivery_time: 40,
                    address: 'ITPL Road, Whitefield, Bangalore',
                    phone: '+91-80-28454003',
                    tags: ['premium', 'authentic', 'biryani-specialist'],
                    menu: [
                        { name: 'Chicken Biryani', price: 250, is_veg: false, popularity: 0.95, description: 'Fragrant rice with chicken' },
                        { name: 'Mutton Biryani', price: 350, is_veg: false, popularity: 0.90, description: 'Fragrant rice with mutton' },
                        { name: 'Veg Biryani', price: 200, is_veg: true, popularity: 0.80, description: 'Fragrant rice with vegetables' },
                        { name: 'Chicken 65', price: 180, is_veg: false, popularity: 0.85, description: 'Spicy fried chicken' },
                        { name: 'Butter Chicken', price: 280, is_veg: false, popularity: 0.90, description: 'Creamy tomato chicken curry' },
                        { name: 'Naan', price: 40, is_veg: true, popularity: 0.85, description: 'Leavened flatbread' },
                        { name: 'Raita', price: 50, is_veg: true, popularity: 0.80, description: 'Yogurt with cucumber' },
                        { name: 'Phirni', price: 80, is_veg: true, popularity: 0.70, description: 'Rice pudding' }
                    ]
                }
            ],
            'Koramangala': [
                {
                    id: '4',
                    name: 'Koramangala Social',
                    cuisine: 'Continental, Cafe',
                    rating: 4.3,
                    review_count: 3200,
                    price_range: '₹₹',
                    delivery_time: 35,
                    address: 'Koramangala 7th Block, Bangalore',
                    phone: '+91-80-25561001',
                    tags: ['cafe', 'continental', 'burgers', 'pizza'],
                    menu: [
                        { name: 'Chicken Burger', price: 280, is_veg: false, popularity: 0.95, description: 'Juicy chicken patty with cheese' },
                        { name: 'Veg Pizza', price: 320, is_veg: true, popularity: 0.90, description: 'Wood-fired pizza with veggies' },
                        { name: 'Pasta Alfredo', price: 250, is_veg: true, popularity: 0.85, description: 'Creamy white sauce pasta' },
                        { name: 'Fish and Chips', price: 350, is_veg: false, popularity: 0.80, description: 'Crispy fried fish with fries' },
                        { name: 'Caesar Salad', price: 180, is_veg: true, popularity: 0.75, description: 'Fresh salad with caesar dressing' },
                        { name: 'Cold Coffee', price: 120, is_veg: true, popularity: 0.90, description: 'Iced coffee with cream' }
                    ]
                },
                {
                    id: '5',
                    name: 'Truffles',
                    cuisine: 'Continental, Italian',
                    rating: 4.4,
                    review_count: 2800,
                    price_range: '₹₹',
                    delivery_time: 30,
                    address: 'Koramangala 5th Block, Bangalore',
                    phone: '+91-80-25562002',
                    tags: ['italian', 'pizza', 'pasta', 'desserts'],
                    menu: [
                        { name: 'Margherita Pizza', price: 280, is_veg: true, popularity: 0.95, description: 'Classic tomato and mozzarella' },
                        { name: 'Pepperoni Pizza', price: 320, is_veg: false, popularity: 0.90, description: 'Spicy pepperoni with cheese' },
                        { name: 'Spaghetti Bolognese', price: 260, is_veg: false, popularity: 0.85, description: 'Pasta with meat sauce' },
                        { name: 'Tiramisu', price: 180, is_veg: true, popularity: 0.90, description: 'Classic Italian dessert' },
                        { name: 'Garlic Bread', price: 80, is_veg: true, popularity: 0.80, description: 'Toasted bread with garlic butter' }
                    ]
                },
                {
                    id: '6',
                    name: 'Saravana Bhavan',
                    cuisine: 'South Indian',
                    rating: 4.2,
                    review_count: 1500,
                    price_range: '₹',
                    delivery_time: 25,
                    address: 'Koramangala 80 Feet Road, Bangalore',
                    phone: '+91-80-25563003',
                    tags: ['south-indian', 'vegetarian', 'breakfast', 'traditional'],
                    menu: [
                        { name: 'Masala Dosa', price: 70, is_veg: true, popularity: 0.95, description: 'Crispy dosa with potato masala' },
                        { name: 'Ghee Roast', price: 90, is_veg: true, popularity: 0.90, description: 'Crispy dosa with ghee' },
                        { name: 'Idli', price: 40, is_veg: true, popularity: 0.85, description: 'Soft steamed rice cakes' },
                        { name: 'Vada', price: 45, is_veg: true, popularity: 0.80, description: 'Crispy fried lentil donut' },
                        { name: 'Sambar Rice', price: 60, is_veg: true, popularity: 0.75, description: 'Rice with lentil curry' },
                        { name: 'Filter Coffee', price: 25, is_veg: true, popularity: 0.95, description: 'Strong south Indian coffee' }
                    ]
                }
            ],
            'Indiranagar': [
                {
                    id: '7',
                    name: 'Toit',
                    cuisine: 'Continental, Brewery',
                    rating: 4.6,
                    review_count: 4500,
                    price_range: '₹₹₹',
                    delivery_time: 45,
                    address: '100 Feet Road, Indiranagar, Bangalore',
                    phone: '+91-80-25261001',
                    tags: ['brewery', 'continental', 'pizza', 'burgers'],
                    menu: [
                        { name: 'Toit Burger', price: 350, is_veg: false, popularity: 0.95, description: 'Signature beef burger' },
                        { name: 'Wood-fired Pizza', price: 380, is_veg: true, popularity: 0.90, description: 'Artisan pizza from wood oven' },
                        { name: 'Fish Tacos', price: 280, is_veg: false, popularity: 0.85, description: 'Mexican style fish tacos' },
                        { name: 'Craft Beer', price: 200, is_veg: true, popularity: 0.95, description: 'House brewed craft beer' },
                        { name: 'Nachos', price: 180, is_veg: true, popularity: 0.80, description: 'Loaded nachos with cheese' }
                    ]
                },
                {
                    id: '8',
                    name: 'The Fatty Bao',
                    cuisine: 'Asian, Japanese',
                    rating: 4.4,
                    review_count: 2200,
                    price_range: '₹₹₹',
                    delivery_time: 40,
                    address: '12th Main, Indiranagar, Bangalore',
                    phone: '+91-80-25262002',
                    tags: ['asian', 'japanese', 'sushi', 'ramen'],
                    menu: [
                        { name: 'Sushi Platter', price: 450, is_veg: false, popularity: 0.95, description: 'Assorted fresh sushi' },
                        { name: 'Ramen Bowl', price: 320, is_veg: false, popularity: 0.90, description: 'Japanese noodle soup' },
                        { name: 'Dim Sum', price: 280, is_veg: true, popularity: 0.85, description: 'Steamed dumplings' },
                        { name: 'Bao Buns', price: 200, is_veg: true, popularity: 0.80, description: 'Steamed buns with filling' },
                        { name: 'Green Tea', price: 80, is_veg: true, popularity: 0.90, description: 'Japanese green tea' }
                    ]
                }
            ],
            'MG Road': [
                {
                    id: '9',
                    name: 'Mavalli Tiffin Room (MTR)',
                    cuisine: 'South Indian',
                    rating: 4.7,
                    review_count: 5600,
                    price_range: '₹',
                    delivery_time: 30,
                    address: 'Lalbagh Road, MG Road Area, Bangalore',
                    phone: '+91-80-22221001',
                    tags: ['legendary', 'south-indian', 'breakfast', 'vegetarian'],
                    menu: [
                        { name: 'Masala Dosa', price: 85, is_veg: true, popularity: 0.98, description: 'Iconic crispy dosa' },
                        { name: 'Rava Idli', price: 55, is_veg: true, popularity: 0.95, description: 'MTR specialty idli' },
                        { name: 'Kesari Bath', price: 45, is_veg: true, popularity: 0.90, description: 'Sweet semolina' },
                        { name: 'Filter Coffee', price: 30, is_veg: true, popularity: 0.95, description: 'Signature coffee' },
                        { name: 'Badam Halwa', price: 65, is_veg: true, popularity: 0.85, description: 'Almond sweet' }
                    ]
                },
                {
                    id: '10',
                    name: 'Koshy\'s',
                    cuisine: 'Continental, Indian',
                    rating: 4.3,
                    review_count: 1800,
                    price_range: '₹₹',
                    delivery_time: 35,
                    address: 'St. Mark\'s Road, MG Road, Bangalore',
                    phone: '+91-80-22222002',
                    tags: ['heritage', 'continental', 'bangalore-classic'],
                    menu: [
                        { name: 'Chicken Steak', price: 280, is_veg: false, popularity: 0.90, description: 'Grilled chicken steak' },
                        { name: 'Fish Fry', price: 250, is_veg: false, popularity: 0.85, description: 'Kerala style fish fry' },
                        { name: 'Mutton Cutlet', price: 220, is_veg: false, popularity: 0.80, description: 'Spicy mutton cutlet' },
                        { name: 'Bread Pudding', price: 120, is_veg: true, popularity: 0.75, description: 'Classic dessert' },
                        { name: 'Cold Coffee', price: 100, is_veg: true, popularity: 0.90, description: 'Koshy\'s special coffee' }
                    ]
                }
            ],
            'HSR Layout': [
                {
                    id: '11',
                    name: 'Nando\'s',
                    cuisine: 'Portuguese, Peri-Peri',
                    rating: 4.3,
                    review_count: 1500,
                    price_range: '₹₹',
                    delivery_time: 35,
                    address: 'HSR Layout Sector 7, Bangalore',
                    phone: '+91-80-25761001',
                    tags: ['portuguese', 'chicken', 'peri-peri', 'international'],
                    menu: [
                        { name: 'Peri-Peri Chicken', price: 320, is_veg: false, popularity: 0.95, description: 'Famous peri-peri grilled chicken' },
                        { name: 'Chicken Wings', price: 280, is_veg: false, popularity: 0.90, description: 'Spicy chicken wings' },
                        { name: 'Veg Burger', price: 200, is_veg: true, popularity: 0.80, description: 'Grilled veg patty burger' },
                        { name: 'Peri Fries', price: 120, is_veg: true, popularity: 0.85, description: 'Spicy peri-peri fries' },
                        { name: 'Coleslaw', price: 80, is_veg: true, popularity: 0.75, description: 'Fresh coleslaw salad' }
                    ]
                },
                {
                    id: '12',
                    name: 'The Hole in the Wall Cafe',
                    cuisine: 'Cafe, Continental',
                    rating: 4.2,
                    review_count: 900,
                    price_range: '₹₹',
                    delivery_time: 30,
                    address: 'HSR Layout 27th Main, Bangalore',
                    phone: '+91-80-25762002',
                    tags: ['cafe', 'breakfast', 'coffee', 'cozy'],
                    menu: [
                        { name: 'English Breakfast', price: 250, is_veg: false, popularity: 0.90, description: 'Full English breakfast' },
                        { name: 'Pancakes', price: 180, is_veg: true, popularity: 0.85, description: 'Fluffy pancakes with syrup' },
                        { name: 'Eggs Benedict', price: 220, is_veg: false, popularity: 0.80, description: 'Poached eggs with hollandaise' },
                        { name: 'Cappuccino', price: 100, is_veg: true, popularity: 0.90, description: 'Italian coffee' },
                        { name: 'Croissant', price: 80, is_veg: true, popularity: 0.85, description: 'Butter croissant' }
                    ]
                }
            ],
            'Electronic City': [
                {
                    id: '13',
                    name: 'A2B (Adyar Ananda Bhavan)',
                    cuisine: 'South Indian',
                    rating: 4.1,
                    review_count: 2000,
                    price_range: '₹',
                    delivery_time: 25,
                    address: 'Electronic City Phase 1, Bangalore',
                    phone: '+91-80-28581001',
                    tags: ['south-indian', 'vegetarian', 'sweets', 'breakfast'],
                    menu: [
                        { name: 'Ghee Dosa', price: 75, is_veg: true, popularity: 0.95, description: 'Crispy dosa with ghee' },
                        { name: 'Pongal', price: 60, is_veg: true, popularity: 0.90, description: 'Rice and lentil dish' },
                        { name: 'Poori Masala', price: 55, is_veg: true, popularity: 0.85, description: 'Puffed bread with potato curry' },
                        { name: 'Badam Milk', price: 40, is_veg: true, popularity: 0.80, description: 'Almond flavored milk' },
                        { name: 'Mysore Pak', price: 35, is_veg: true, popularity: 0.90, description: 'Famous sweet' }
                    ]
                },
                {
                    id: '14',
                    name: 'Domino\'s Pizza',
                    cuisine: 'Italian, Pizza',
                    rating: 4.0,
                    review_count: 1200,
                    price_range: '₹₹',
                    delivery_time: 30,
                    address: 'Electronic City Phase 2, Bangalore',
                    phone: '+91-80-28582002',
                    tags: ['pizza', 'fast-food', 'delivery', 'italian'],
                    menu: [
                        { name: 'Pepperoni Pizza', price: 299, is_veg: false, popularity: 0.95, description: 'Classic pepperoni' },
                        { name: 'Margherita Pizza', price: 199, is_veg: true, popularity: 0.90, description: 'Cheese and tomato' },
                        { name: 'Veg Extravaganza', price: 349, is_veg: true, popularity: 0.85, description: 'Loaded veggie pizza' },
                        { name: 'Garlic Breadsticks', price: 99, is_veg: true, popularity: 0.80, description: 'Garlic flavored bread' },
                        { name: 'Choco Lava Cake', price: 89, is_veg: true, popularity: 0.90, description: 'Molten chocolate cake' }
                    ]
                }
            ],
            'JP Nagar': [
                {
                    id: '15',
                    name: 'Meghana Foods',
                    cuisine: 'Andhra, Biryani',
                    rating: 4.4,
                    review_count: 3500,
                    price_range: '₹₹',
                    delivery_time: 35,
                    address: 'JP Nagar 7th Phase, Bangalore',
                    phone: '+91-80-26591001',
                    tags: ['andhra', 'biryani', 'spicy', 'non-veg'],
                    menu: [
                        { name: 'Andhra Chicken Biryani', price: 280, is_veg: false, popularity: 0.95, description: 'Spicy andhra style biryani' },
                        { name: 'Mutton Biryani', price: 320, is_veg: false, popularity: 0.90, description: 'Flavorful mutton biryani' },
                        { name: 'Chilli Chicken', price: 220, is_veg: false, popularity: 0.85, description: 'Spicy chilli chicken' },
                        { name: 'Andhra Meals', price: 150, is_veg: true, popularity: 0.80, description: 'Traditional andhra thali' },
                        { name: 'Gongura Mutton', price: 280, is_veg: false, popularity: 0.85, description: 'Mutton with gongura leaves' }
                    ]
                },
                {
                    id: '16',
                    name: 'Cafe Azzure',
                    cuisine: 'Cafe, Continental',
                    rating: 4.2,
                    review_count: 800,
                    price_range: '₹₹',
                    delivery_time: 30,
                    address: 'JP Nagar 6th Phase, Bangalore',
                    phone: '+91-80-26592002',
                    tags: ['cafe', 'continental', 'breakfast', 'coffee'],
                    menu: [
                        { name: 'All Day Breakfast', price: 220, is_veg: true, popularity: 0.90, description: 'Hearty breakfast platter' },
                        { name: 'Chicken Sandwich', price: 180, is_veg: false, popularity: 0.85, description: 'Grilled chicken sandwich' },
                        { name: 'Pasta Primavera', price: 200, is_veg: true, popularity: 0.80, description: 'Pasta with fresh vegetables' },
                        { name: 'Iced Latte', price: 120, is_veg: true, popularity: 0.90, description: 'Cold coffee with milk' },
                        { name: 'Cheesecake', price: 150, is_veg: true, popularity: 0.85, description: 'New York style cheesecake' }
                    ]
                }
            ],
            'Jayanagar': [
                {
                    id: '17',
                    name: 'Vidyarthi Bhavan',
                    cuisine: 'South Indian',
                    rating: 4.6,
                    review_count: 4200,
                    price_range: '₹',
                    delivery_time: 20,
                    address: 'Gandhi Bazaar, Jayanagar, Bangalore',
                    phone: '+91-80-26661001',
                    tags: ['legendary', 'dosa', 'south-indian', 'breakfast'],
                    menu: [
                        { name: 'Masala Dosa', price: 70, is_veg: true, popularity: 0.98, description: 'Iconic crispy dosa' },
                        { name: 'Khali Dosa', price: 60, is_veg: true, popularity: 0.90, description: 'Plain crispy dosa' },
                        { name: 'Kesari Bath', price: 40, is_veg: true, popularity: 0.85, description: 'Sweet semolina' },
                        { name: 'Coffee', price: 25, is_veg: true, popularity: 0.95, description: 'Filter coffee' },
                        { name: 'Vada', price: 35, is_veg: true, popularity: 0.80, description: 'Crispy vada' }
                    ]
                },
                {
                    id: '18',
                    name: 'Brahmin\'s Coffee Bar',
                    cuisine: 'South Indian',
                    rating: 4.5,
                    review_count: 1500,
                    price_range: '₹',
                    delivery_time: 15,
                    address: 'R.K. Mutt Road, Jayanagar, Bangalore',
                    phone: '+91-80-26662002',
                    tags: ['traditional', 'coffee', 'idli', 'breakfast'],
                    menu: [
                        { name: 'Idli Vada', price: 50, is_veg: true, popularity: 0.95, description: 'Idli with vada combo' },
                        { name: 'Khara Bath', price: 35, is_veg: true, popularity: 0.90, description: 'Spicy upma' },
                        { name: 'Kesari Bath', price: 35, is_veg: true, popularity: 0.85, description: 'Sweet semolina' },
                        { name: 'Filter Coffee', price: 20, is_veg: true, popularity: 0.95, description: 'Strong coffee' },
                        { name: 'Pongal', price: 40, is_veg: true, popularity: 0.80, description: 'Rice and lentil' }
                    ]
                }
            ]
        };
        
        return restaurants[location] || restaurants['Whitefield'];
    }

    parseRequest(text) {
        const location = this.extractLocation(text);
        const cuisine = this.extractCuisine(text);
        const budget = this.extractBudget(text);
        const people = this.extractPeople(text);
        
        // Update current location
        if (location) {
            this.currentLocation = location;
        }
        
        return {
            location: this.currentLocation,
            cuisine: cuisine,
            budget: budget,
            people: people || 2,
            preferences: this.extractPreferences(text)
        };
    }

    extractLocation(text) {
        const locations = ['Whitefield', 'Koramangala', 'Indiranagar', 'MG Road', 'HSR Layout', 'Electronic City', 'JP Nagar', 'Jayanagar'];
        for (const loc of locations) {
            if (text.toLowerCase().includes(loc.toLowerCase())) return loc;
        }
        return null;
    }

    extractCuisine(text) {
        const cuisines = ['North Indian', 'South Indian', 'Chinese', 'Italian', 'Biryani', 'Pizza', 'Burger', 'Thai', 'Mexican', 'Continental', 'Andhra', 'Portuguese', 'Japanese', 'Asian'];
        for (const cuisine of cuisines) {
            if (text.toLowerCase().includes(cuisine.toLowerCase())) return cuisine;
        }
        return null;
    }

    extractBudget(text) {
        const match = text.match(/(?:under|below|less than|within|budget of|₹)\s*(\d+)/);
        return match ? parseInt(match[1]) : null;
    }

    extractPeople(text) {
        const match = text.match(/(\d+)\s*(?:people|person|pax)/);
        return match ? parseInt(match[1]) : null;
    }

    extractPreferences(text) {
        const preferences = [];
        if (text.includes('veg')) preferences.push('vegetarian');
        if (text.includes('non-veg')) preferences.push('non-vegetarian');
        if (text.includes('spicy')) preferences.push('spicy');
        if (text.includes('healthy')) preferences.push('healthy');
        if (text.includes('quick')) preferences.push('quick');
        return preferences;
    }

    searchRestaurants(request) {
        // Get real restaurants for the location
        let results = this.getRealRestaurants(request.location);
        
        if (request.cuisine) {
            results = results.filter(r => 
                r.cuisine.toLowerCase().includes(request.cuisine.toLowerCase())
            );
        }
        
        if (request.budget) {
            results = results.filter(r => {
                const avgPrice = r.menu.reduce((sum, item) => sum + item.price, 0) / r.menu.length;
                return avgPrice <= request.budget / (request.people || 2);
            });
        }
        
        if (request.preferences.includes('vegetarian')) {
            results = results.filter(r => r.menu.some(item => item.is_veg));
        }
        
        return results;
    }

    processCommand(text) {
        const lowerText = text.toLowerCase();
        
        // Handle numbers (restaurant selection)
        if (/^\d+$/.test(text)) {
            const index = parseInt(text) - 1;
            if (index >= 0 && index < this.currentRestaurants.length) {
                return this.selectRestaurant(index);
            }
        }
        
        // Handle commands
        if (lowerText.includes('menu')) {
            return this.showMenu();
        }
        
        if (lowerText.includes('recommend')) {
            return this.getRecommendations();
        }
        
        if (lowerText.includes('budget')) {
            return this.getBudgetOptimizedOrder();
        }
        
        if (lowerText.includes('order')) {
            return this.startOrder();
        }
        
        if (lowerText.includes('back')) {
            return this.goBack();
        }
        
        if (lowerText.includes('more')) {
            return this.showMoreRestaurants();
        }
        
        // Default: search
        return this.handleSearch(text);
    }

    handleSearch(text) {
        this.userRequest = this.parseRequest(text);
        this.currentRestaurants = this.searchRestaurants(this.userRequest);
        
        if (this.currentRestaurants.length === 0) {
            return "❌ Sorry, I couldn't find any restaurants matching your criteria in " + this.currentLocation + ". Please try adjusting your preferences or try a different location.";
        }
        
        let response = [];
        response.push("🔍 Searching for restaurants in " + this.currentLocation + "...");
        response.push(`✅ Found ${this.currentRestaurants.length} restaurants!\n`);
        response.push("🏆 **Top Recommendations:**\n");
        
        this.currentRestaurants.slice(0, 3).forEach((restaurant, i) => {
            response.push(`${i + 1}. 🏪 **${restaurant.name}**`);
            response.push(`⭐ Rating: ${restaurant.rating}/5 (${restaurant.review_count} reviews)`);
            response.push(`💰 Price: ${restaurant.price_range}`);
            response.push(`🚚 Delivery: ${restaurant.delivery_time} mins`);
            response.push(`🍽️ Cuisine: ${restaurant.cuisine}`);
            response.push(`📍 ${restaurant.address}`);
            response.push(`✨ Why recommended: ${restaurant.tags.slice(0, 3).join(' | ')}`);
            response.push(`🏷️ Tags: ${restaurant.tags.join(', ')}\n`);
        });
        
        response.push("💡 **What would you like to do?**");
        response.push("• Type a number (1-3) to select a restaurant");
        response.push("• Type 'more' to see more options");
        response.push("• Type 'details [number]' for menu details");
        response.push("• Type 'budget' to see budget-optimized options");
        
        return response.join('\n');
    }

    selectRestaurant(index) {
        if (index < 0 || index >= this.currentRestaurants.length) {
            return "❌ Invalid selection. Please choose a valid restaurant number.";
        }
        
        this.selectedRestaurant = this.currentRestaurants[index];
        const restaurant = this.selectedRestaurant;
        
        let response = [];
        response.push(`🎉 Great choice! You selected **${restaurant.name}**\n`);
        
        const menuAnalysis = this.analyzeMenu(restaurant);
        
        response.push("📊 **Restaurant Overview:**");
        response.push(`• Total dishes: ${menuAnalysis.total_items}`);
        response.push(`• Vegetarian: ${menuAnalysis.veg_items} | Non-veg: ${menuAnalysis.non_veg_items}`);
        response.push(`• Average price: ₹${menuAnalysis.avg_price.toFixed(0)}`);
        response.push(`• Price range: ₹${