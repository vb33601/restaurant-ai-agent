// Client-side Restaurant AI Agent
// Uses backend API for real restaurant data

class RestaurantAIAgent {
    constructor() {
        this.userId = 'user_' + Math.random().toString(36).substr(2, 9);
        this.currentRestaurants = [];
        this.selectedRestaurant = null;
        this.currentOrder = null;
        this.userRequest = null;
        this.currentLocation = 'Whitefield';
        // For localtunnel, we need to use the same origin
        // But the API runs on a different port locally
        // For tunnel, we need to use the tunnel URL + API endpoints
        this.apiUrl = window.location.origin;
    }

    // Fetch real restaurants from backend API
    async fetchRealRestaurants(location, cuisine) {
        try {
            const response = await fetch(`${this.apiUrl}/api/restaurants?location=${encodeURIComponent(location)}&cuisine=${encodeURIComponent(cuisine || '')}`, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            const data = await response.json();
            
            if (data.success && data.restaurants.length > 0) {
                return data.restaurants;
            } else {
                return [];
            }
        } catch (error) {
            console.error('Error fetching restaurants:', error);
            return [];
        }
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
        // Fetch real restaurants from backend API
        const restaurants = await this.fetchRealRestaurants(request.location, request.cuisine);
        
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