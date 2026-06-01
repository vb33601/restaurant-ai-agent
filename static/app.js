// Restaurant AI Agent — live data from OpenStreetMap via Flask backend

class RestaurantAIAgent {
    constructor() {
        this.userId = 'user_' + Math.random().toString(36).substr(2, 9);
        this.currentRestaurants = [];
        this.selectedRestaurant = null;
        this.userRequest = null;
        this.currentLocation = null; // null until user mentions a location
    }

    // ── Request parsing ────────────────────────────────────────────────────────
    parseRequest(text) {
        const location = this.extractLocation(text);
        if (location) this.currentLocation = location;
        return {
            location: this.currentLocation,
            locationDetected: !!location,
            cuisine: this.extractCuisine(text),
            budget: this.extractBudget(text),
            people: this.extractPeople(text) || 2,
            preferences: this.extractPreferences(text),
        };
    }

    extractLocation(text) {
        // 1. Known Bangalore neighbourhoods
        const bangaloreAreas = [
            'Whitefield', 'Koramangala', 'Indiranagar', 'MG Road',
            'HSR Layout', 'Electronic City', 'JP Nagar', 'Jayanagar',
            'Marathahalli', 'BTM Layout', 'Sarjapur', 'Hebbal',
            'Yeshwanthpur', 'Rajajinagar', 'Malleshwaram', 'Bellandur',
            'Bommanahalli', 'Bannerghatta', 'Yelahanka', 'Kengeri',
            'Banashankari', 'Basavanagudi', 'Vijayanagar', 'RT Nagar',
        ];
        for (const loc of bangaloreAreas) {
            if (text.toLowerCase().includes(loc.toLowerCase())) return loc;
        }

        // 2. Indian cities
        const indianCities = [
            'Mumbai', 'Delhi', 'New Delhi', 'Chennai', 'Hyderabad', 'Pune',
            'Kolkata', 'Bangalore', 'Bengaluru', 'Gurgaon', 'Gurugram',
            'Noida', 'Ahmedabad', 'Jaipur', 'Lucknow', 'Chandigarh',
            'Kochi', 'Cochin', 'Bhopal', 'Nagpur', 'Surat', 'Vadodara',
            'Indore', 'Visakhapatnam', 'Vizag', 'Patna', 'Agra',
            'Nashik', 'Meerut', 'Rajkot', 'Coimbatore', 'Mysore',
            'Mysuru', 'Mangalore', 'Hubli', 'Dharwad', 'Thiruvananthapuram',
            'Trivandrum', 'Goa', 'Panaji', 'Bhubaneswar', 'Raipur',
        ];
        for (const city of indianCities) {
            if (text.toLowerCase().includes(city.toLowerCase())) return city;
        }

        // 3. Pattern: "in / near / at / around / for <Location>"
        const m = text.match(/\b(?:in|near|at|around|from|for)\s+([A-Z][a-zA-Z](?:[a-zA-Z\s]{1,25}?)?)(?=\s*(?:under|with|,|\.|\?|$))/i);
        if (m) return m[1].trim();

        return null;
    }

    extractCuisine(text) {
        const cuisines = [
            'North Indian', 'South Indian', 'Chinese', 'Italian', 'Biryani',
            'Pizza', 'Burger', 'Thai', 'Mexican', 'Continental', 'Andhra',
            'Japanese', 'Asian', 'Fast Food', 'Cafe', 'Kerala', 'Mughlai',
            'Seafood', 'BBQ', 'Street Food', 'Desserts', 'Bakery',
        ];
        for (const c of cuisines) {
            if (text.toLowerCase().includes(c.toLowerCase())) return c;
        }
        return null;
    }

    extractBudget(text) {
        const m = text.match(/(?:under|below|less than|within|budget of|₹)\s*(\d+)/);
        return m ? parseInt(m[1]) : null;
    }

    extractPeople(text) {
        const m = text.match(/(\d+)\s*(?:people|person|pax)/);
        return m ? parseInt(m[1]) : null;
    }

    extractPreferences(text) {
        const prefs = [];
        if (/\bveg\b/i.test(text)) prefs.push('vegetarian');
        if (/non.?veg/i.test(text)) prefs.push('non-vegetarian');
        if (/spicy/i.test(text)) prefs.push('spicy');
        if (/healthy/i.test(text)) prefs.push('healthy');
        if (/quick|fast/i.test(text)) prefs.push('quick');
        return prefs;
    }

    // ── Command dispatcher ─────────────────────────────────────────────────────
    async processCommand(text) {
        const trimmed = text.trim();
        const lower = trimmed.toLowerCase();

        // Number → select restaurant
        if (/^\d+$/.test(trimmed)) {
            const idx = parseInt(trimmed) - 1;
            if (idx >= 0 && idx < this.currentRestaurants.length) {
                return this.selectRestaurant(idx);
            }
            if (this.currentRestaurants.length > 0) {
                return `❌ Please enter a number between 1 and ${this.currentRestaurants.length}.`;
            }
        }

        if (lower === 'yes' && this.currentLocation) {
            return await this.handleSearch(this.currentLocation);
        }
        if (lower === 'menu' || lower === 'show menu' || lower === 'view menu') {
            return this.showMenu();
        }
        if (lower.includes('recommend')) return this.getRecommendations();
        if (lower.includes('budget'))    return this.getBudgetOptimizedOrder();
        if (lower.includes('order'))     return this.startOrder();
        if (lower === 'back')            return this.goBack();
        if (lower === 'more')            return this.showMoreRestaurants();

        return await this.handleSearch(trimmed);
    }

    // ── Live search ────────────────────────────────────────────────────────────
    async handleSearch(text) {
        this.userRequest = this.parseRequest(text);

        if (!this.userRequest.locationDetected && !this.userRequest.location) {
            return (
                '📍 **Please tell me where you are looking for restaurants.**\n\n' +
                'Examples:\n' +
                '• "Restaurants in Whitefield"\n' +
                '• "Best biryani in Hyderabad"\n' +
                '• "Pizza places in Mumbai"\n' +
                '• "South Indian food near Koramangala"'
            );
        }

        if (!this.userRequest.locationDetected && this.userRequest.location) {
            return (
                `📍 I couldn't detect a location in your message.\n\n` +
                `Did you mean **${this.userRequest.location}** (your last search)?  \n` +
                `Type "yes" to search there, or tell me a city/area — e.g. **"restaurants in Mumbai"**.`
            );
        }

        const params = new URLSearchParams({
            location: this.userRequest.location,
            cuisine:  this.userRequest.cuisine || '',
        });

        let data;
        try {
            const resp = await fetch(`/api/restaurants?${params}`);
            data = await resp.json();
        } catch (err) {
            console.error('Network error:', err);
            return '❌ Network error — please check your connection and try again.';
        }

        if (!data.success || !data.restaurants || data.restaurants.length === 0) {
            const err = data.error || 'No restaurants found.';
            return (
                `❌ ${err}\n\n` +
                '**Try:**\n' +
                '• A different neighbourhood or city name\n' +
                '• Broader search without cuisine filter\n' +
                `• [🍽️ Search Zomato](https://www.zomato.com/search?q=${encodeURIComponent(this.userRequest.location)})\n` +
                `• [🛵 Search Swiggy](https://www.swiggy.com/search?query=${encodeURIComponent(this.userRequest.location)})`
            );
        }

        let restaurants = data.restaurants;

        // Optional client-side filters
        if (this.userRequest.budget) {
            const filtered = restaurants.filter(r => {
                if (!r.menu || !r.menu.length) return true;
                const avg = r.menu.reduce((s, i) => s + i.price, 0) / r.menu.length;
                return avg <= this.userRequest.budget / this.userRequest.people;
            });
            if (filtered.length) restaurants = filtered;
        }
        if (this.userRequest.preferences.includes('vegetarian')) {
            const filtered = restaurants.filter(r =>
                !r.menu || !r.menu.length || r.menu.some(i => i.is_veg)
            );
            if (filtered.length) restaurants = filtered;
        }

        this.currentRestaurants = restaurants;

        const lines = [];
        lines.push(`🔍 Found **${restaurants.length} restaurants** in **${this.userRequest.location}**\n`);
        if (this.userRequest.cuisine) {
            lines.push(`🍽️ Cuisine filter: _${this.userRequest.cuisine}_\n`);
        }
        lines.push('---\n');

        restaurants.slice(0, 10).forEach((r, i) => {
            lines.push(`**${i + 1}. ${r.name}**`);
            lines.push(`🍽️ ${r.cuisine || 'Various'}`);
            if (r.rating) lines.push(`⭐ ${r.rating}/5`);
            if (r.price_range) lines.push(`💰 ${r.price_range}`);
            lines.push(`📍 ${r.address || this.userRequest.location}`);
            if (r.phone) lines.push(`📞 ${r.phone}`);
            if (r.opening_hours) lines.push(`🕐 ${r.opening_hours}`);
            if (r.order_links) {
                const ol = r.order_links;
                const parts = [];
                if (ol.swiggy)  parts.push(`[🛵 Swiggy](${ol.swiggy})`);
                if (ol.zomato)  parts.push(`[🍽️ Zomato](${ol.zomato})`);
                if (ol.website) parts.push(`[🌐 Website](${ol.website})`);
                if (ol.google)  parts.push(`[🔍 Google](${ol.google})`);
                lines.push(`🛒 ${parts.join(' · ')}`);
            }
            lines.push('');
        });

        lines.push('---');
        lines.push('💡 Type a **number** to see details · **more** for full list · **back** to reset');
        return lines.join('\n');
    }

    // ── Restaurant detail ──────────────────────────────────────────────────────
    selectRestaurant(index) {
        this.selectedRestaurant = this.currentRestaurants[index];
        const r = this.selectedRestaurant;
        const ol = r.order_links || {};

        const lines = [];
        lines.push(`## 🏪 ${r.name}\n`);
        lines.push(`🍽️ **Cuisine:** ${r.cuisine || 'Various'}`);
        if (r.rating)        lines.push(`⭐ **Rating:** ${r.rating}/5`);
        if (r.price_range)   lines.push(`💰 **Price:** ${r.price_range}`);
        if (r.address)       lines.push(`📍 **Address:** ${r.address}`);
        if (r.phone)         lines.push(`📞 **Phone:** ${r.phone}`);
        if (r.opening_hours) lines.push(`🕐 **Hours:** ${r.opening_hours}`);

        lines.push('');
        lines.push('### 🛒 Order / View Menu Online');
        if (ol.swiggy)  lines.push(`• [🛵 Swiggy](${ol.swiggy})`);
        if (ol.zomato)  lines.push(`• [🍽️ Zomato](${ol.zomato})`);
        if (ol.ubereats) lines.push(`• [🚗 UberEats](${ol.ubereats})`);
        if (ol.website) lines.push(`• [🌐 Official Website](${ol.website})`);
        if (ol.google)  lines.push(`• [🔍 Google Search](${ol.google})`);

        lines.push('');
        lines.push('---');
        lines.push('💡 Type **order** to get ordering links · **back** to return to list');
        return lines.join('\n');
    }

    // ── Menu (redirects to live platforms since OSM has no menu data) ──────────
    showMenu() {
        if (!this.selectedRestaurant) {
            return (
                '❌ No restaurant selected yet.\n\n' +
                'First search for restaurants and pick one by number.\n' +
                'Example: "restaurants in Whitefield" → then type **1**'
            );
        }
        const r = this.selectedRestaurant;
        const ol = r.order_links || {};
        const enc = encodeURIComponent(r.name);

        const lines = [];
        lines.push(`### 📋 Menu — ${r.name}\n`);
        lines.push('Live menus are available on these platforms:\n');
        lines.push(`• [🍽️ Zomato Menu](https://www.zomato.com/search?q=${enc})`);
        lines.push(`• [🛵 Swiggy Menu](https://www.swiggy.com/search?query=${enc})`);
        if (ol.website) lines.push(`• [🌐 Official Website](${ol.website})`);
        lines.push(`• [🔍 Google — "${r.name}" menu](https://www.google.com/search?q=${enc}+menu)`);
        lines.push('');
        lines.push('_Tip: Click any link above to browse the full, up-to-date menu and order directly._');
        return lines.join('\n');
    }

    // ── Recommendations ────────────────────────────────────────────────────────
    getRecommendations() {
        if (!this.selectedRestaurant) {
            return '❌ Select a restaurant first by typing its number.';
        }
        const r = this.selectedRestaurant;
        const ol = r.order_links || {};
        const lines = [];
        lines.push(`### 🎯 Recommendations for ${r.name}\n`);
        lines.push(`This is a **${r.cuisine || 'Various'}** restaurant in ${r.address || 'your area'}.\n`);
        lines.push('For personalised recommendations and ratings, visit:');
        if (ol.zomato)  lines.push(`• [🍽️ Zomato](${ol.zomato}) — user reviews & ratings`);
        if (ol.swiggy)  lines.push(`• [🛵 Swiggy](${ol.swiggy}) — popular items highlighted`);
        if (ol.website) lines.push(`• [🌐 Website](${ol.website})`);
        if (ol.google)  lines.push(`• [🔍 Google](${ol.google}) — photos & reviews`);
        return lines.join('\n');
    }

    // ── Budget helper ──────────────────────────────────────────────────────────
    getBudgetOptimizedOrder() {
        if (!this.selectedRestaurant) {
            return '❌ Select a restaurant first by typing its number.';
        }
        const r = this.selectedRestaurant;
        const budget = this.userRequest?.budget || null;
        const ol = r.order_links || {};

        const lines = [];
        if (budget) {
            lines.push(`### 💰 Budget ₹${budget} at ${r.name}\n`);
            lines.push(`Check the menu on Zomato or Swiggy to find items within your budget:`);
        } else {
            lines.push(`### 💰 Order from ${r.name}\n`);
            lines.push('Find budget options on:');
        }
        if (ol.zomato)  lines.push(`• [🍽️ Zomato](${ol.zomato})`);
        if (ol.swiggy)  lines.push(`• [🛵 Swiggy](${ol.swiggy})`);
        if (ol.ubereats) lines.push(`• [🚗 UberEats](${ol.ubereats})`);
        if (ol.google)  lines.push(`• [🔍 Google](${ol.google})`);
        return lines.join('\n');
    }

    // ── Order ──────────────────────────────────────────────────────────────────
    startOrder() {
        if (!this.selectedRestaurant) {
            return '❌ Select a restaurant first by typing its number.';
        }
        return this.selectRestaurant(
            this.currentRestaurants.indexOf(this.selectedRestaurant)
        );
    }

    // ── Navigation ─────────────────────────────────────────────────────────────
    goBack() {
        this.selectedRestaurant = null;
        return this.currentRestaurants.length
            ? this.showMoreRestaurants()
            : '❌ No search results yet. Try searching for restaurants.';
    }

    showMoreRestaurants() {
        if (!this.currentRestaurants.length) {
            return '❌ No restaurants loaded. Please search first.';
        }
        const lines = [`### 📋 All results in ${this.userRequest?.location || 'your area'}\n`];
        this.currentRestaurants.forEach((r, i) => {
            const ol = r.order_links || {};
            lines.push(`**${i + 1}. ${r.name}** — ${r.cuisine || 'Various'}`);
            lines.push(`📍 ${r.address || ''}`);
            const parts = [];
            if (ol.swiggy) parts.push(`[Swiggy](${ol.swiggy})`);
            if (ol.zomato) parts.push(`[Zomato](${ol.zomato})`);
            if (ol.google) parts.push(`[Google](${ol.google})`);
            if (parts.length) lines.push(`🛒 ${parts.join(' · ')}`);
            lines.push('');
        });
        lines.push('💡 Type a number to select a restaurant');
        return lines.join('\n');
    }
}

if (typeof window !== 'undefined') {
    window.RestaurantAIAgent = RestaurantAIAgent;
}
