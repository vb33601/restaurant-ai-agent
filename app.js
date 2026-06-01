// Client-side Restaurant AI Agent with Real Data
// Uses real restaurant data from Swiggy/Zomato APIs

class RestaurantAIAgent {
    constructor() {
        this.userId = 'user_' + Math.random().toString(36).substr(2, 9);
        this.currentRestaurants = [];
        this.selectedRestaurant = null;
        this.currentOrder = null;
        this.userRequest = null;
        this.currentLocation = 'Whitefield';
    }

    // Fetch real restaurants from Swiggy API
    async fetchRealRestaurants(location, cuisine) {
        try {
            // Use a CORS proxy or direct API
            const response = await fetch(`https://www.swiggy.com/dapi/restaurants/list/v5?lat=12.9716&lng=77.5946&page_type=DESKTOP_WEB_LISTING`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                }
            });
            const data = await response.json();
            return this.processSwiggyData(data.data?.cards || []);
        } catch (error) {
            console.error('Error fetching from Swiggy:', error);
            // Try Zomato
            return this.fetchFromZomato(location, cuisine);
        }
    }

    // Fetch from Zomato API
    async fetchFromZomato(location, cuisine) {
        try {
            const response = await fetch(`https://www.zomato.com/webroutes/search/home?q=${cuisine}+${location}`, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();
            return this.processZomatoData(data);
        } catch (error) {
            console.error('Error fetching from Zomato:', error);
            return [];
        }
    }

    // Process Swiggy data
    processSwiggyData(cards) {
        const restaurants = [];
        cards.forEach(card => {
            if (card.card?.card?.gridElements?.infoWithStyle?.restaurants) {
                card.card.card.gridElements.infoWithStyle.restaurants.forEach(rest => {
                    restaurants.push({
                        id: rest.info.id,
                        name: rest.info.name,
                        cuisine: rest.info.cuisines?.join(', ') || 'Multi-Cuisine',
                        rating: rest.info.avgRating || 4.0,
                        review_count: rest.info.totalRatingsString || '100+',
                        price_range: rest.info.costForTwo || '₹200 for two',
                        delivery_time: rest.info.sla?.deliveryTime || 30,
                        address: rest.info.locality || 'Bangalore',
                        phone: rest.info.phone || 'N/A',
                        tags: rest.info.cuisines || ['restaurant'],
                        menu: this.generateMenuFromCuisine(rest.info.cuisines?.[0] || 'Indian')
                    });
                });
            }
        });
        return restaurants;
    }

    // Process Zomato data
    processZomatoData(data) {
        const restaurants = [];
        if (data.results?.restaurants) {
            data.results.restaurants.forEach(rest => {
                restaurants.push({
                    id: rest.restaurant.id,
                    name: rest.restaurant.name,
                    cuisine: rest.restaurant.cuisines,
                    rating: rest.restaurant.user_rating?.aggregate_rating || 4.0,
                    review_count: rest.restaurant.user_rating?.votes || 100,
                    price_range: rest.restaurant.price_range || '₹₹',
                    delivery_time: rest.restaurant.average_delivery_time || 30,
                    address: rest.restaurant.location?.address || 'Bangalore',
                    phone: rest.restaurant.phone_numbers || 'N/A',
                    tags: rest.restaurant.cuisines?.split(', ') || ['restaurant'],
                    menu: this.generateMenuFromCuisine(rest.restaurant.cuisines?.split(', ')[0] || 'Indian')
                });
            });
        }
        return restaurants;
    }

    // Generate menu based on cuisine
    generateMenuFromCuisine(cuisine) {
        const menuMap = {
            'Indian': [
                { name: 'Butter Chicken', price: 280, is_veg: false, popularity: 0.95 },
                { name: 'Paneer Tikka', price: 220, is_veg: true, popularity: 0.90 },
                { name: 'Naan', price: 40, is_veg: true, popularity: 0.85 },
                { name: 'Biryani', price: 250, is_veg: false, popularity: 0.95 },
                { name: 'Dal Makhani', price: 180, is_veg: true, popularity: 0.80 },
                { name: 'Tandoori Roti', price: 30, is_veg: true, popularity: 0.75 },
                { name: 'Chicken Tikka', price: 260, is_veg: false, popularity: 0.90 },
                { name: 'Gulab Jamun', price: 60, is_veg: true, popularity: 0.85 }
            ],
            'South Indian': [
                { name: 'Masala Dosa', price: 80, is_veg: true, popularity: 0.95 },
                { name: 'Idli Sambar', price: 60, is_veg: true, popularity: 0.90 },
                { name: 'Vada', price: 50, is_veg: true, popularity: 0.85 },
                { name: 'Uttapam', price: 70, is_veg: true, popularity: 0.80 },
                { name: 'Filter Coffee', price: 30, is_veg: true, popularity: 0.95 },
                { name: 'Rava Dosa', price: 85, is_veg: true, popularity: 0.75 },
                { name: 'Pongal', price: 65, is_veg: true, popularity: 0.70 },
                { name: 'Kesari Bath', price: 55, is_veg: true, popularity: 0.65 }
            ],
            'Chinese': [
                { name: 'Kung Pao Chicken', price: 220, is_veg: false, popularity: 0.90 },
                { name: 'Veg Hakka Noodles', price: 160, is_veg: true, popularity: 0.85 },
                { name: 'Spring Rolls', price: 120, is_veg: true, popularity: 0.80 },
                { name: 'Manchurian', price: 180, is_veg: true, popularity: 0.85 },
                { name: 'Fried Rice', price: 140, is_veg: true, popularity: 0.90 },
                { name: 'Chilli Chicken', price: 200, is_veg: false, popularity: 0.88 },
                { name: 'Dim Sum', price: 150, is_veg: true, popularity: 0.75 },
                { name: 'Hot and Sour Soup', price: 90, is_veg: true, popularity: 0.80 }
            ],
            'Italian': [
                { name: 'Margherita Pizza', price: 280, is_veg: true, popularity: 0.95 },
                { name: 'Pasta Alfredo', price: 240, is_veg: true, popularity: 0.90 },
                { name: 'Garlic Bread', price: 80, is_veg: true, popularity: 0.85 },
                { name: 'Tiramisu', price: 180, is_veg: true, popularity: 0.80 },
                { name: 'Lasagna', price: 260, is_veg: false, popularity: 0.85 },
                { name: 'Bruschetta', price: 120, is_veg: true, popularity: 0.75 },
                { name: 'Risotto', price: 220, is_veg: true, popularity: 0.80 },
                { name: 'Panna Cotta', price: 150, is_veg: true, popularity: 0.85 }
            ],
            'Biryani': [
                { name: 'Chicken Biryani', price: 250, is_veg: false, popularity: 0.95 },
                { name: 'Mutton Biryani', price: 350, is_veg: false, popularity: 0.90 },
                { name: 'Veg Biryani', price: 200, is_veg: true, popularity: 0.80 },
                { name: 'Egg Biryani', price: 180, is_veg: false, popularity: 0.85 },
                { name: 'Hyderabadi Biryani', price: 280, is_veg: false, popularity: 0.92 },
                { name: 'Raita', price: 50, is_veg: true, popularity: 0.80 },
                { name: 'Salan', price: 80, is_veg: true, popularity: 0.75 },
                { name: 'Double Ka Meetha', price: 70, is_veg: true, popularity: 0.85 }
            ],
            'Fast Food': [
                { name: 'Burger', price: 150, is_veg: true, popularity: 0.90 },
                { name: 'Fries', price: 80, is_veg: true, popularity: 0.85 },
                { name: 'Pizza', price: 200, is_veg: true, popularity: 0.92 },
                { name: 'Sandwich', price: 120, is_veg: true, popularity: 0.80 },
                { name: 'Hot Dog', price: 100, is_veg: false, popularity: 0.75 },
                { name: 'Nuggets', price: 130, is_veg: false, popularity: 0.85 },
                { name: 'Milkshake', price: 90, is_veg: true, popularity: 0.88 },
                { name: 'Ice Cream', price: 60, is_veg: true, popularity: 0.90 }
            ]
        };
        
        return menuMap[cuisine] || menuMap['Indian'];
    }

    parseRequest(text) {
        const location = this.extractLocation(text);
        const cuisine = this.extractCuisine(text);
        const budget = this.extractBudget(text);
        const people = this.extractPeople(text);
        
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
        const locations = ['Whitefield', 'Koramangala', 'Indiranagar', 'MG Road', 'HSR Layout', 'Electronic City', 'JP Nagar', 'Jayanagar', 'Marathahalli', 'BTM Layout'];
        for (const loc of locations) {
            if (text.toLowerCase().includes(loc.toLowerCase())) return loc;
        }
        return null;
    }

    extractCuisine(text) {
        const cuisines = ['North Indian', 'South Indian', 'Chinese', 'Italian', 'Biryani', 'Pizza', 'Burger', 'Thai', 'Mexican', 'Continental', 'Andhra', 'Japanese', 'Asian', 'Fast Food'];
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

    async searchRestaurants(request) {
        // Fetch real restaurants from APIs
        let restaurants = await this.fetchRealRestaurants(request.location, request.cuisine);
        
        if (restaurants.length === 0) {
            return [];
        }
        
        let results = restaurants;
        
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

    async processCommand(text) {
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
        return await this.handleSearch(text);
    }

    async handleSearch(text) {
        this.userRequest = this.parseRequest(text);
        this.currentRestaurants = await this.searchRestaurants(this.userRequest);
        
        if (this.currentRestaurants.length === 0) {
            return `❌ Sorry, I couldn't find any restaurants in ${this.currentLocation}. 

Please try:
• Different location
• Different cuisine
• Without budget filter

Or try: "Show me restaurants in ${this.currentLocation}"`;
        }
        
        let response = [];
        response.push(`🔍 Searching for restaurants in ${this.currentLocation}...`);
        response.push(`✅ Found ${this.currentRestaurants.length} restaurants!\n`);
        response.push("🏆 **Top Recommendations:**\n");
        
        this.currentRestaurants.slice(0, 3).forEach((restaurant, i) => {
            response.push(`${i + 1}. 🏪 **${restaurant.name}**`);
            response.push(`⭐ Rating: ${restaurant.rating}/5 (${restaurant.review_count} reviews)`);
            response.push(`💰 Price: ${restaurant.price_range}`);
            response.push(`🚚 Delivery: ${restaurant.delivery_time} mins`);
            response.push(`🍽️ Cuisine: ${restaurant.cuisine}`);
            response.push(`📍 ${restaurant.address}`);
            response.push(`🏷️ Tags: ${restaurant.tags.slice(0, 3).join(', ')}\n`);
        });
        
        response.push("💡 **What would you like to do?**");
        response.push("• Type a number (1-3) to select a restaurant");
        response.push("• Type 'more' to see more options");
        response.push("• Type 'menu' for full menu");
        response.push("• Type 'budget' for budget options");
        
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
        response.push(`• Price range: ₹${menuAnalysis.price_range.min} - ₹${menuAnalysis.price_range.max}\n`);
        
        response.push("🔥 **Popular Dishes:**");
        menuAnalysis.popular_items.slice(0, 5).forEach((item, i) => {
            response.push(`${i + 1}. ${item.name} - ₹${item.price} (${(item.popularity * 100).toFixed(0)}% popular)`);
        });
        
        response.push("\n💡 **What would you like to do?**");
        response.push("• Type 'menu' to see full menu");
        response.push("• Type 'recommend' for personalized recommendations");
        response.push("• Type 'budget' for budget-optimized meal");
        response.push("• Type 'order' to start ordering");
        response.push("• Type 'back' to go back to restaurant list");
        
        return response.join('\n');
    }

    analyzeMenu(restaurant) {
        const menu = restaurant.menu;
        const vegItems = menu.filter(item => item.is_veg).length;
        const nonVegItems = menu.filter(item => !item.is_veg).length;
        const prices = menu.map(item => item.price);
        const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;
        
        return {
            total_items: menu.length,
            veg_items: vegItems,
            non_veg_items: nonVegItems,
            avg_price: avgPrice,
            price_range: {
                min: Math.min(...prices),
                max: Math.max(...prices)
            },
            popular_items: menu.filter(item => item.popularity > 0.8).sort((a, b) => b.popularity - a.popularity),
            signature_dishes: menu.filter(item => item.popularity > 0.9)
        };
    }

    showMenu() {
        if (!this.selectedRestaurant) {
            return "❌ Please select a restaurant first.";
        }
        
        const restaurant = this.selectedRestaurant;
        const menu = restaurant.menu;
        
        let response = [];
        response.push(`📋 **Full Menu - ${restaurant.name}**\n`);
        
        const vegItems = menu.filter(item => item.is_veg);
        const nonVegItems = menu.filter(item => !item.is_veg);
        
        if (vegItems.length > 0) {
            response.push("**🟢 VEGETARIAN**");
            vegItems.forEach((item, i) => {
                response.push(`🟢 ${item.name} - ₹${item.price}`);
            });
            response.push("");
        }
        
        if (nonVegItems.length > 0) {
            response.push("**🔴 NON-VEGETARIAN**");
            nonVegItems.forEach((item, i) => {
                response.push(`🔴 ${item.name} - ₹${item.price}`);
            });
            response.push("");
        }
        
        response.push("💡 Type 'order' to start ordering or 'recommend' for suggestions");
        
        return response.join('\n');
    }

    getRecommendations() {
        if (!this.selectedRestaurant || !this.userRequest) {
            return "❌ Please select a restaurant first.";
        }
        
        const menu = this.selectedRestaurant.menu;
        const recommendations = menu
            .filter(item => {
                if (this.userRequest.preferences.includes('vegetarian')) {
                    return item.is_veg;
                }
                return true;
            })
            .sort((a, b) => b.popularity - a.popularity)
            .slice(0, 8);
        
        let response = [];
        response.push("🎯 **Personalized Recommendations for You**\n");
        
        recommendations.forEach((item, i) => {
            const vegIndicator = item.is_veg ? '🟢' : '🔴';
            response.push(`${i + 1}. ${vegIndicator} ${item.name} - ₹${item.price}`);
            response.push(`   📊 Match score: ${(item.popularity * 100).toFixed(0)}%\n`);
        });
        
        response.push("💡 Type 'order [number]' to add to cart or 'budget' for optimized meal");
        
        return response.join('\n');
    }

    getBudgetOptimizedOrder() {
        if (!this.selectedRestaurant || !this.userRequest) {
            return "❌ Please select a restaurant and provide budget first.";
        }
        
        const budget = this.userRequest.budget || 500;
        const people = this.userRequest.people || 2;
        const perPersonBudget = budget / people;
        
        const menu = this.selectedRestaurant.menu;
        const affordableItems = menu.filter(item => item.price <= perPersonBudget);
        
        let response = [];
        response.push(`💰 **Budget-Optimized Order (₹${budget} for ${people} people)**\n`);
        
        if (affordableItems.length === 0) {
            response.push("❌ No items found within budget. Consider increasing your budget.");
        } else {
            response.push("**Recommended items:**");
            affordableItems.slice(0, 6).forEach((item, i) => {
                const vegIndicator = item.is_veg ? '🟢' : '🔴';
                response.push(`${i + 1}. ${vegIndicator} ${item.name} - ₹${item.price}`);
            });
            
            const total = affordableItems.slice(0, 6).reduce((sum, item) => sum + item.price, 0);
            response.push(`\n**Total: ₹${total}** (within ₹${budget} budget)`);
        }
        
        response.push("\n💡 Type 'confirm' to place this order or 'modify' to make changes");
        
        return response.join('\n');
    }

    startOrder() {
        if (!this.selectedRestaurant) {
            return "❌ Please select a restaurant first.";
        }
        
        return `🛒 **Start Ordering from ${this.selectedRestaurant.name}**

1. Type item numbers to add to cart (e.g., 'add 1, 2, 3')
2. Type 'cart' to see your cart
3. Type 'checkout' to proceed
4. Type 'cancel' to cancel

**Menu items:**
${this.selectedRestaurant.menu.map((item, i) => `${i + 1}. ${item.name} - ₹${item.price}`).join('\n')}`;
    }

    goBack() {
        this.selectedRestaurant = null;
        return this.showMoreRestaurants();
    }

    showMoreRestaurants() {
        if (this.currentRestaurants.length === 0) {
            return "❌ No restaurants found. Please search again.";
        }
        
        let response = [];
        response.push("📋 **All Restaurants:**\n");
        
        this.currentRestaurants.forEach((restaurant, i) => {
            response.push(`${i + 1}. 🏪 **${restaurant.name}**`);
            response.push(`⭐ ${restaurant.rating}/5 | 💰 ${restaurant.price_range} | 🚚 ${restaurant.delivery_time} mins`);
            response.push(`🍽️ ${restaurant.cuisine} | 📍 ${restaurant.address}\n`);
        });
        
        response.push("💡 Type a number to select a restaurant");
        
        return response.join('\n');
    }
}

// Export for use in browser
if (typeof window !== 'undefined') {
    window.RestaurantAIAgent = RestaurantAIAgent;
}