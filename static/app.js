// Restaurant AI Agent — worldwide live data from OpenStreetMap

class RestaurantAIAgent {
    constructor() {
        this.userId = 'user_' + Math.random().toString(36).substr(2, 9);
        this.currentRestaurants = [];
        this.selectedRestaurant = null;
        this.userRequest = null;
        this.currentLocation = null;
    }

    // ── Location extraction ────────────────────────────────────────────────────
    extractLocation(text) {
        const t = text.toLowerCase();

        const knownPlaces = [
            // India — Bangalore areas
            'Whitefield','Koramangala','Indiranagar','MG Road','HSR Layout',
            'Electronic City','JP Nagar','Jayanagar','Marathahalli','BTM Layout',
            'Sarjapur','Hebbal','Yeshwanthpur','Rajajinagar','Malleshwaram',
            'Bellandur','Bommanahalli','Bannerghatta','Yelahanka','Kengeri',
            'Banashankari','Basavanagudi','Vijayanagar','RT Nagar',
            // India — cities
            'Mumbai','Delhi','New Delhi','Chennai','Hyderabad','Pune','Kolkata',
            'Bangalore','Bengaluru','Gurgaon','Gurugram','Noida','Ahmedabad',
            'Jaipur','Lucknow','Chandigarh','Kochi','Cochin','Bhopal','Nagpur',
            'Surat','Vadodara','Indore','Visakhapatnam','Vizag','Patna','Agra',
            'Nashik','Meerut','Rajkot','Coimbatore','Mysore','Mysuru','Mangalore',
            'Hubli','Dharwad','Thiruvananthapuram','Trivandrum','Goa','Panaji',
            'Bhubaneswar','Raipur','Amritsar','Jalandhar','Ludhiana','Varanasi',
            'Allahabad','Prayagraj','Jodhpur','Udaipur','Kota','Ajmer','Bikaner',
            'Shimla','Dehradun','Haridwar','Rishikesh','Nainital','Mussoorie',
            'Guwahati','Shillong','Imphal','Aizawl','Kohima','Agartala',
            // Europe
            'Rome','Milan','Venice','Florence','Naples','Turin','Bologna',
            'Paris','Lyon','Marseille','Nice','Bordeaux','Toulouse','Strasbourg',
            'London','Manchester','Birmingham','Leeds','Edinburgh','Glasgow','Liverpool',
            'Berlin','Munich','Hamburg','Frankfurt','Cologne','Stuttgart','Düsseldorf',
            'Madrid','Barcelona','Seville','Valencia','Bilbao','Malaga','Granada',
            'Amsterdam','Rotterdam','The Hague','Utrecht',
            'Vienna','Salzburg','Innsbruck',
            'Prague','Brno','Bratislava',
            'Budapest','Krakow','Warsaw','Wroclaw','Gdansk',
            'Athens','Thessaloniki','Heraklion',
            'Istanbul','Ankara','Izmir','Antalya','Bodrum',
            'Zurich','Geneva','Basel','Bern',
            'Brussels','Bruges','Ghent','Antwerp',
            'Lisbon','Porto','Faro',
            'Dublin','Cork','Galway',
            'Stockholm','Gothenburg','Malmo',
            'Oslo','Bergen','Trondheim',
            'Copenhagen','Aarhus','Odense',
            'Helsinki','Tampere','Turku',
            'Riga','Vilnius','Tallinn',
            'Kyiv','Lviv','Odessa',
            'Moscow','Saint Petersburg','Novosibirsk','Yekaterinburg',
            'Bucharest','Cluj-Napoca','Timisoara',
            'Belgrade','Zagreb','Ljubljana','Sarajevo','Skopje','Tirana',
            'Sofia','Varna','Plovdiv',
            'Reykjavik',
            // Americas — North
            'New York','Los Angeles','Chicago','Houston','Phoenix','Philadelphia',
            'San Antonio','San Diego','Dallas','San Jose','Austin','Jacksonville',
            'Fort Worth','Columbus','Charlotte','Indianapolis','San Francisco',
            'Seattle','Denver','Nashville','Oklahoma City','El Paso','Boston',
            'Portland','Las Vegas','Memphis','Louisville','Baltimore','Milwaukee',
            'Albuquerque','Tucson','Fresno','Sacramento','Mesa','Kansas City',
            'Atlanta','Miami','Orlando','Tampa','Minneapolis','Cleveland',
            'Toronto','Montreal','Vancouver','Calgary','Edmonton','Ottawa',
            'Winnipeg','Quebec City','Halifax',
            'Mexico City','Guadalajara','Monterrey','Tijuana','Puebla','Cancun',
            // Americas — South / Caribbean
            'Sao Paulo','Rio de Janeiro','Brasilia','Salvador','Fortaleza','Recife',
            'Buenos Aires','Cordoba','Rosario','Mendoza',
            'Bogota','Medellin','Cali','Cartagena',
            'Lima','Cusco','Arequipa',
            'Santiago','Valparaiso',
            'Caracas','Maracaibo',
            'Quito','Guayaquil',
            'La Paz','Santa Cruz',
            'Montevideo',
            'Asuncion',
            'Panama City','San Jose','Guatemala City','Tegucigalpa','Managua',
            'Havana','Santo Domingo','San Juan','Kingston',
            // Asia — East
            'Tokyo','Osaka','Kyoto','Yokohama','Nagoya','Sapporo','Fukuoka','Nara',
            'Seoul','Busan','Incheon','Daegu','Gwangju',
            'Beijing','Shanghai','Guangzhou','Shenzhen','Chengdu','Chongqing',
            'Wuhan','Xian','Nanjing','Hangzhou','Tianjin','Suzhou',
            'Hong Kong','Macau',
            'Taipei','Taichung','Kaohsiung',
            // Asia — Southeast
            'Singapore',
            'Bangkok','Chiang Mai','Phuket','Pattaya','Koh Samui',
            'Kuala Lumpur','Penang','Johor Bahru','Kota Kinabalu',
            'Jakarta','Bali','Surabaya','Bandung','Yogyakarta','Medan',
            'Manila','Cebu','Davao',
            'Ho Chi Minh City','Hanoi','Da Nang','Hoi An','Nha Trang','Hue',
            'Phnom Penh','Siem Reap',
            'Vientiane','Luang Prabang',
            'Yangon','Mandalay','Naypyidaw',
            // Asia — South
            'Colombo','Kandy','Negombo',
            'Dhaka','Chittagong',
            'Karachi','Lahore','Islamabad','Rawalpindi','Faisalabad','Peshawar',
            'Kathmandu','Pokhara',
            'Thimphu',
            // Asia — Central & West
            'Dubai','Abu Dhabi','Sharjah','Muscat','Doha','Manama',
            'Riyadh','Jeddah','Mecca','Medina','Dammam',
            'Kuwait City','Amman','Beirut','Damascus','Baghdad',
            'Tehran','Isfahan','Shiraz','Mashhad','Tabriz',
            'Tel Aviv','Jerusalem','Haifa','Be\'er Sheva',
            'Tashkent','Almaty','Nur-Sultan','Bishkek','Dushanbe','Ashgabat',
            'Baku','Tbilisi','Yerevan',
            // Africa
            'Cairo','Alexandria','Giza','Luxor','Aswan',
            'Casablanca','Marrakech','Fez','Rabat','Tangier',
            'Tunis','Algiers','Tripoli',
            'Lagos','Abuja','Kano','Ibadan','Port Harcourt',
            'Nairobi','Mombasa','Kisumu',
            'Accra','Kumasi',
            'Johannesburg','Cape Town','Durban','Pretoria','Port Elizabeth',
            'Addis Ababa','Dire Dawa',
            'Dar es Salaam','Zanzibar','Arusha',
            'Kampala','Kigali','Bujumbura',
            'Dakar','Abidjan','Bamako','Ouagadougou','Conakry',
            'Kinshasa','Lubumbashi',
            'Luanda','Harare','Lusaka',
            'Antananarivo',
            // Oceania
            'Sydney','Melbourne','Brisbane','Perth','Adelaide','Canberra',
            'Gold Coast','Newcastle','Wollongong','Hobart','Darwin',
            'Auckland','Wellington','Christchurch','Hamilton','Dunedin',
        ];

        for (const place of knownPlaces) {
            if (t.includes(place.toLowerCase())) return place;
        }

        // Generic pattern: preposition + Title-case location
        const m = text.match(
            /\b(?:in|near|at|around|from|for|inside|within|across)\s+([A-Z][a-zA-Z](?:[a-zA-Z\s]{1,30}?)?)(?=\s*(?:under|with|,|\.|\?|$))/
        );
        if (m) return m[1].trim();

        return null;
    }

    extractCuisine(text) {
        const t = text.toLowerCase();
        // ordered: more specific first
        const cuisines = [
            // Italian
            'Italian','Pizza','Pasta','Risotto','Gelato','Antipasti','Trattoria',
            // French
            'French','Bistro','Brasserie','Patisserie','Crepe',
            // Japanese
            'Japanese','Sushi','Ramen','Tempura','Udon','Soba','Yakitori',
            'Izakaya','Tonkatsu','Okonomiyaki','Takoyaki','Wagyu',
            // Chinese
            'Chinese','Cantonese','Sichuan','Dim Sum','Hot Pot','Peking Duck',
            'Dumplings','Wonton','Xiaolongbao',
            // Korean
            'Korean','BBQ','Bibimbap','Bulgogi','Tteokbokki',
            // Indian
            'North Indian','South Indian','Biryani','Curry','Tandoori',
            'Mughlai','Andhra','Kerala','Bengali','Street Food','Indian',
            // Southeast Asian
            'Thai','Vietnamese','Pho','Pad Thai','Malaysian','Indonesian',
            'Filipino','Singaporean','Banh Mi','Laksa','Nasi Goreng',
            // Middle Eastern / Mediterranean
            'Lebanese','Turkish','Greek','Moroccan','Persian','Iranian',
            'Shawarma','Kebab','Falafel','Hummus','Mezze','Mediterranean',
            'Middle Eastern',
            // Americas
            'American','Burgers','Burger','BBQ','Steakhouse','Mexican',
            'Tacos','Burritos','Brazilian','Churrasco','Peruvian','Ceviche',
            'Argentinian','Colombian','Caribbean',
            // European
            'Spanish','German','Austrian','Eastern European','Polish','Russian',
            'British','Fish and Chips','Tapas','Paella',
            // African
            'Ethiopian','Nigerian','Moroccan African',
            // Generic
            'Seafood','Vegetarian','Vegan','Healthy','Salad','Sandwiches',
            'Cafe','Coffee','Bakery','Desserts','Ice Cream','Fast Food','Snacks',
        ];
        for (const c of cuisines) {
            if (t.includes(c.toLowerCase())) return c;
        }
        return null;
    }

    extractBudget(text) {
        const m = text.match(/(?:under|below|less than|within|budget of|₹|\$|€|£)\s*(\d+)/i);
        return m ? parseInt(m[1]) : null;
    }

    extractPeople(text) {
        const m = text.match(/(\d+)\s*(?:people|person|pax|guests?)/i);
        return m ? parseInt(m[1]) : null;
    }

    extractPreferences(text) {
        const t = text.toLowerCase();
        const prefs = [];
        if (/\bveg\b/.test(t))          prefs.push('vegetarian');
        if (/non.?veg/i.test(t))        prefs.push('non-vegetarian');
        if (/vegan/i.test(t))           prefs.push('vegan');
        if (/spicy/i.test(t))           prefs.push('spicy');
        if (/healthy/i.test(t))         prefs.push('healthy');
        if (/quick|fast delivery/i.test(t)) prefs.push('quick');
        if (/rooftop|outdoor/i.test(t)) prefs.push('outdoor');
        if (/fine.?dining|fancy|upscale/i.test(t)) prefs.push('fine-dining');
        if (/budget|cheap|affordable/i.test(t)) prefs.push('budget');
        return prefs;
    }

    // ── Recommendation scoring ─────────────────────────────────────────────────
    scoreRestaurant(r, req) {
        let score = 0;

        // Data completeness = proxy for quality / popularity
        if (r.phone)          score += 15;
        if (r.website)        score += 20;
        if (r.opening_hours)  score += 10;
        if (r.address && r.address !== req.location) score += 10;

        // Cuisine relevance
        if (req.cuisine) {
            const cu = (r.cuisine || '').toLowerCase();
            const rc = req.cuisine.toLowerCase();
            if (cu.includes(rc) || rc.includes(cu)) score += 40;
            else if (cu !== 'various') score += 5;
        }

        // Preference boosts
        const cu = (r.cuisine || '').toLowerCase();
        if (req.preferences.includes('vegetarian') && /veg|vegetarian|plant/i.test(cu)) score += 20;
        if (req.preferences.includes('fine-dining') && /fine|upscale|grill/i.test(r.name || '')) score += 15;
        if (req.preferences.includes('budget') && !/fine|upscale/i.test(r.name || '')) score += 10;

        // Penalise generic / unnamed
        if (!r.cuisine || r.cuisine === 'Various') score -= 5;

        return score;
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

    // ── Command dispatcher ─────────────────────────────────────────────────────
    async processCommand(text) {
        const trimmed = text.trim();
        const lower = trimmed.toLowerCase();

        // Number → select restaurant
        if (/^\d+$/.test(trimmed)) {
            const idx = parseInt(trimmed) - 1;
            if (idx >= 0 && idx < this.currentRestaurants.length)
                return this.selectRestaurant(idx);
            if (this.currentRestaurants.length > 0)
                return `❌ Please enter a number between 1 and ${this.currentRestaurants.length}.`;
        }

        // "yes [optional city]" — confirm previous location or use given city
        if (lower === 'yes' && this.currentLocation)
            return await this.handleSearch(this.currentLocation);
        if (lower.startsWith('yes ')) {
            const afterYes = trimmed.slice(4).trim();
            return await this.handleSearch(afterYes);
        }

        if (lower === 'menu' || lower === 'show menu' || lower === 'view menu')
            return this.showMenu();
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
                'Works for any city worldwide! Examples:\n' +
                '• "Restaurants in Rome"\n' +
                '• "Best sushi in Tokyo"\n' +
                '• "Pizza places in New York"\n' +
                '• "Biryani in Hyderabad"\n' +
                '• "Vegan food in Amsterdam"'
            );
        }

        if (!this.userRequest.locationDetected && this.userRequest.location) {
            return (
                `📍 I couldn't detect a location in your message.\n\n` +
                `Did you mean **${this.userRequest.location}** (your last search)?  \n` +
                `Type **"yes"** to search there, or try: **"restaurants in Rome"**.`
            );
        }

        const params = new URLSearchParams({
            location: this.userRequest.location,
            cuisine:  this.userRequest.cuisine || '',
        });

        let data;
        try {
            const controller = new AbortController();
            const timer = setTimeout(() => controller.abort(), 90000);
            const resp = await fetch(`/api/restaurants?${params}`, { signal: controller.signal });
            clearTimeout(timer);
            data = await resp.json();
        } catch (err) {
            const loc  = encodeURIComponent(this.userRequest.location);
            const cui  = encodeURIComponent(this.userRequest.cuisine || 'restaurants');
            return (
                `⏱️ The search timed out or failed for **${this.userRequest.location}**.\n\n` +
                `This sometimes happens for very large areas (countries/continents). ` +
                `Try a specific city instead — e.g. **"sushi in Rome"** instead of "sushi in Italy".\n\n` +
                `**Search directly on:**\n` +
                `• [🗺️ Google Maps](https://www.google.com/maps/search/${cui}+in+${loc})\n` +
                `• [🍽️ Zomato](https://www.zomato.com/search?q=${cui}+${loc})\n` +
                `• [🛵 Swiggy](https://www.swiggy.com/search?query=${cui})\n` +
                `• [🔍 Google](https://www.google.com/search?q=${cui}+restaurants+${loc})`
            );
        }

        if (!data.success || !data.restaurants || !data.restaurants.length) {
            const loc = encodeURIComponent(this.userRequest.location);
            const cui = encodeURIComponent(this.userRequest.cuisine || 'restaurants');
            const err = data.error || 'No restaurants found.';
            return (
                `❌ ${err}\n\n` +
                `**Search directly on:**\n` +
                `• [🗺️ Google Maps](https://www.google.com/maps/search/${cui}+in+${loc})\n` +
                `• [🍽️ Zomato](https://www.zomato.com/search?q=${cui}+${loc})\n` +
                `• [🛵 Swiggy](https://www.swiggy.com/search?query=${cui})\n` +
                `• [🔍 Google](https://www.google.com/search?q=${cui}+restaurants+${loc})`
            );
        }

        // Score & sort
        let restaurants = data.restaurants.map(r => ({
            ...r,
            _score: this.scoreRestaurant(r, this.userRequest),
        })).sort((a, b) => b._score - a._score);

        // Optional budget filter (client-side)
        if (this.userRequest.budget) {
            const f = restaurants.filter(r =>
                !r.menu || !r.menu.length ||
                r.menu.reduce((s, i) => s + i.price, 0) / r.menu.length
                    <= this.userRequest.budget / this.userRequest.people
            );
            if (f.length) restaurants = f;
        }

        this.currentRestaurants = restaurants;

        const cuisineGroups = this._groupByCuisine(restaurants);

        const lines = [];
        lines.push(`🌍 Found **${restaurants.length} restaurants** in **${this.userRequest.location}**\n`);
        if (this.userRequest.cuisine)
            lines.push(`🍽️ Cuisine filter: _${this.userRequest.cuisine}_\n`);
        if (this.userRequest.preferences.length)
            lines.push(`✨ Preferences: _${this.userRequest.preferences.join(', ')}_\n`);

        // Cuisine category summary
        if (Object.keys(cuisineGroups).length > 1) {
            const topCats = Object.entries(cuisineGroups)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 8)
                .map(([c, n]) => `${c} (${n})`)
                .join(' · ');
            lines.push(`📊 **Cuisine mix:** ${topCats}\n`);
        }

        lines.push('---\n');
        lines.push('### 🏆 Top Recommendations\n');

        restaurants.slice(0, 10).forEach((r, i) => {
            const badges = this._badges(r, this.userRequest);
            lines.push(`**${i + 1}. ${r.name}**${badges ? '  ' + badges : ''}`);
            lines.push(`🍽️ ${r.cuisine || 'Various'}`);
            if (r.rating) lines.push(`⭐ ${r.rating}/5`);
            lines.push(`📍 ${r.address || this.userRequest.location}`);
            if (r.phone)          lines.push(`📞 ${r.phone}`);
            if (r.opening_hours)  lines.push(`🕐 ${r.opening_hours}`);
            if (r.order_links) {
                const ol = r.order_links;
                const parts = [];
                if (ol.swiggy)   parts.push(`[🛵 Swiggy](${ol.swiggy})`);
                if (ol.zomato)   parts.push(`[🍽️ Zomato](${ol.zomato})`);
                if (ol.website)  parts.push(`[🌐 Website](${ol.website})`);
                if (ol.google)   parts.push(`[🔍 Google](${ol.google})`);
                lines.push(`🛒 ${parts.join(' · ')}`);
            }
            lines.push('');
        });

        lines.push('---');
        lines.push('💡 Type a **number** to see full details · **more** to see all · **back** to reset');
        return lines.join('\n');
    }

    _groupByCuisine(restaurants) {
        const map = {};
        for (const r of restaurants) {
            const key = r.cuisine && r.cuisine !== 'Various' ? r.cuisine.split(',')[0].trim() : 'Other';
            map[key] = (map[key] || 0) + 1;
        }
        return map;
    }

    _badges(r, req) {
        const badges = [];
        if (r.website)       badges.push('🌐');
        if (r.opening_hours) badges.push('🕐');
        if (r.phone)         badges.push('📞');
        if (req.preferences.includes('vegetarian') && /veg/i.test(r.cuisine)) badges.push('🥗');
        return badges.join('');
    }

    // ── Restaurant detail ──────────────────────────────────────────────────────
    selectRestaurant(index) {
        this.selectedRestaurant = this.currentRestaurants[index];
        const r = this.selectedRestaurant;
        const ol = r.order_links || {};
        const enc = encodeURIComponent(r.name);
        const loc = encodeURIComponent(this.userRequest?.location || '');

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
        if (ol.swiggy)   lines.push(`• [🛵 Swiggy](${ol.swiggy})`);
        if (ol.zomato)   lines.push(`• [🍽️ Zomato](${ol.zomato})`);
        if (ol.ubereats) lines.push(`• [🚗 UberEats](${ol.ubereats})`);
        if (ol.website)  lines.push(`• [🌐 Official Website](${ol.website})`);
        lines.push(`• [🗺️ Google Maps](https://www.google.com/maps/search/${enc}+${loc})`);
        if (ol.google)   lines.push(`• [🔍 Google Search](${ol.google})`);

        lines.push('');
        lines.push('### 📊 Why this recommendation?');
        const reasons = this._recommendationReasons(r);
        reasons.forEach(r => lines.push(`• ${r}`));

        lines.push('');
        lines.push('---');
        lines.push('💡 Type **menu** for menu links · **order** for ordering · **back** to return');
        return lines.join('\n');
    }

    _recommendationReasons(r) {
        const reasons = [];
        if (r.website)       reasons.push('Has an official website — well-established place');
        if (r.phone)         reasons.push('Phone number available — easy to call ahead');
        if (r.opening_hours) reasons.push(`Opening hours listed: ${r.opening_hours}`);
        if (r.address && r.address.split(',').length > 2) reasons.push('Detailed address on record');
        if (r.cuisine && r.cuisine !== 'Various') reasons.push(`Specialises in ${r.cuisine}`);
        if (!reasons.length) reasons.push('Listed on OpenStreetMap community database');
        return reasons;
    }

    // ── Menu ───────────────────────────────────────────────────────────────────
    showMenu() {
        if (!this.selectedRestaurant) {
            return (
                '❌ No restaurant selected.\n\n' +
                'Search for restaurants and pick one by number.\n' +
                'Example: "restaurants in Rome" → then type **1**'
            );
        }
        const r = this.selectedRestaurant;
        const ol = r.order_links || {};
        const enc = encodeURIComponent(r.name);

        const lines = [];
        lines.push(`### 📋 Menu — ${r.name}\n`);
        lines.push('View the live menu on these platforms:\n');
        if (ol.zomato)  lines.push(`• [🍽️ Zomato Menu](${ol.zomato})`);
        if (ol.swiggy)  lines.push(`• [🛵 Swiggy Menu](${ol.swiggy})`);
        if (ol.website) lines.push(`• [🌐 Official Website](${ol.website})`);
        lines.push(`• [🔍 Google — "${r.name}" menu](https://www.google.com/search?q=${enc}+menu)`);
        lines.push(`• [🗺️ Google Maps listing](https://www.google.com/maps/search/${enc})`);
        lines.push('');
        lines.push('_Tip: Click any link above to browse the full menu and order directly._');
        return lines.join('\n');
    }

    // ── Recommendations ────────────────────────────────────────────────────────
    getRecommendations() {
        if (!this.currentRestaurants.length) {
            return '❌ Search for restaurants first, e.g. "best Italian in Rome".';
        }
        const top5 = this.currentRestaurants.slice(0, 5);
        const lines = [];
        lines.push(`### 🎯 Smart Recommendations — ${this.userRequest?.location || 'your area'}\n`);

        const cats = this._groupByCuisine(this.currentRestaurants);
        const topCats = Object.entries(cats).sort((a, b) => b[1] - a[1]).slice(0, 6);
        lines.push('**Available cuisine categories:**');
        topCats.forEach(([c, n]) => lines.push(`• ${c} — ${n} restaurant${n > 1 ? 's' : ''}`));
        lines.push('');

        lines.push('**Top picks based on data quality & relevance:**');
        top5.forEach((r, i) => {
            const ol = r.order_links || {};
            lines.push(`\n**${i + 1}. ${r.name}** — ${r.cuisine || 'Various'}`);
            lines.push(`📍 ${r.address || this.userRequest?.location}`);
            const parts = [];
            if (ol.zomato)  parts.push(`[Zomato](${ol.zomato})`);
            if (ol.swiggy)  parts.push(`[Swiggy](${ol.swiggy})`);
            if (ol.google)  parts.push(`[Google](${ol.google})`);
            if (parts.length) lines.push(`🛒 ${parts.join(' · ')}`);
        });

        lines.push('');
        lines.push('💡 Type a **number** (1-5) to see full details and ordering links.');
        return lines.join('\n');
    }

    // ── Budget helper ──────────────────────────────────────────────────────────
    getBudgetOptimizedOrder() {
        if (!this.selectedRestaurant) {
            return '❌ Select a restaurant first by typing its number.';
        }
        const r = this.selectedRestaurant;
        const ol = r.order_links || {};
        const lines = [];
        lines.push(`### 💰 Order from ${r.name}\n`);
        if (this.userRequest?.budget)
            lines.push(`Budget filter: ₹${this.userRequest.budget} · Check menus below for items within range:\n`);
        if (ol.zomato)   lines.push(`• [🍽️ Zomato](${ol.zomato})`);
        if (ol.swiggy)   lines.push(`• [🛵 Swiggy](${ol.swiggy})`);
        if (ol.ubereats) lines.push(`• [🚗 UberEats](${ol.ubereats})`);
        if (ol.google)   lines.push(`• [🔍 Google](${ol.google})`);
        return lines.join('\n');
    }

    // ── Order ──────────────────────────────────────────────────────────────────
    startOrder() {
        if (!this.selectedRestaurant) return '❌ Select a restaurant first.';
        return this.selectRestaurant(this.currentRestaurants.indexOf(this.selectedRestaurant));
    }

    // ── Navigation ─────────────────────────────────────────────────────────────
    goBack() {
        this.selectedRestaurant = null;
        return this.currentRestaurants.length
            ? this.showMoreRestaurants()
            : '❌ No search results yet. Try searching for restaurants.';
    }

    showMoreRestaurants() {
        if (!this.currentRestaurants.length)
            return '❌ No restaurants loaded. Please search first.';
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
