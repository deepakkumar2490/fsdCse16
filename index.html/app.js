/**
 * EasyVoyage - Smart Point-to-Point Travel Planner & Route Suggestion Engine
 */

// Application State
const state = {
  origin: null,
  destination: null,
  travelDate: new Date().toISOString().split('T')[0],
  travelers: 1,
  activeFilter: 'easiest', // 'easiest', 'fastest', 'cheapest', 'eco', 'all'
  map: null,
  mapLayers: [],
  packingList: [
    { id: 1, text: "Valid Passport / ID & Visas (digital + paper copies)", done: false, category: "docs" },
    { id: 2, text: "Universal power adapter & charging cables", done: false, category: "tech" },
    { id: 3, text: "10,000mAh Power Bank (carried in cabin bag)", done: false, category: "tech" },
    { id: 4, text: "Comfortable walking shoes & weather-appropriate jacket", done: false, category: "clothes" },
    { id: 5, text: "Personal medicines & mini first-aid kit", done: false, category: "health" },
    { id: 6, text: "Noise-cancelling earbuds or travel eye mask", done: false, category: "comfort" },
    { id: 7, text: "Zero-forex fee credit card or local transit card", done: false, category: "finance" }
  ]
};

// --- Math & Distance Helpers ---
function toRad(degrees) {
  return degrees * (Math.PI / 180);
}

function calculateHaversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

function formatDuration(minutes) {
  const hrs = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);
  if (hrs === 0) return `${mins}m`;
  if (mins === 0) return `${hrs}h`;
  return `${hrs}h ${mins}m`;
}

// Fallback resolver for arbitrary city names not in the local curated list
function resolveCity(query) {
  if (!query) return null;
  const clean = query.trim().toLowerCase();
  
  // Try exact or substring match in curated list
  const found = window.TRAVEL_CITIES.find(c => 
    c.name.toLowerCase() === clean || 
    c.id.toLowerCase() === clean ||
    c.name.toLowerCase().includes(clean) ||
    c.country.toLowerCase().includes(clean)
  );

  if (found) return found;

  // Generic fallback if user enters custom city
  return {
    id: clean.replace(/\s+/g, '-'),
    name: query.trim().charAt(0).toUpperCase() + query.trim().slice(1),
    country: "Destination",
    region: "Global",
    lat: 30.0 + (Math.sin(clean.length) * 20),
    lng: 10.0 + (Math.cos(clean.length) * 50),
    airports: [`${query.trim().slice(0, 3).toUpperCase()} International`],
    trainHubs: [`${query.trim()} Central`],
    currency: "USD ($)",
    avgDailyCost: "$60 - $140",
    weather: { temp: "21°C", condition: "Pleasant", icon: "sun" },
    localTransitTip: "Check local metro cards or rideshare apps like Uber / Bolt.",
    attractions: [
      { name: `${query.trim()} Historic Old Town`, type: "Sightseeing", rating: "4.7" },
      { name: `${query.trim()} Main Plaza & Gardens`, type: "Walking Tour", rating: "4.8" },
      { name: `Cultural Heritage Museum`, type: "Museum", rating: "4.6" }
    ]
  };
}

// --- Travel Route Generator Engine ---
function generateRouteSuggestions(origin, destination) {
  const distanceKm = calculateHaversineDistance(origin.lat, origin.lng, destination.lat, destination.lng);
  const distanceMiles = Math.round(distanceKm * 0.621371);

  // Flight calculations
  // Cruising ~800 km/h + 40 mins takeoff/approach
  const rawFlightMinutes = Math.max(45, (distanceKm / 780) * 60 + 35);
  // Airport buffers: 2h checkin/security + 45m baggage/deplane + 1h downtown to/from airport
  const flightDoorToDoorMinutes = rawFlightMinutes + 180;
  const flightPrice = Math.round(45 + Math.sqrt(distanceKm) * 4.2 * state.travelers);
  const flightCo2 = Math.round(distanceKm * 0.18); // ~180g CO2/km per passenger

  // Train calculations (High speed ~220km/h or express ~120km/h)
  const isHighSpeedCorridor = (origin.region === 'Europe' || origin.country === 'Japan' || origin.country === 'India');
  const trainSpeed = isHighSpeedCorridor ? 180 : 120;
  const trainTrackDistance = Math.round(distanceKm * 1.18);
  const rawTrainMinutes = (trainTrackDistance / trainSpeed) * 60;
  // Train buffer: 25 mins station arrival + 10 mins exit (directly downtown!)
  const trainDoorToDoorMinutes = rawTrainMinutes + 35;
  const trainPrice = Math.round(25 + (trainTrackDistance * 0.085) * state.travelers);
  const trainCo2 = Math.round(distanceKm * 0.035); // ~35g CO2/km (80% cleaner!)

  // Drive / Cab calculations
  const roadDistance = Math.round(distanceKm * 1.25);
  const drivingSpeed = 82; // km/h with regular traffic
  const driveMinutes = (roadDistance / drivingSpeed) * 60 + (Math.floor(roadDistance / 250) * 25); // Rest stops
  const fuelCost = Math.round((roadDistance / 100) * 7.5 * 1.6); // 7.5L/100km @ $1.60/L
  const tollsCost = Math.round(roadDistance * 0.035);
  const totalDriveCost = fuelCost + tollsCost;
  const driveCo2 = Math.round(distanceKm * 0.12);

  // Bus / Coach calculations
  const busSpeed = 68;
  const busMinutes = (roadDistance / busSpeed) * 60 + (Math.floor(roadDistance / 200) * 30);
  const busPrice = Math.round(15 + (roadDistance * 0.045) * state.travelers);
  const busCo2 = Math.round(distanceKm * 0.048);

  // Determine "Easiest Way" verdict
  let easiestMode = "train";
  let easiestReasonTitle = "";
  let easiestPoints = [];

  if (distanceKm < 750 && (isHighSpeedCorridor || distanceKm <= 500)) {
    easiestMode = "train";
    easiestReasonTitle = "Express Train is the undisputed Easiest & Most Relaxing Choice";
    easiestPoints = [
      "🏙️ Downtown-to-Downtown: Depart from central station and arrive directly in the heart of the city, avoiding $60+ airport cab fares.",
      "⏱️ Zero Airport Stress: Arrive at the station just 20-30 minutes before departure without 2-hour TSA or baggage check queues.",
      "🧳 Luggage Freedom: Generous allowance with no strict 100ml liquid limits or baggage weight fee traps.",
      "💻 Work & Unwind: Spacious seats with standard power sockets, onboard Wi-Fi, and continuous mobile coverage."
    ];
  } else if (distanceKm < 220) {
    easiestMode = "drive";
    easiestReasonTitle = "Direct Drive or Private Cab is the Most Flexible & Direct Way";
    easiestPoints = [
      "🚪 True Door-to-Door: Leave from your exact doorstep directly to your destination hotel without any transfer hassles.",
      "⏰ Total Schedule Freedom: Depart whenever you want, stop for coffee or scenic viewpoints on your own terms.",
      "👥 Group Economy: When sharing with travel companions or family, car travel gives the best cost-per-person value."
    ];
  } else {
    easiestMode = "flight";
    easiestReasonTitle = "Direct / Express Flight is the Fastest & Most Sensible Way for this distance";
    easiestPoints = [
      "⚡ Unmatched Speed: At over " + distanceKm + " km, flying cuts overland journey time by more than half.",
      "🛫 Frequent Connections: Multiple daily departures with seamless booking options across major carriers.",
      "💡 Pro Tip: Book airport express rail (like Heathrow Express or Tokyo Monorail) to bypass highway gridlock."
    ];
  }

  return {
    distanceKm,
    distanceMiles,
    origin,
    destination,
    easiestMode,
    easiestReasonTitle,
    easiestPoints,
    options: [
      {
        id: "train",
        name: "Express / High-Speed Rail",
        icon: "train",
        tag: "Most Relaxing & Scenic",
        isEasiest: easiestMode === "train",
        transitDuration: formatDuration(rawTrainMinutes),
        doorToDoorDuration: formatDuration(trainDoorToDoorMinutes),
        doorToDoorMinutes: trainDoorToDoorMinutes,
        priceEst: `$${trainPrice}`,
        priceNum: trainPrice,
        co2: `${trainCo2} kg CO₂`,
        co2Num: trainCo2,
        comfortRating: "9.6 / 10",
        highlights: [
          `Board at ${origin.trainHubs ? origin.trainHubs[0] : 'Central Station'}`,
          `Arrive directly at ${destination.trainHubs ? destination.trainHubs[0] : 'Central Station'}`,
          "Spacious legroom & generous luggage rules",
          "Bypass airport security & tarmac delays"
        ],
        bookingTip: "Book 3-6 weeks in advance for up to 60% early-bird discount on rail operators."
      },
      {
        id: "flight",
        name: "Flight + Express Transfer",
        icon: "plane",
        tag: "Fastest In-Air Time",
        isEasiest: easiestMode === "flight",
        transitDuration: formatDuration(rawFlightMinutes),
        doorToDoorDuration: formatDuration(flightDoorToDoorMinutes),
        doorToDoorMinutes: flightDoorToDoorMinutes,
        priceEst: `$${flightPrice}`,
        priceNum: flightPrice,
        co2: `${flightCo2} kg CO₂`,
        co2Num: flightCo2,
        comfortRating: "8.2 / 10",
        highlights: [
          `Departs from ${origin.airports ? origin.airports[0] : 'Main Airport'}`,
          `Lands at ${destination.airports ? destination.airports[0] : 'Main Airport'}`,
          "Quickest for journeys over 700+ km",
          "Includes cabin carry-on and overhead bin"
        ],
        bookingTip: "Use incognito mode, set alerts on Google Flights, and account for 2 hours airport buffer time."
      },
      {
        id: "drive",
        name: "Self-Drive / Private Cab",
        icon: "car",
        tag: "Maximum Flexibility",
        isEasiest: easiestMode === "drive",
        transitDuration: formatDuration(driveMinutes),
        doorToDoorDuration: formatDuration(driveMinutes),
        doorToDoorMinutes: driveMinutes,
        priceEst: `$${totalDriveCost}`,
        priceNum: totalDriveCost,
        co2: `${driveCo2} kg CO₂`,
        co2Num: driveCo2,
        comfortRating: "8.7 / 10",
        highlights: [
          `Approx ${roadDistance} km via major highway corridors`,
          `Estimated fuel ~$${fuelCost} + tolls ~$${tollsCost}`,
          "Pack as many suitcases as your trunk holds",
          "Stop at scenic countryside viewpoints on demand"
        ],
        bookingTip: "Download offline Google Maps / Waze and double check automated toll transponders."
      },
      {
        id: "bus",
        name: "Intercity Express Coach",
        icon: "bus",
        tag: "Best Budget Value",
        isEasiest: false,
        transitDuration: formatDuration(busMinutes),
        doorToDoorDuration: formatDuration(busMinutes + 40),
        doorToDoorMinutes: busMinutes + 40,
        priceEst: `$${busPrice}`,
        priceNum: busPrice,
        co2: `${busCo2} kg CO₂`,
        co2Num: busCo2,
        comfortRating: "7.1 / 10",
        highlights: [
          "Lowest price per seat for solo travelers",
          "Overnight sleeper coaches save a hotel night",
          "Standard AC & power sockets included",
          "City terminal to central bus terminal"
        ],
        bookingTip: "Choose upper-deck or front single seats for better forward visibility and smoother ride."
      }
    ]
  };
}

// --- Map Drawing Logic (Leaflet) ---
function initOrUpdateMap(origin, destination, distanceKm) {
  const mapContainer = document.getElementById('travel-map');
  if (!mapContainer) return;

  if (!state.map) {
    state.map = L.map('travel-map', {
      zoomControl: true,
      scrollWheelZoom: false
    }).setView([20, 0], 2);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://carto.com/">CARTO</a>, &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 18
    }).addTo(state.map);
  }

  // Clear existing markers & polylines
  state.mapLayers.forEach(layer => state.map.removeLayer(layer));
  state.mapLayers = [];

  const originLatLng = [origin.lat, origin.lng];
  const destLatLng = [destination.lat, destination.lng];

  // Custom icon creator
  const createMarkerIcon = (color, text, iconName) => L.divIcon({
    className: 'custom-map-pin',
    html: `
      <div style="display:flex; align-items:center; background:${color}; color:#fff; padding:6px 12px; border-radius:20px; font-weight:700; font-size:12px; box-shadow:0 4px 15px rgba(0,0,0,0.25); white-space:nowrap; border:2px solid #ffffff;">
        <span style="margin-right:6px;">●</span> ${text}
      </div>
    `,
    iconSize: [120, 32],
    iconAnchor: [60, 16]
  });

  const originMarker = L.marker(originLatLng, { icon: createMarkerIcon('#3b82f6', origin.name) })
    .bindPopup(`<b>Origin: ${origin.name}</b><br>${origin.country}`)
    .addTo(state.map);

  const destMarker = L.marker(destLatLng, { icon: createMarkerIcon('#10b981', destination.name) })
    .bindPopup(`<b>Destination: ${destination.name}</b><br>${destination.country}`)
    .addTo(state.map);

  state.mapLayers.push(originMarker, destMarker);

  // Draw great-circle / bezier curve route line
  // Calculate intermediate midpoint with slight curve for visual flair
  const midLat = (origin.lat + destination.lat) / 2 + (destination.lng - origin.lng) * 0.05;
  const midLng = (origin.lng + destination.lng) / 2 - (destination.lat - origin.lat) * 0.05;
  
  const curvePoints = [
    originLatLng,
    [midLat, midLng],
    destLatLng
  ];

  const routePolyline = L.polyline(curvePoints, {
    color: '#6366f1',
    weight: 4,
    opacity: 0.85,
    dashArray: '8, 8',
    lineCap: 'round'
  }).addTo(state.map);

  state.mapLayers.push(routePolyline);

  // Midpoint distance badge
  const midMarker = L.marker([midLat, midLng], {
    icon: L.divIcon({
      className: 'distance-pill',
      html: `<div style="background:#1e293b; color:#38bdf8; padding:4px 10px; border-radius:12px; font-size:11px; font-weight:bold; border:1px solid #475569; box-shadow:0 2px 8px rgba(0,0,0,0.2); text-align:center;">
        ⚡ ${distanceKm} km
      </div>`,
      iconSize: [90, 24],
      iconAnchor: [45, 12]
    })
  }).addTo(state.map);

  state.mapLayers.push(midMarker);

  // Fit bounds to show both points with comfortable padding
  const bounds = L.latLngBounds([originLatLng, destLatLng]);
  state.map.fitBounds(bounds, { padding: [50, 50], maxZoom: 10 });

  // Invalidate size once container transition is finished
  setTimeout(() => {
    if (state.map) {
      state.map.invalidateSize();
      state.map.fitBounds(bounds, { padding: [50, 50], maxZoom: 10 });
    }
  }, 200);
}

// --- Render Route Results to DOM ---
function renderTripPlan(tripData) {
  const resultsContainer = document.getElementById('results-section');
  if (!resultsContainer) return;
  resultsContainer.classList.remove('hidden');

  // Smooth scroll to results
  resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });

  // Update summary header
  document.getElementById('res-origin-name').textContent = tripData.origin.name;
  document.getElementById('res-origin-country').textContent = tripData.origin.country;
  document.getElementById('res-dest-name').textContent = tripData.destination.name;
  document.getElementById('res-dest-country').textContent = tripData.destination.country;
  document.getElementById('res-distance').textContent = `${tripData.distanceKm} km (${tripData.distanceMiles} miles)`;

  // Render "Easiest Way" Recommendation Hero Card
  const easiestBox = document.getElementById('easiest-verdict-box');
  const easiestOpt = tripData.options.find(o => o.isEasiest) || tripData.options[0];

  easiestBox.innerHTML = `
    <div class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 text-white p-6 sm:p-8 shadow-xl border border-indigo-400/30">
      <div class="absolute -right-8 -top-8 w-44 h-44 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
      
      <div class="flex flex-wrap items-center justify-between gap-4 mb-4">
        <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-400/20 border border-emerald-400/30 text-emerald-300 font-semibold text-xs tracking-wider uppercase">
          <i data-lucide="sparkles" class="w-4 h-4"></i> EasyWay Recommended Choice
        </div>
        <div class="flex items-center gap-3 text-sm">
          <span class="px-3 py-1 rounded-lg bg-white/10 backdrop-blur-sm">Comfort: <strong>${easiestOpt.comfortRating}</strong></span>
          <span class="px-3 py-1 rounded-lg bg-white/10 backdrop-blur-sm">Est. Fare: <strong class="text-emerald-300">${easiestOpt.priceEst}</strong></span>
        </div>
      </div>

      <h3 class="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2 flex items-center gap-3">
        <span>${tripData.easiestReasonTitle}</span>
      </h3>
      
      <p class="text-indigo-100 text-sm sm:text-base max-w-3xl mb-6">
        Based on door-to-door transit time, city center proximity, security buffer times, and luggage ease, this is your smoothest route from <strong>${tripData.origin.name}</strong> to <strong>${tripData.destination.name}</strong>.
      </p>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
        ${tripData.easiestPoints.map(point => `
          <div class="flex items-start gap-2.5 p-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10 text-xs sm:text-sm text-indigo-50 leading-relaxed">
            <span>${point}</span>
          </div>
        `).join('')}
      </div>

      <div class="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-indigo-400/30 text-sm">
        <div class="flex items-center gap-4">
          <div>
            <span class="text-xs text-indigo-200 block">Total Door-to-Door</span>
            <span class="font-bold text-lg text-white">${easiestOpt.doorToDoorDuration}</span>
          </div>
          <div class="h-8 w-px bg-indigo-400/40"></div>
          <div>
            <span class="text-xs text-indigo-200 block">Carbon Footprint</span>
            <span class="font-bold text-lg text-emerald-300">${easiestOpt.co2}</span>
          </div>
        </div>

        <button onclick="openBookingHelper('${easiestOpt.id}', '${tripData.origin.name}', '${tripData.destination.name}')" class="px-5 py-2.5 bg-white text-indigo-900 font-bold rounded-xl shadow-lg hover:bg-indigo-50 active:scale-95 transition-all flex items-center gap-2 text-sm">
          <span>View Booking Guide</span>
          <i data-lucide="arrow-right" class="w-4 h-4"></i>
        </button>
      </div>
    </div>
  `;

  // Render All Route Cards with Filter Support
  renderRouteOptionCards(tripData);

  // Render Door-to-Door Timeline
  renderTimeline(tripData, easiestOpt);

  // Render Destination Insights
  renderDestinationInsights(tripData.destination);

  // Update Map
  initOrUpdateMap(tripData.origin, tripData.destination, tripData.distanceKm);

  // Refresh Lucide Icons
  if (window.lucide) {
    window.lucide.createIcons();
  }
}

// Render Comparison Cards
function renderRouteOptionCards(tripData) {
  const container = document.getElementById('options-grid');
  if (!container) return;

  let sorted = [...tripData.options];
  
  if (state.activeFilter === 'fastest') {
    sorted.sort((a, b) => a.doorToDoorMinutes - b.doorToDoorMinutes);
  } else if (state.activeFilter === 'cheapest') {
    sorted.sort((a, b) => a.priceNum - b.priceNum);
  } else if (state.activeFilter === 'eco') {
    sorted.sort((a, b) => a.co2Num - b.co2Num);
  } else if (state.activeFilter === 'easiest') {
    sorted.sort((a, b) => (b.isEasiest ? 1 : 0) - (a.isEasiest ? 1 : 0));
  }

  container.innerHTML = sorted.map(opt => {
    const isEasiest = opt.isEasiest;
    const badgeBg = isEasiest ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';

    return `
      <div class="relative bg-white dark:bg-slate-800 rounded-2xl border ${isEasiest ? 'border-indigo-500 ring-2 ring-indigo-500/20 shadow-xl' : 'border-slate-200 dark:border-slate-700 shadow-sm'} p-6 transition-all hover:shadow-lg flex flex-col justify-between">
        ${isEasiest ? `
          <div class="absolute -top-3 left-6 px-3 py-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-[11px] font-bold uppercase rounded-full shadow-md flex items-center gap-1.5">
            <i data-lucide="crown" class="w-3.5 h-3.5"></i> Top Recommendation
          </div>
        ` : ''}

        <div>
          <!-- Header -->
          <div class="flex items-start justify-between gap-3 mb-4 ${isEasiest ? 'mt-2' : ''}">
            <div class="flex items-center gap-3">
              <div class="w-11 h-11 rounded-xl flex items-center justify-center ${isEasiest ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400' : 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300'}">
                <i data-lucide="${opt.icon}" class="w-6 h-6"></i>
              </div>
              <div>
                <h4 class="font-bold text-slate-900 dark:text-white text-base">${opt.name}</h4>
                <span class="text-xs font-medium text-slate-500 dark:text-slate-400">${opt.tag}</span>
              </div>
            </div>
            <div class="text-right">
              <span class="text-xl font-extrabold text-slate-900 dark:text-white">${opt.priceEst}</span>
              <span class="block text-[11px] text-slate-400">est. per traveler</span>
            </div>
          </div>

          <!-- Key Metrics -->
          <div class="grid grid-cols-3 gap-2 py-3 px-3.5 bg-slate-50 dark:bg-slate-750/50 rounded-xl mb-4 border border-slate-100 dark:border-slate-700 text-center">
            <div>
              <span class="text-[11px] text-slate-400 block">Total Journey</span>
              <span class="font-bold text-xs text-slate-800 dark:text-slate-200">${opt.doorToDoorDuration}</span>
            </div>
            <div class="border-x border-slate-200 dark:border-slate-700">
              <span class="text-[11px] text-slate-400 block">In-Transit</span>
              <span class="font-bold text-xs text-slate-800 dark:text-slate-200">${opt.transitDuration}</span>
            </div>
            <div>
              <span class="text-[11px] text-slate-400 block">Eco Footprint</span>
              <span class="font-bold text-xs text-emerald-600 dark:text-emerald-400">${opt.co2}</span>
            </div>
          </div>

          <!-- Feature Bullets -->
          <ul class="space-y-2 mb-5">
            ${opt.highlights.map(h => `
              <li class="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                <i data-lucide="check" class="w-3.5 h-3.5 text-emerald-500 shrink-0"></i>
                <span>${h}</span>
              </li>
            `).join('')}
          </ul>
        </div>

        <!-- Card Footer -->
        <div class="pt-4 border-t border-slate-100 dark:border-slate-700">
          <p class="text-[11px] text-slate-500 dark:text-slate-400 italic mb-3">
            💡 ${opt.bookingTip}
          </p>
          <button onclick="openBookingHelper('${opt.id}', '${tripData.origin.name}', '${tripData.destination.name}')" class="w-full py-2.5 rounded-xl font-semibold text-xs transition-colors flex items-center justify-center gap-2 ${isEasiest ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-500/20' : 'bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-800 dark:text-white'}">
            <span>Explore Options & Tips</span>
            <i data-lucide="external-link" class="w-3.5 h-3.5"></i>
          </button>
        </div>
      </div>
    `;
  }).join('');
}

// Render Door-to-Door Timeline
function renderTimeline(tripData, easiestOpt) {
  const container = document.getElementById('timeline-container');
  if (!container) return;

  const mode = easiestOpt.id;
  let steps = [];

  if (mode === 'train') {
    steps = [
      {
        time: "T - 45 min",
        title: `Head to ${tripData.origin.trainHubs ? tripData.origin.trainHubs[0] : 'Central Station'}`,
        desc: "Take local metro or a short cab. With rail travel, you avoid the 2-hour early airport nightmare. Arrive 20-30 mins before boarding.",
        icon: "clock",
        type: "prep"
      },
      {
        time: "Departure",
        title: `Board the Express Train`,
        desc: "Find your carriage on the platform display. Stow large suitcases in the luggage racks near carriage doors, plug in your laptop, and relax.",
        icon: "train",
        type: "transit"
      },
      {
        time: `In Transit (${easiestOpt.transitDuration})`,
        desc: "Enjoy the scenic countryside views, grab a fresh espresso from the bistro car, and enjoy uninterrupted mobile connectivity.",
        title: "Scenic En-Route Experience",
        icon: "coffee",
        type: "transit"
      },
      {
        time: "Arrival",
        title: `Arrive directly at ${tripData.destination.trainHubs ? tripData.destination.trainHubs[0] : 'City Station'}`,
        desc: `Step off straight into downtown ${tripData.destination.name}! Connect immediately to the city subway or walk right to your hotel.`,
        icon: "map-pin",
        type: "arrival"
      }
    ];
  } else if (mode === 'flight') {
    steps = [
      {
        time: "T - 2h 30m",
        title: `Transfer to ${tripData.origin.airports ? tripData.origin.airports[0] : 'Airport'}`,
        desc: "Check-in online 24h prior to grab a mobile boarding pass. Use express airport rail or cab with peak traffic buffer.",
        icon: "clock",
        type: "prep"
      },
      {
        time: "T - 45 min",
        title: "Security & Boarding Gate",
        desc: "Have your digital passport / ID ready. Keep electronic devices and liquids in easily accessible outer pockets.",
        icon: "shield-check",
        type: "prep"
      },
      {
        time: `Flight (${easiestOpt.transitDuration})`,
        title: "Cruising at 34,000 feet",
        desc: "Sit back and enjoy the fastest way to bridge the distance. Keep your noise-cancelling earphones handy.",
        icon: "plane",
        type: "transit"
      },
      {
        time: "Arrival + 35m",
        title: `Land at ${tripData.destination.airports ? tripData.destination.airports[0] : 'Destination Airport'}`,
        desc: `Clear arrivals, grab your bag, and hop onto the direct airport express rail into central ${tripData.destination.name}.`,
        icon: "map-pin",
        type: "arrival"
      }
    ];
  } else {
    // Drive
    steps = [
      {
        time: "Start",
        title: "Check Vehicle & Load Baggage",
        desc: "Inspect tire pressures, load luggage without size restrictions, and set your navigation route on GPS.",
        icon: "check-circle",
        type: "prep"
      },
      {
        time: "Midpoint",
        title: "Scenic Coffee & Fuel Stop",
        desc: "Stretch your legs at highway service areas or detour through quaint towns along the route.",
        icon: "coffee",
        type: "transit"
      },
      {
        time: "Arrival",
        title: `Pull up directly at your ${tripData.destination.name} stay`,
        desc: "Zero luggage transfers or cab waits — you are right at your door with all your belongings.",
        icon: "map-pin",
        type: "arrival"
      }
    ];
  }

  container.innerHTML = steps.map((s, idx) => `
    <div class="relative flex items-start gap-4 pb-8 last:pb-0">
      ${idx !== steps.length - 1 ? '<div class="absolute left-5 top-10 bottom-0 w-0.5 bg-slate-200 dark:bg-slate-700"></div>' : ''}
      <div class="w-10 h-10 rounded-full flex items-center justify-center shrink-0 z-10 ${s.type === 'arrival' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' : s.type === 'transit' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}">
        <i data-lucide="${s.icon}" class="w-5 h-5"></i>
      </div>
      <div class="flex-1 bg-slate-50 dark:bg-slate-750 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
        <div class="flex items-center justify-between gap-2 mb-1">
          <h5 class="font-bold text-slate-900 dark:text-white text-sm">${s.title}</h5>
          <span class="text-xs font-semibold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">${s.time}</span>
        </div>
        <p class="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">${s.desc}</p>
      </div>
    </div>
  `).join('');
}

// Render Destination Insights
function renderDestinationInsights(dest) {
  // Weather
  const weatherEl = document.getElementById('dest-weather');
  if (weatherEl && dest.weather) {
    weatherEl.innerHTML = `
      <div class="flex items-center gap-3">
        <div class="w-12 h-12 rounded-xl bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400 flex items-center justify-center">
          <i data-lucide="${dest.weather.icon || 'sun'}" class="w-6 h-6"></i>
        </div>
        <div>
          <span class="text-2xl font-extrabold text-slate-900 dark:text-white">${dest.weather.temp}</span>
          <p class="text-xs text-slate-500 dark:text-slate-400">${dest.weather.condition}</p>
        </div>
      </div>
    `;
  }

  // Currency & Budget
  const budgetEl = document.getElementById('dest-budget');
  if (budgetEl) {
    budgetEl.innerHTML = `
      <div>
        <span class="text-xs text-slate-400 block mb-0.5">Local Currency</span>
        <span class="font-bold text-slate-900 dark:text-white text-base">${dest.currency || 'USD ($)'}</span>
        <span class="text-[11px] text-slate-500 block mt-1">Avg Daily Spend: <strong>${dest.avgDailyCost || '$70 - $150'}</strong></span>
      </div>
    `;
  }

  // Local Transit Tip
  const tipEl = document.getElementById('dest-transit-tip');
  if (tipEl) {
    tipEl.textContent = dest.localTransitTip || "Use local metro system and tap contactless credit card.";
  }

  // Attractions
  const attContainer = document.getElementById('dest-attractions');
  if (attContainer && dest.attractions) {
    attContainer.innerHTML = dest.attractions.map(att => `
      <div class="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-750 border border-slate-100 dark:border-slate-700">
        <div>
          <h6 class="font-bold text-xs text-slate-900 dark:text-white">${att.name}</h6>
          <span class="text-[11px] text-slate-500 dark:text-slate-400">${att.type}</span>
        </div>
        <div class="flex items-center gap-1 text-amber-500 font-bold text-xs">
          <i data-lucide="star" class="w-3.5 h-3.5 fill-current"></i>
          <span>${att.rating}</span>
        </div>
      </div>
    `).join('');
  }
}

// --- Interactive Packing Checklist Logic ---
function renderPackingChecklist() {
  const container = document.getElementById('packing-list-items');
  const countEl = document.getElementById('packing-progress-text');
  const barEl = document.getElementById('packing-progress-bar');
  if (!container) return;

  const total = state.packingList.length;
  const doneCount = state.packingList.filter(item => item.done).length;
  const pct = Math.round((doneCount / total) * 100);

  if (countEl) countEl.textContent = `${doneCount} of ${total} packed (${pct}%)`;
  if (barEl) barEl.style.width = `${pct}%`;

  container.innerHTML = state.packingList.map(item => `
    <li class="flex items-center justify-between p-2.5 rounded-lg border transition-all ${item.done ? 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-800 opacity-60' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'}">
      <label class="flex items-center gap-3 cursor-pointer select-none flex-1">
        <input type="checkbox" ${item.done ? 'checked' : ''} onchange="togglePackItem(${item.id})" class="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer">
        <span class="text-xs ${item.done ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-700 dark:text-slate-200 font-medium'}">${item.text}</span>
      </label>
      <button onclick="removePackItem(${item.id})" class="text-slate-400 hover:text-rose-500 p-1" title="Remove item">
        <i data-lucide="x" class="w-3.5 h-3.5"></i>
      </button>
    </li>
  `).join('');

  if (window.lucide) window.lucide.createIcons();
}

window.togglePackItem = function(id) {
  const item = state.packingList.find(i => i.id === id);
  if (item) {
    item.done = !item.done;
    renderPackingChecklist();
  }
};

window.removePackItem = function(id) {
  state.packingList = state.packingList.filter(i => i.id !== id);
  renderPackingChecklist();
};

window.addCustomPackItem = function() {
  const input = document.getElementById('new-pack-input');
  if (!input || !input.value.trim()) return;

  state.packingList.push({
    id: Date.now(),
    text: input.value.trim(),
    done: false,
    category: "custom"
  });
  input.value = "";
  renderPackingChecklist();
};

// --- Autocomplete & City Search Setup ---
function setupAutocomplete(inputId, dropdownId) {
  const input = document.getElementById(inputId);
  const dropdown = document.getElementById(dropdownId);
  if (!input || !dropdown) return;

  input.addEventListener('input', () => {
    const query = input.value.trim().toLowerCase();
    if (query.length < 1) {
      dropdown.classList.add('hidden');
      return;
    }

    const matches = window.TRAVEL_CITIES.filter(c => 
      c.name.toLowerCase().includes(query) ||
      c.country.toLowerCase().includes(query) ||
      (c.airports && c.airports.some(a => a.toLowerCase().includes(query)))
    ).slice(0, 5);

    if (matches.length === 0) {
      dropdown.innerHTML = `
        <div class="px-4 py-3 text-xs text-slate-500 dark:text-slate-400">
          Press Enter or Search to plan route to "<strong>${input.value}</strong>"
        </div>
      `;
      dropdown.classList.remove('hidden');
      return;
    }

    dropdown.innerHTML = matches.map(c => `
      <div onclick="selectCity('${inputId}', '${c.name}')" class="px-4 py-2.5 hover:bg-indigo-50 dark:hover:bg-slate-700/60 cursor-pointer flex items-center justify-between text-xs border-b border-slate-100 dark:border-slate-700/50 last:border-b-0">
        <div>
          <span class="font-bold text-slate-800 dark:text-white">${c.name}</span>
          <span class="text-slate-400 ml-1.5">${c.country}</span>
        </div>
        <span class="px-1.5 py-0.5 rounded text-[10px] bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 font-mono">
          ${c.region}
        </span>
      </div>
    `).join('');

    dropdown.classList.remove('hidden');
  });

  document.addEventListener('click', (e) => {
    if (!input.contains(e.target) && !dropdown.contains(e.target)) {
      dropdown.classList.add('hidden');
    }
  });
}

window.selectCity = function(inputId, cityName) {
  const input = document.getElementById(inputId);
  if (input) input.value = cityName;
  const dropdown = document.getElementById(inputId === 'origin-input' ? 'origin-dropdown' : 'destination-dropdown');
  if (dropdown) dropdown.classList.add('hidden');
};

// Quick Swap Origin and Destination
window.swapCities = function() {
  const originInput = document.getElementById('origin-input');
  const destInput = document.getElementById('dest-input');
  if (originInput && destInput) {
    const temp = originInput.value;
    originInput.value = destInput.value;
    destInput.value = temp;

    // Trigger replan if already calculated
    if (originInput.value && destInput.value) {
      handleSearchSubmit();
    }
  }
};

// Choose Featured Quick Route
window.selectFeaturedRoute = function(from, to) {
  const originInput = document.getElementById('origin-input');
  const destInput = document.getElementById('dest-input');
  if (originInput && destInput) {
    originInput.value = from;
    destInput.value = to;
    handleSearchSubmit();
  }
};

// Filter Tabs Click Handlers
window.setRouteFilter = function(filterType) {
  state.activeFilter = filterType;
  
  // Update button active styling
  document.querySelectorAll('.filter-tab-btn').forEach(btn => {
    if (btn.dataset.filter === filterType) {
      btn.className = "filter-tab-btn px-4 py-2 rounded-xl text-xs font-bold transition-all bg-indigo-600 text-white shadow-sm";
    } else {
      btn.className = "filter-tab-btn px-4 py-2 rounded-xl text-xs font-medium transition-all bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700";
    }
  });

  if (state.currentTrip) {
    renderRouteOptionCards(state.currentTrip);
    if (window.lucide) window.lucide.createIcons();
  }
};

// Search Form Submission
function handleSearchSubmit() {
  const originVal = document.getElementById('origin-input').value.trim();
  const destVal = document.getElementById('dest-input').value.trim();

  if (!originVal || !destVal) {
    alert("Please enter both origin and destination cities.");
    return;
  }

  if (originVal.toLowerCase() === destVal.toLowerCase()) {
    alert("Origin and destination cannot be the same! Pick two distinct cities.");
    return;
  }

  const origin = resolveCity(originVal);
  const destination = resolveCity(destVal);

  const tripData = generateRouteSuggestions(origin, destination);
  state.currentTrip = tripData;

  renderTripPlan(tripData);
}

// Modal Booking Guide Helper
window.openBookingHelper = function(mode, from, to) {
  const modal = document.getElementById('booking-modal');
  const modalContent = document.getElementById('modal-booking-content');
  if (!modal || !modalContent) return;

  let portalTips = "";
  if (mode === 'train') {
    portalTips = `
      <div class="space-y-3">
        <div class="p-3 bg-indigo-50 dark:bg-indigo-950/60 rounded-xl text-xs text-indigo-900 dark:text-indigo-200">
          <strong>Recommended Train Booking Portals:</strong>
          <ul class="list-disc ml-5 mt-1 space-y-1">
            <li><strong>Europe:</strong> Trainline, SNCF Connect, Deutsche Bahn, Eurostar, Trenitalia</li>
            <li><strong>Japan:</strong> SmartEX App, JR Pass, Japan Travel by NAVITIME</li>
            <li><strong>USA:</strong> Amtrak App & Acela Express</li>
            <li><strong>India:</strong> IRCTC Rail Connect, MakeMyTrip, ConfirmTkt</li>
          </ul>
        </div>
        <p class="text-xs text-slate-600 dark:text-slate-300">
          <strong>Luggage allowance:</strong> Trains rarely weigh your bags. Keep larger bags on racks at ends of cars and backpacks overhead.
        </p>
      </div>
    `;
  } else if (mode === 'flight') {
    portalTips = `
      <div class="space-y-3">
        <div class="p-3 bg-blue-50 dark:bg-blue-950/60 rounded-xl text-xs text-blue-900 dark:text-blue-200">
          <strong>Recommended Flight Search:</strong>
          <ul class="list-disc ml-5 mt-1 space-y-1">
            <li>Google Flights (best calendar matrix & price tracker)</li>
            <li>Skyscanner & Kayak (comparing budget airlines)</li>
            <li>Direct Airline website (best for seat selection & refunds)</li>
          </ul>
        </div>
        <p class="text-xs text-slate-600 dark:text-slate-300">
          <strong>Airport buffer alert:</strong> Aim to be at the airport 2h prior for domestic and 3h for international routes.
        </p>
      </div>
    `;
  } else {
    portalTips = `
      <div class="space-y-3">
        <div class="p-3 bg-emerald-50 dark:bg-emerald-950/60 rounded-xl text-xs text-emerald-900 dark:text-emerald-200">
          <strong>Road Trip & Rental Services:</strong>
          <ul class="list-disc ml-5 mt-1 space-y-1">
            <li>Rentalcars.com, Enterprise, Hertz, Sixt</li>
            <li>Ride-hail / Cabs: Uber Intercity, Ola, BlaBlaCar (ride-sharing)</li>
            <li>Navigation: Google Maps offline cache, Waze for police & toll alerts</li>
          </ul>
        </div>
      </div>
    `;
  }

  modalContent.innerHTML = `
    <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-2">Booking & Transit Guide: ${from} ➔ ${to}</h3>
    <p class="text-xs text-slate-500 dark:text-slate-400 mb-4">Mode: <span class="capitalize font-bold text-indigo-600 dark:text-indigo-400">${mode}</span></p>
    ${portalTips}
  `;

  modal.classList.remove('hidden');
  if (window.lucide) window.lucide.createIcons();
};

window.closeBookingModal = function() {
  const modal = document.getElementById('booking-modal');
  if (modal) modal.classList.add('hidden');
};

// Copy Shareable Route Link
window.shareRoute = function() {
  if (!state.currentTrip) return;
  const url = `${window.location.origin}${window.location.pathname}?from=${encodeURIComponent(state.currentTrip.origin.name)}&to=${encodeURIComponent(state.currentTrip.destination.name)}`;
  
  if (navigator.clipboard) {
    navigator.clipboard.writeText(url).then(() => {
      showToast("Trip plan link copied to clipboard!");
    });
  } else {
    showToast(`Share URL: ${url}`);
  }
};

// Print / PDF Export
window.printItinerary = function() {
  window.print();
};

function showToast(msg) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.remove('opacity-0', 'pointer-events-none');
  setTimeout(() => {
    toast.classList.add('opacity-0', 'pointer-events-none');
  }, 2800);
}

// Dark Mode Toggle
window.toggleDarkMode = function() {
  const isDark = document.documentElement.classList.toggle('dark');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
  updateThemeIcon();
};

function updateThemeIcon() {
  const icon = document.getElementById('theme-icon');
  if (!icon) return;
  const isDark = document.documentElement.classList.contains('dark');
  icon.setAttribute('data-lucide', isDark ? 'sun' : 'moon');
  if (window.lucide) window.lucide.createIcons();
}

// Initialization on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  // Theme check
  if (localStorage.getItem('theme') === 'dark' || (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
  updateThemeIcon();

  // Autocomplete setup
  setupAutocomplete('origin-input', 'origin-dropdown');
  setupAutocomplete('dest-input', 'destination-dropdown');

  // Render packing list
  renderPackingChecklist();

  // Render quick route chips
  const chipsContainer = document.getElementById('featured-routes-chips');
  if (chipsContainer && window.FEATURED_ROUTES) {
    chipsContainer.innerHTML = window.FEATURED_ROUTES.map(r => `
      <button onclick="selectFeaturedRoute('${r.from}', '${r.to}')" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs bg-slate-100 hover:bg-indigo-50 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-colors whitespace-nowrap">
        <span>${r.from}</span>
        <i data-lucide="arrow-right" class="w-3 h-3 text-indigo-500"></i>
        <span>${r.to}</span>
      </button>
    `).join('');
  }

  // Check URL query parameters for direct shared links (e.g. ?from=Paris&to=Amsterdam)
  const params = new URLSearchParams(window.location.search);
  const qFrom = params.get('from');
  const qTo = params.get('to');

  if (qFrom && qTo) {
    document.getElementById('origin-input').value = qFrom;
    document.getElementById('dest-input').value = qTo;
    handleSearchSubmit();
  } else {
    // Default initial demonstration route: Paris to Amsterdam
    document.getElementById('origin-input').value = "Paris";
    document.getElementById('dest-input').value = "Amsterdam";
    handleSearchSubmit();
  }

  if (window.lucide) window.lucide.createIcons();
});
