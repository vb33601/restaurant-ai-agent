// Client-side Restaurant AI Agent
// All logic runs in browser - no backend needed

class RestaurantAIAgent {
    constructor() {
        this.userId = 'user_' + Math.random().toString(36).substr(2, 9);
        this.currentRestaurants = [];
        this.selectedRestaurant = null;
        this.currentOrder = null;
        this.userRequest = null;
        
        // Mock restaurant data for demo
        this.mockRestaurants = [
            {
                id: '1',
                name: 'Udupi Palace',
                cuisine: 'South Indian',
                rating: 4.1,
                review_count: 1100,
                price_range: '₹',
                delivery_time: 20,
                address: 'Whitefield Old Airport Road',
                phone: '+91-80-12345678',
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
                address: 'Whitefield Market',
                phone: '+91-80-87654321',
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
                address: 'ITPL Road, Whitefield',
                phone: '+91-80-11223344',
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
            },
            {
                id: '4',
                name: 'Pizza Hut',
                cuisine: 'Italian, Pizza',
                rating: 4.2,
                review_count: 1500,
                price_range: '₹₹',
                delivery_time: 30,
                address: 'Whitefield Main Road',
                phone: '+91-80-55667788',
                tags: ['pizza', 'fast-food', 'family-friendly'],
                menu: [
                    { name: 'Margherita Pizza', price: 199, is_veg: true, popularity: 0.90, description: 'Classic tomato and cheese' },
                    { name: 'Pepperoni Pizza', price: 249, is_veg: false, popularity: 0.95, description: 'Pepperoni with cheese' },
                    { name: 'Veg Supreme', price: 229, is_veg: true, popularity: 0.85, description: 'Loaded with vegetables' },
                    { name: 'Garlic Bread', price: 99, is_veg: true, popularity: 0.80, description: 'Garlic flavored bread' },
                    { name: 'Pasta Alfredo', price: 179, is_veg: true, popularity: 0.75, description: 'Creamy white sauce pasta' },
                    { name: 'Chicken Wings', price: 149, is_veg: false, popularity: 0.85, description: 'Spicy chicken wings' },
                    { name: 'Chocolate Lava Cake', price: 89, is_veg: true, popularity: 0.90, description: 'Molten chocolate cake' }
                ]
            },
            {
                id: '5',
                name: 'Chinese Wok',
                cuisine: 'Chinese',
                rating: 4.3,
                review_count: 950,
                price_range: '₹₹',
                delivery_time: 35,
                address: 'Whitefield ITPL',
                phone: '+91-80-99887766',
                tags: ['chinese', 'noodles', 'quick'],
                menu: [
                    { name: 'Veg Hakka Noodles', price: 150, is_veg: true, popularity: 0.90, description: 'Stir-fried noodles with vegetables' },
                    { name: 'Chicken Manchurian', price: 180, is_veg: false, popularity: 0.95, description: 'Crispy chicken in Manchurian sauce' },
                    { name: 'Spring Rolls', price: 80, is_veg: true, popularity: 0.85, description: 'Crispy vegetable rolls' },
                    { name: 'Fried Rice', price: 140, is_veg: true, popularity: 0.80, description: 'Stir-fried rice with vegetables' },
                    { name: 'Chilli Paneer', price: 160, is_veg: true, popularity: 0.85, description: 'Spicy paneer cubes' },
                    { name: 'Dim Sum', price: 120, is_veg: true, popularity: 0.75, description: 'Steamed dumplings' },
                    { name: 'Hot and Sour Soup', price: 90, is_veg: true, popularity: 0.80, description: 'Spicy and tangy soup' }
                ]
            }
        ];
    }

    parseRequest(text) {
        const location = this.extractLocation(text);
        const cuisine = this.extractCuisine(text);
        const budget = this.extractBudget(text);
        const people = this.extractPeople(text);
        
        return {
            location: location || 'Whitefield',
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
        const cuisines = ['North Indian', 'South Indian', 'Chinese', 'Italian', 'Biryani', 'Pizza', 'Burger', 'Thai', 'Mexican'];
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
        let results = [...this.mockRestaurants];
        
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
            return "❌ Sorry, I couldn't find any restaurants matching your criteria. Please try adjusting your preferences.";
        }
        
        let response = [];
        response.push("🔍 Searching for restaurants...");
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
        response.push(`• Price range: ₹${menuAnalysis.price_range.min} - ₹${menuAnalysis.price_range.max}\n`);
        
        response.push("🔥 **Popular Dishes:**");
        menuAnalysis.popular_items.slice(0, 5).forEach((item, i) => {
            response.push(`${i + 1}. ${item.name} - ₹${item.price} (${(item.popularity * 100).toFixed(0)}% popular)`);
        });
        
        response.push("\n💡 **What would you like to do?**");
        response.push("• Type 'menu' to see full menu");
        response.push("• Type 'recommend' for personalized dish recommendations");
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
        
        // Group by veg/non-veg for simplicity
        const vegItems = menu.filter(item => item.is_veg);
        const nonVegItems = menu.filter(item => !item.is_veg);
        
        if (vegItems.length > 0) {
            response.push("**🟢 VEGETARIAN**");
            vegItems.forEach((item, i) => {
                response.push(`🟢 ${item.name} - ₹${item.price}`);
                if (item.description) response.push(`   ${item.description}`);
            });
            response.push("");
        }
        
        if (nonVegItems.length > 0) {
            response.push("**🔴 NON-VEGETARIAN**");
            nonVegItems.forEach((item, i) => {
                response.push(`🔴 ${item.name} - ₹${item.price}`);
                if (item.description) response.push(`   ${item.description}`);
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
            response.push(`   💡 Why: ${item.popularity > 0.9 ? 'Very popular' : 'Highly rated'} choice`);
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