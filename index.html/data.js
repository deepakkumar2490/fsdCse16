// Database of popular destinations, travel hubs, transit tips, and attractions
window.TRAVEL_CITIES = [
  {
    id: "paris",
    name: "Paris",
    country: "France",
    region: "Europe",
    lat: 48.8566,
    lng: 2.3522,
    airports: ["CDG (Charles de Gaulle)", "ORY (Orly)"],
    trainHubs: ["Gare du Nord", "Gare de Lyon", "Gare Montparnasse"],
    currency: "EUR (€)",
    avgDailyCost: "€95 - €160",
    weather: { temp: "18°C", condition: "Partly Cloudy", icon: "cloud-sun" },
    localTransitTip: "Use the Paris Métro and RER with the Navigo Easy pass or contactless card.",
    attractions: [
      { name: "Eiffel Tower", type: "Landmark", rating: "4.8" },
      { name: "Louvre Museum", type: "Museum", rating: "4.9" },
      { name: "Montmartre & Sacré-Cœur", type: "Historic District", rating: "4.7" }
    ]
  },
  {
    id: "london",
    name: "London",
    country: "United Kingdom",
    region: "Europe",
    lat: 51.5074,
    lng: -0.1278,
    airports: ["LHR (Heathrow)", "LGW (Gatwick)", "STN (Stansted)", "LTN (Luton)"],
    trainHubs: ["St Pancras International (Eurostar)", "King's Cross", "Euston", "Paddington"],
    currency: "GBP (£)",
    avgDailyCost: "£85 - £150",
    weather: { temp: "16°C", condition: "Breezy & Mild", icon: "wind" },
    localTransitTip: "Tap your contactless credit card or Oyster card across London Underground and red double-decker buses.",
    attractions: [
      { name: "Tower Bridge & Tower of London", type: "Historic", rating: "4.8" },
      { name: "British Museum", type: "Culture", rating: "4.9" },
      { name: "Westminster Abbey & Big Ben", type: "Architecture", rating: "4.8" }
    ]
  },
  {
    id: "amsterdam",
    name: "Amsterdam",
    country: "Netherlands",
    region: "Europe",
    lat: 52.3676,
    lng: 4.9041,
    airports: ["AMS (Schiphol)"],
    trainHubs: ["Amsterdam Centraal"],
    currency: "EUR (€)",
    avgDailyCost: "€80 - €140",
    weather: { temp: "15°C", condition: "Pleasant", icon: "sun" },
    localTransitTip: "Rent an OV-fiets or classic bicycle, or tap in/out on GVB Trams with contactless.",
    attractions: [
      { name: "Rijksmuseum & Van Gogh Museum", type: "Art", rating: "4.9" },
      { name: "Canal Ring Cruise", type: "Scenic", rating: "4.8" },
      { name: "Anne Frank House", type: "History", rating: "4.8" }
    ]
  },
  {
    id: "rome",
    name: "Rome",
    country: "Italy",
    region: "Europe",
    lat: 41.9028,
    lng: 12.4964,
    airports: ["FCO (Fiumicino)", "CIA (Ciampino)"],
    trainHubs: ["Roma Termini", "Roma Tiburtina"],
    currency: "EUR (€)",
    avgDailyCost: "€75 - €130",
    weather: { temp: "22°C", condition: "Sunny & Warm", icon: "sun" },
    localTransitTip: "High-speed Frecciarossa trains connect straight to Florence (1.5h) and Milan (3h). Use ATAC metro for city hops.",
    attractions: [
      { name: "Colosseum & Roman Forum", type: "Ancient Wonder", rating: "4.9" },
      { name: "Vatican Museums & St. Peter's", type: "Historic", rating: "4.9" },
      { name: "Trevi Fountain", type: "Monument", rating: "4.7" }
    ]
  },
  {
    id: "florence",
    name: "Florence",
    country: "Italy",
    region: "Europe",
    lat: 43.7696,
    lng: 11.2558,
    airports: ["FLR (Amerigo Vespucci)"],
    trainHubs: ["Firenze Santa Maria Novella (SMN)"],
    currency: "EUR (€)",
    avgDailyCost: "€70 - €125",
    weather: { temp: "21°C", condition: "Sunny", icon: "sun" },
    localTransitTip: "Florence is wonderfully walkable. SMN train station is just 8 minutes on foot to the Duomo.",
    attractions: [
      { name: "Duomo (Santa Maria del Fiore)", type: "Cathedral", rating: "4.9" },
      { name: "Uffizi Gallery", type: "Art Gallery", rating: "4.9" },
      { name: "Ponte Vecchio", type: "Scenic Bridge", rating: "4.7" }
    ]
  },
  {
    id: "barcelona",
    name: "Barcelona",
    country: "Spain",
    region: "Europe",
    lat: 41.3879,
    lng: 2.1699,
    airports: ["BCN (El Prat)"],
    trainHubs: ["Barcelona Sants", "Passeig de Gràcia"],
    currency: "EUR (€)",
    avgDailyCost: "€75 - €135",
    weather: { temp: "23°C", condition: "Sunny Coast", icon: "sun" },
    localTransitTip: "The Aerobús connects El Prat to Plaça Catalunya in 30 mins. Buy T-Casual 10-ride metro ticket.",
    attractions: [
      { name: "Sagrada Família", type: "Architecture", rating: "4.9" },
      { name: "Park Güell", type: "Scenic Park", rating: "4.8" },
      { name: "Gothic Quarter & Barceloneta", type: "Beach & Historic", rating: "4.7" }
    ]
  },
  {
    id: "tokyo",
    name: "Tokyo",
    country: "Japan",
    region: "Asia",
    lat: 35.6762,
    lng: 139.6503,
    airports: ["HND (Haneda - closer)", "NRT (Narita)"],
    trainHubs: ["Tokyo Station", "Shinjuku Station", "Shinagawa"],
    currency: "JPY (¥)",
    avgDailyCost: "¥9,000 - ¥16,000",
    weather: { temp: "19°C", condition: "Clear Sky", icon: "sun" },
    localTransitTip: "Add a digital Suica or Pasmo card to your smartphone wallet for effortless trains, subways, and convenience store pays.",
    attractions: [
      { name: "Senso-ji & Asakusa", type: "Historic Temple", rating: "4.8" },
      { name: "Shibuya Crossing & Harajuku", type: "Urban Buzz", rating: "4.8" },
      { name: "Shinjuku Gyoen National Garden", type: "Nature", rating: "4.9" }
    ]
  },
  {
    id: "kyoto",
    name: "Kyoto",
    country: "Japan",
    region: "Asia",
    lat: 35.0116,
    lng: 135.7681,
    airports: ["KIX (Kansai International - 75m train)"],
    trainHubs: ["Kyoto Station (Tokaido Shinkansen)"],
    currency: "JPY (¥)",
    avgDailyCost: "¥8,000 - ¥14,000",
    weather: { temp: "18°C", condition: "Mild", icon: "cloud-sun" },
    localTransitTip: "Tokaido Shinkansen bullet train connects Tokyo to Kyoto in just 2h 15m! Within Kyoto, use subway + city bus pass.",
    attractions: [
      { name: "Fushimi Inari Shrine (Torii gates)", type: "Iconic Shrine", rating: "4.9" },
      { name: "Kinkaku-ji (Golden Pavilion)", type: "Zen Temple", rating: "4.8" },
      { name: "Arashiyama Bamboo Grove", type: "Nature Walk", rating: "4.7" }
    ]
  },
  {
    id: "new-york",
    name: "New York City",
    country: "United States",
    region: "North America",
    lat: 40.7128,
    lng: -74.0060,
    airports: ["JFK (Kennedy)", "LGA (LaGuardia)", "EWR (Newark)"],
    trainHubs: ["Penn Station (Moynihan Train Hall)", "Grand Central Terminal"],
    currency: "USD ($)",
    avgDailyCost: "$120 - $240",
    weather: { temp: "17°C", condition: "Partly Cloudy", icon: "cloud-sun" },
    localTransitTip: "Use OMNY (tap your credit card / phone) to ride any subway or bus. Acela trains connect to Boston and Washington DC with ease.",
    attractions: [
      { name: "Central Park & The High Line", type: "Park", rating: "4.9" },
      { name: "Statue of Liberty & Ferry", type: "Monument", rating: "4.8" },
      { name: "Broadway & Times Square", type: "Entertainment", rating: "4.7" }
    ]
  },
  {
    id: "boston",
    name: "Boston",
    country: "United States",
    region: "North America",
    lat: 42.3601,
    lng: -71.0589,
    airports: ["BOS (Logan International)"],
    trainHubs: ["Boston South Station", "North Station"],
    currency: "USD ($)",
    avgDailyCost: "$95 - $190",
    weather: { temp: "15°C", condition: "Crisp & Clear", icon: "wind" },
    localTransitTip: "Amtrak Acela train connects NYC to Boston in under 4 hours, skipping airport TSA lines. Use the MBTA 'T' subway for town transit.",
    attractions: [
      { name: "The Freedom Trail", type: "Historic Walk", rating: "4.8" },
      { name: "Boston Public Garden & Common", type: "Park", rating: "4.8" },
      { name: "Harvard Square & Museum", type: "University", rating: "4.7" }
    ]
  },
  {
    id: "mumbai",
    name: "Mumbai",
    country: "India",
    region: "Asia",
    lat: 19.0760,
    lng: 72.8777,
    airports: ["BOM (Chhatrapati Shivaji Maharaj T2/T1)"],
    trainHubs: ["CSMT (Chhatrapati Shivaji Terminus)", "Mumbai Central", "Bandra Terminus"],
    currency: "INR (₹)",
    avgDailyCost: "₹2,000 - ₹5,000",
    weather: { temp: "30°C", condition: "Warm & Coastal", icon: "sun" },
    localTransitTip: "Use Mumbai Metro Line 3 and Line 2A/7 for fast transit, or black & yellow cabs / Ola / Uber. Vande Bharat Express runs to Goa and Ahmedabad.",
    attractions: [
      { name: "Gateway of India & Marine Drive", type: "Iconic Coast", rating: "4.8" },
      { name: "Chhatrapati Shivaji Terminus (UNESCO)", type: "Heritage Architecture", rating: "4.8" },
      { name: "Bandra Fort & Bandstand", type: "Sunset Spot", rating: "4.7" }
    ]
  },
  {
    id: "goa",
    name: "Goa",
    country: "India",
    region: "Asia",
    lat: 15.2993,
    lng: 74.1240,
    airports: ["GOI (Dabolim)", "GOX (Mopa - Manohar International)"],
    trainHubs: ["Madgaon (MAO)", "Thivim (THVM)"],
    currency: "INR (₹)",
    avgDailyCost: "₹2,200 - ₹5,500",
    weather: { temp: "29°C", condition: "Tropical Breeze", icon: "sun" },
    localTransitTip: "Vande Bharat / Tejas Express from Mumbai to Madgaon offers gorgeous Western Ghats views (7.5h). Rent a scooter or GoaMiles cab locally.",
    attractions: [
      { name: "Palolem & Agonda Beaches", type: "South Goa Beaches", rating: "4.9" },
      { name: "Old Goa Churches & Basilica", type: "UNESCO Heritage", rating: "4.8" },
      { name: "Dudhsagar Waterfalls", type: "Nature Adventure", rating: "4.7" }
    ]
  },
  {
    id: "delhi",
    name: "New Delhi",
    country: "India",
    region: "Asia",
    lat: 28.6139,
    lng: 77.2090,
    airports: ["DEL (Indira Gandhi International T3/T1)"],
    trainHubs: ["New Delhi Railway Station (NDLS)", "Hazrat Nizamuddin", "Old Delhi"],
    currency: "INR (₹)",
    avgDailyCost: "₹1,800 - ₹4,500",
    weather: { temp: "26°C", condition: "Pleasant", icon: "sun" },
    localTransitTip: "The Delhi Metro Airport Express takes 20 mins to central Delhi. Vande Bharat Express reaches Agra/Jaipur quickly.",
    attractions: [
      { name: "India Gate & Kartavya Path", type: "Monument", rating: "4.8" },
      { name: "Qutub Minar & Red Fort", type: "UNESCO Heritage", rating: "4.8" },
      { name: "Humayun's Tomb", type: "Mughal Architecture", rating: "4.9" }
    ]
  },
  {
    id: "agra",
    name: "Agra",
    country: "India",
    region: "Asia",
    lat: 27.1767,
    lng: 78.0081,
    airports: ["AGR (Kheria)"],
    trainHubs: ["Agra Cantt (Gatimaan Express Hub)"],
    currency: "INR (₹)",
    avgDailyCost: "₹1,600 - ₹3,800",
    weather: { temp: "27°C", condition: "Sunny", icon: "sun" },
    localTransitTip: "The Gatimaan Express and Vande Bharat connect Delhi to Agra in just 1 hour 40 minutes! Yamuna Expressway is 3.5h drive.",
    attractions: [
      { name: "Taj Mahal (Wonder of the World)", type: "World Wonder", rating: "5.0" },
      { name: "Agra Fort", type: "Mughal Fort", rating: "4.8" },
      { name: "Mehtab Bagh Sunset View", type: "Viewpoint", rating: "4.7" }
    ]
  },
  {
    id: "dubai",
    name: "Dubai",
    country: "United Arab Emirates",
    region: "Middle East",
    lat: 25.2048,
    lng: 55.2708,
    airports: ["DXB (Dubai International)", "DWC (Al Maktoum)"],
    trainHubs: ["Dubai Metro Red & Green Lines"],
    currency: "AED (د.إ)",
    avgDailyCost: "AED 300 - AED 650",
    weather: { temp: "28°C", condition: "Warm & Sunny", icon: "sun" },
    localTransitTip: "Get a silver Nol Card to ride the fully-automated driverless Dubai Metro directly from DXB terminals into Downtown.",
    attractions: [
      { name: "Burj Khalifa & Dubai Mall Fountains", type: "Super Skyscraper", rating: "4.9" },
      { name: "Palm Jumeirah & Marina Walk", type: "Luxury Waterfront", rating: "4.8" },
      { name: "Dubai Desert Safari & Dunes", type: "Adventure", rating: "4.9" }
    ]
  },
  {
    id: "singapore",
    name: "Singapore",
    country: "Singapore",
    region: "Asia",
    lat: 1.3521,
    lng: 103.8198,
    airports: ["SIN (Changi Airport - Jewel)"],
    trainHubs: ["Woodlands Train Checkpoint", "Marina Bay MRT"],
    currency: "SGD (S$)",
    avgDailyCost: "S$90 - S$180",
    weather: { temp: "29°C", condition: "Tropical Warmth", icon: "sun" },
    localTransitTip: "Tap any Visa/Mastercard on the MRT system. Direct MRT connection from Changi Terminal 2 & 3 right into downtown.",
    attractions: [
      { name: "Gardens by the Bay & Supertree Grove", type: "Futuristic Flora", rating: "4.9" },
      { name: "Marina Bay Sands SkyPark", type: "Panorama", rating: "4.8" },
      { name: "Changi Jewel Rain Vortex", type: "Airport Marvel", rating: "4.9" }
    ]
  },
  {
    id: "berlin",
    name: "Berlin",
    country: "Germany",
    region: "Europe",
    lat: 52.5200,
    lng: 13.4050,
    airports: ["BER (Berlin Brandenburg)"],
    trainHubs: ["Berlin Hauptbahnhof"],
    currency: "EUR (€)",
    avgDailyCost: "€65 - €120",
    weather: { temp: "16°C", condition: "Mild Autumn", icon: "cloud-sun" },
    localTransitTip: "Direct FEX Airport Express train reaches Berlin Hauptbahnhof in 30 mins. S-Bahn and U-Bahn are super reliable.",
    attractions: [
      { name: "Brandenburg Gate & Reichstag", type: "Monument", rating: "4.8" },
      { name: "Museum Island", type: "UNESCO Heritage", rating: "4.9" },
      { name: "East Side Gallery (Berlin Wall)", type: "Historic Art", rating: "4.7" }
    ]
  },
  {
    id: "sydney",
    name: "Sydney",
    country: "Australia",
    region: "Oceania",
    lat: -33.8688,
    lng: 151.2093,
    airports: ["SYD (Kingsford Smith)"],
    trainHubs: ["Sydney Central Station"],
    currency: "AUD (A$)",
    avgDailyCost: "A$110 - A$210",
    weather: { temp: "21°C", condition: "Sunny & Harbor Breeze", icon: "sun" },
    localTransitTip: "Tap on/off with an Opal card or contactless payment. Take the iconic Manly Ferry for the best harbor views on a public transit budget.",
    attractions: [
      { name: "Sydney Opera House & Harbor Bridge", type: "Global Icon", rating: "4.9" },
      { name: "Bondi to Coogee Coastal Walk", type: "Scenic Trail", rating: "4.9" },
      { name: "Taronga Zoo & Ferry", type: "Wildlife & Views", rating: "4.8" }
    ]
  },
  {
    id: "san-francisco",
    name: "San Francisco",
    country: "United States",
    region: "North America",
    lat: 37.7749,
    lng: -122.4194,
    airports: ["SFO (San Francisco International)", "OAK (Oakland)"],
    trainHubs: ["Salesforce Transit Center", "4th & King Caltrain"],
    currency: "USD ($)",
    avgDailyCost: "$115 - $220",
    weather: { temp: "16°C", condition: "Coastal Fog & Sun", icon: "cloud-sun" },
    localTransitTip: "BART train connects SFO directly to downtown Market St in 30 mins. Use Clipper card for cable cars and Muni buses.",
    attractions: [
      { name: "Golden Gate Bridge & Vista Point", type: "Iconic Bridge", rating: "4.9" },
      { name: "Fisherman's Wharf & Alcatraz", type: "Historic Island", rating: "4.8" },
      { name: "Cable Cars & Lombard Street", type: "Scenic Street", rating: "4.7" }
    ]
  },
  {
    id: "zurich",
    name: "Zurich",
    country: "Switzerland",
    region: "Europe",
    lat: 47.3769,
    lng: 8.5417,
    airports: ["ZRH (Zurich Airport)"],
    trainHubs: ["Zürich Hauptbahnhof (HB)"],
    currency: "CHF (Fr.)",
    avgDailyCost: "CHF 120 - CHF 240",
    weather: { temp: "14°C", condition: "Fresh Alpine", icon: "cloud-sun" },
    localTransitTip: "SBB Swiss trains are world-renowned for precision. S-Bahn train from Zurich Airport to Zurich HB takes just 10 mins!",
    attractions: [
      { name: "Lake Zurich Promenade", type: "Scenic Water", rating: "4.8" },
      { name: "Old Town (Altstadt) & Lindenhof", type: "Historic Views", rating: "4.8" },
      { name: "Uetliberg Mountain Train", type: "Mountain Vista", rating: "4.7" }
    ]
  }
];

// Curated popular routes with pre-tuned high accuracy travel advice
window.FEATURED_ROUTES = [
  { from: "Paris", to: "Amsterdam", desc: "Eurostar high-speed rail direct in 3h 20m!" },
  { from: "London", to: "Paris", desc: "Eurostar city-center to city-center in 2h 18m." },
  { from: "Tokyo", to: "Kyoto", desc: "Tokaido Shinkansen bullet train in 2h 15m." },
  { from: "New York City", to: "Boston", desc: "Amtrak Acela vs scenic route comparison." },
  { from: "Mumbai", to: "Goa", desc: "Vande Bharat Express scenic Ghats vs 1h flight." },
  { from: "Rome", to: "Florence", desc: "Frecciarossa 300km/h high speed train in 1h 36m." },
  { from: "New Delhi", to: "Agra", desc: "Gatimaan / Vande Bharat Express to the Taj Mahal in 1h 40m." }
];
