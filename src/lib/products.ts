export type ProductSpec = { label: string; value: string };

export type Product = {
  slug: string;
  name: string;
  /** Short one-liner used on cards. */
  description: string;
  highlights: string[];
  /** Path under /public, e.g. "/products/br05.png". Cards show a placeholder when absent. */
  image?: string;
  /** Longer intro shown on the detail page. */
  overview?: string;
  features?: string[];
  useCases?: string[];
  specs?: ProductSpec[];
};

export type ProductCategory = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  products: Product[];
};

export const productCategories: ProductCategory[] = [
  {
    slug: "wired-gps-trackers",
    name: "Wired GPS Trackers",
    tagline: "Hardwired to the vehicle for always-on tracking",
    description:
      "Powered directly from the vehicle battery, these units never run out of charge and support ignition, fuel, and immobiliser wiring — the workhorse for fleets.",
    products: [
      {
        slug: "teltonika-fmb920",
        name: "Teltonika FMB920",
        description:
          "Compact GSM/GNSS terminal with Bluetooth and support for a wireless fuel-level sensor. Built for real-time tracking, driver-behaviour monitoring, and advanced security.",
        highlights: ["Bluetooth", "Wireless fuel sensor", "6–30V DC", "Made in Lithuania"],
        image: "/products/teltonika-fmb920.png",
        overview:
          "The Teltonika FMB920 is a compact, feature-rich GPS tracker for real-time vehicle tracking and driver-behaviour monitoring, now with wireless fuel-level sensor integration over Bluetooth. Its rugged design with built-in antennas makes it easy to install discreetly across cars, fleets, and commercial vehicles.",
        features: [
          "Live GPS tracking with real-time location updates",
          "Multi-GNSS support (GPS, GLONASS, GALILEO, BEIDOU)",
          "Bluetooth v4.0 for wireless sensor integration",
          "Remote engine immobilisation via relay",
          "Geofencing entry/exit alerts",
          "Crash and harsh-driving detection",
          "Anti-theft: towing, unplug, and jamming detection",
          "Internal 128 MB memory for offline logging",
          "Remote firmware updates (FOTA)",
        ],
        useCases: [
          "Personal vehicle security and monitoring",
          "Fleet management and driver-behaviour analysis",
          "Wireless fuel monitoring and theft prevention",
          "School bus and student-safety tracking",
          "Field-force and delivery vehicle tracking",
        ],
        specs: [
          { label: "Dimensions", value: "79 × 43 × 12 mm" },
          { label: "GNSS", value: "GPS, GLONASS, GALILEO, BEIDOU" },
          { label: "Bluetooth", value: "v4.0" },
          { label: "I/O", value: "1 digital in, 1 analog in, 1 digital out" },
          { label: "Backup battery", value: "170 mAh Li-Ion" },
          { label: "Memory", value: "128 MB" },
          { label: "Rating", value: "IP54" },
        ],
      },
      {
        slug: "br05",
        name: "BR05",
        description:
          "Smart, entry-level 4-wire GPS tracker for everyday vehicle safety. Minimal wiring and easy install, with real-time location, route playback, and remote engine control.",
        highlights: ["4-wire", "Remote engine cut", "Route playback"],
        image: "/products/br05.png",
        overview:
          "The BR05 is a compact, entry-level 4-wire GPS tracker for vehicle safety and real-time location monitoring. It delivers remote engine control, geofencing, and comprehensive alerts through an intuitive mobile and web interface — ideal for individual owners, taxi operators, and small fleets.",
        features: [
          "Real-time location with speed and direction",
          "Trip-history replay for up to 90 days",
          "Geofence entry/exit notifications",
          "Remote engine immobilisation via relay",
          "Ignition ON/OFF detection",
          "Speed-limit violation alerts",
          "Power-cut and tamper detection",
          "Android & iOS apps with multi-vehicle support",
        ],
        useCases: [
          "Private vehicle theft prevention",
          "Taxi fleet supervision and driver tracking",
          "Small-fleet trip optimisation",
          "Delivery and transport route verification",
        ],
        specs: [
          { label: "Configuration", value: "4-wire" },
          { label: "Form factor", value: "Compact, concealable" },
          { label: "Data retention", value: "Up to 90 days" },
          { label: "Access", value: "Mobile app + web dashboard" },
        ],
      },
      {
        slug: "br05-ac",
        name: "BR05 AC",
        description:
          "BR05 variant that also monitors air-conditioner usage — so you track not just where the vehicle goes, but when the AC is running.",
        highlights: ["AC usage monitor", "5-wire", "Remote engine cut"],
        image: "/products/br05-ac.png",
        overview:
          "The BR05 AC tracks vehicle location and air-conditioning usage at the same time, using a dedicated AC-sense wire. It helps owners, taxi operators, and fleet managers cut fuel waste and improve accountability without adding a second device.",
        features: [
          "Live tracking with location, speed, and route",
          "Air-conditioner usage monitoring with alerts",
          "Trip and AC-usage playback for 90 days",
          "Custom geofencing with boundary alerts",
          "Remote engine shut-off via relay immobiliser",
          "Ignition status updates",
          "Speed-limit warnings",
          "Tamper and power-disconnect alerts",
        ],
        useCases: [
          "Owners monitoring fuel-wasting AC habits",
          "Taxi operators managing comfort and behaviour",
          "Fleets analysing cost via AC run-time data",
          "Logistics providers improving oversight",
        ],
        specs: [
          { label: "Configuration", value: "5-wire (with AC sense)" },
          { label: "Monitoring", value: "Location + AC usage" },
          { label: "Data retention", value: "90 days" },
          { label: "Access", value: "Mobile app + web portal" },
        ],
      },
      {
        slug: "br05-mic-sos",
        name: "BR05 MIC+SOS",
        description:
          "8-wire tracker with a high-sensitivity microphone for in-cabin audio monitoring and an SOS input for emergencies — complete in-vehicle awareness.",
        highlights: ["8-wire", "Audio (MIC)", "SOS input"],
        image: "/products/br05-mic-sos.png",
        overview:
          "The BR05 MIC+SOS is an 8-wire tracking solution that combines real-time location with one-way in-cabin audio and an emergency SOS button — giving live insight into the vehicle's surroundings and the driver's safety, beyond standard tracking.",
        features: [
          "Real-time GPS position via app and web",
          "One-way microphone for interior audio",
          "Emergency SOS button with push alerts",
          "90-day historical route playback",
          "Custom geofencing with entry/exit alerts",
          "Remote engine immobilisation",
          "Ignition ON/OFF detection",
          "Overspeed, tamper, and power-cut alerts",
        ],
        useCases: [
          "Owners wanting security plus audio monitoring",
          "Fleets needing driver accountability",
          "Taxi and transport passenger-safety oversight",
        ],
        specs: [
          { label: "Configuration", value: "8-wire hardwired" },
          { label: "Audio", value: "One-way MIC monitoring" },
          { label: "Emergency", value: "SOS button" },
          { label: "Data retention", value: "90 days" },
        ],
      },
      {
        slug: "sk05",
        name: "SK05",
        description:
          "Compact, efficient 4-wire tracker for everyday monitoring and theft protection, with easy installation and the essential security features vehicles need.",
        highlights: ["4-wire", "Engine immobiliser", "Compact"],
        image: "/products/sk05.png",
        overview:
          "The SK05 is a compact 4-wire GPS tracker for everyday vehicle monitoring and theft prevention. It offers real-time tracking, route playback, and remote engine control through an intuitive mobile and web platform — a dependable choice for owners and small fleets.",
        features: [
          "Real-time location with direction, route, and speed",
          "90-day historical route playback",
          "Custom geofence zones with alerts",
          "Remote engine immobilisation via relay",
          "Ignition detection with ON/OFF alerts",
          "Overspeed alert configuration",
          "Power-disconnect and tamper detection",
          "Android, iOS, and web dashboard access",
        ],
        useCases: [
          "Owners seeking enhanced vehicle security",
          "Cab and taxi route monitoring",
          "Multi-vehicle fleet management",
          "Delivery services needing live tracking",
        ],
        specs: [
          { label: "Configuration", value: "4-wire" },
          { label: "Immobilisation", value: "Relay-based engine lock" },
          { label: "Route history", value: "90 days" },
          { label: "Access", value: "Android, iOS, web" },
        ],
      },
      {
        slug: "br06-f",
        name: "BR06 F",
        description:
          "Hardwired tracker with temperature monitoring and expandable accessories — location plus environmental control for smarter fleet intelligence.",
        highlights: ["Temperature monitor", "Expandable", "2G/4G LTE"],
        image: "/products/br06-f.png",
        overview:
          "The BR06 F is a high-performance fleet tracker for commercial logistics and cold-chain transport. It pairs real-time GPS with temperature-sensor support to monitor both vehicle location and cargo conditions, and expands with accessories like fuel sensors, RFID, and panic buttons.",
        features: [
          "Real-time GPS/GNSS with AGPS for weak-signal zones",
          "Digital temperature-sensor connectivity",
          "2G/4G LTE with 2G fallback",
          "Offline data backup with auto-upload",
          "Driver-behaviour analysis (accel, braking, cornering)",
          "Custom geofence alerts",
          "Ignition and power-disconnect alerts",
          "Remote engine immobilisation via relay",
          "Expandable: MIC, speaker, panic button, RFID, fuel sensor, RS232",
        ],
        useCases: [
          "Cold-chain logistics with cargo temperature monitoring",
          "Refrigerated trucks and pharmaceutical vans",
          "Commercial fleet management and compliance",
          "Cargo-loss prevention and driver accountability",
        ],
        specs: [
          { label: "Network", value: "2G/4G LTE with 2G fallback" },
          { label: "Location", value: "GPS/GNSS with AGPS" },
          { label: "Temperature", value: "Digital sensor compatible" },
          { label: "Storage", value: "Offline backup with cloud sync" },
        ],
      },
    ],
  },
  {
    slug: "magnet-based-gps-trackers",
    name: "Magnet Based GPS Trackers",
    tagline: "Slap it on, start tracking — no wiring",
    description:
      "Rugged magnetic units that clamp under a chassis or inside cargo in seconds. Ideal for trailers, containers, and assets that move between vehicles.",
    products: [
      {
        slug: "br06",
        name: "BR06",
        description:
          "High-performance magnet-based tracker with a long battery backup — clamp it on and track freely, anywhere, with no wiring.",
        highlights: ["10,000 mAh", "IP65", "Audio monitoring"],
        image: "/products/br06.png",
        overview:
          "The BR06 is a wireless, magnet-based GPS tracker with a powerful 10,000 mAh battery for portable asset and vehicle surveillance. It needs no installation — combining covert deployment with voice surveillance, motion detection, and tamper alerts.",
        features: [
          "9–12 days of battery life per charge",
          "Industrial-grade magnetic mount for metal surfaces",
          "Light sensor for unauthorised-removal alerts",
          "One-way live audio monitoring",
          "IP65 dust and water-splash resistance",
          "Vibration and motion detection with instant alerts",
          "Real-time GPS via app and web portal",
        ],
        useCases: [
          "Tracking high-value shipments and containers",
          "Anti-theft backup for personal vehicles",
          "Discreet surveillance for investigations",
          "Rental and leasing vehicle monitoring",
          "Portable assets: generators, trailers, machinery",
        ],
        specs: [
          { label: "Battery", value: "10,000 mAh rechargeable" },
          { label: "Battery life", value: "9–12 days" },
          { label: "Mount", value: "Magnetic" },
          { label: "Rating", value: "IP65" },
          { label: "Audio", value: "One-way monitoring" },
        ],
      },
      {
        slug: "s15",
        name: "S15",
        description:
          "Compact, versatile magnet-based tracker with voice monitoring — portable, powerful, and easy to move between vehicles or assets.",
        highlights: ["7,000 mAh", "IP65", "Voice monitoring"],
        image: "/products/s15.png",
        overview:
          "The S15 is a portable, magnet-based GPS tracker with a 7,000 mAh battery delivering 7–10 days per charge. It combines real-time tracking with one-way voice surveillance and tamper detection via an integrated light sensor.",
        features: [
          "7,000 mAh long-life battery (7–10 days)",
          "Strong magnetic grip for metal surfaces",
          "Light sensor for tamper/removal alerts",
          "One-way live voice surveillance",
          "IP65 dust and water resistance",
          "Motion and vibration detection",
          "Real-time location, direction, and speed",
        ],
        useCases: [
          "Private vehicle security and tracking",
          "Cargo and high-value shipment monitoring",
          "Rental and leasing fleet supervision",
          "Equipment tracking: trailers, machinery, generators",
        ],
        specs: [
          { label: "Battery", value: "7,000 mAh" },
          { label: "Battery life", value: "7–10 days" },
          { label: "Mount", value: "Magnetic" },
          { label: "Rating", value: "IP65" },
        ],
      },
      {
        slug: "h12",
        name: "H12",
        description:
          "Lightweight mini magnet tracker with audio surveillance — compact power with instant alerts for discreet asset and vehicle tracking.",
        highlights: ["1,200 mAh", "Mini", "Audio surveillance"],
        image: "/products/h12.png",
        overview:
          "The H12 is a lightweight, magnet-based portable tracker for temporary monitoring needs. It combines GPS location with one-way audio surveillance and motion detection in a compact, easy-to-deploy form factor.",
        features: [
          "1,200 mAh rechargeable battery (2–3 days)",
          "Magnetic base — no installation needed",
          "One-way microphone for live audio",
          "Vibration and movement alerts",
          "Real-time GPS via mobile or web dashboard",
          "Android and iOS apps",
        ],
        useCases: [
          "Temporary vehicle surveillance",
          "Undercover investigations and security",
          "Tracking portable assets in transit",
          "Parental oversight of teen drivers",
        ],
        specs: [
          { label: "Battery", value: "1,200 mAh rechargeable" },
          { label: "Battery life", value: "2–3 days" },
          { label: "Mount", value: "Magnetic base" },
          { label: "Audio", value: "One-way microphone" },
        ],
      },
    ],
  },
  {
    slug: "wireless-gps-trackers",
    name: "Wireless GPS Trackers",
    tagline: "Battery-powered, install anywhere in minutes",
    description:
      "Fully self-contained trackers with no external power needed. Hide them on cars, equipment, or high-value cargo for discreet, portable tracking.",
    products: [
      {
        slug: "obd",
        name: "OBD GPS Tracker",
        description:
          "Plug-and-track tracker that fits straight into the vehicle's OBD port — no wires, no tools. Draws power from the port and starts reporting in seconds.",
        highlights: ["Plug & play", "No wiring", "OBD port powered"],
        image: "/products/obd.png",
        overview:
          "The OBD GPS Tracker plugs directly into a vehicle's OBD port with no wiring or professional install. It enables real-time location, driving-behaviour analysis, and vehicle security through a mobile app or web dashboard — and moves between vehicles in seconds.",
        features: [
          "Plug & play — inserts into the OBD port, no wiring",
          "Live GPS location with speed and movement",
          "Operates independently of vehicle electricals",
          "Speed and route monitoring with limit alerts",
          "Ignition alerts and movement tracking",
          "Android, iOS, and web dashboard access",
        ],
        useCases: [
          "Owners wanting tracking without modifications",
          "Taxi operators monitoring route compliance",
          "Fleets deploying across many vehicles fast",
          "Rental providers tracking hired vehicles",
        ],
        specs: [
          { label: "Installation", value: "OBD port (plug-in)" },
          { label: "Power", value: "Vehicle OBD port" },
          { label: "Compatibility", value: "Android and iOS" },
          { label: "Portability", value: "Reusable across vehicles" },
        ],
      },
    ],
  },
  {
    slug: "sensors",
    name: "Sensors",
    tagline: "Turn location data into operational insight",
    description:
      "Add-on sensors that pair with any Fleet Vaults tracker to monitor fuel, temperature, doors, and more — the data behind smarter decisions.",
    products: [
      {
        slug: "teltonika-eye-sensor",
        name: "Teltonika EYE Sensor",
        description:
          "Smart wireless Bluetooth sensor for environmental and asset monitoring — temperature, humidity, movement, and magnetic field in one compact beacon.",
        highlights: ["Wireless BLE", "Temp & humidity", "Up to 5-yr battery"],
        image: "/products/teltonika-eye-sensor.png",
        overview:
          "The Teltonika EYE Sensor is a wireless Bluetooth Low Energy device for real-time monitoring of assets and environmental conditions — no wires or external power. Its rugged, IP67 body helps track cargo integrity and detect tampering across logistics, cold-chain, and industrial use, with up to 5 years of battery life.",
        features: [
          "Bluetooth Low Energy (BLE 4.2) connectivity",
          "Temperature and humidity monitoring with alerts",
          "Magnet-based contact detection for doors/containers",
          "Movement and vibration via accelerometer",
          "2.5–5 year battery (replaceable CR2450)",
          "IP67 dustproof and water-resistant",
          "iBeacon and Eddystone protocol support",
        ],
        useCases: [
          "Cold-chain monitoring for perishables and pharma",
          "Container and trailer door/movement security",
          "Anti-tamper asset protection",
          "Warehouse climate and security monitoring",
        ],
        specs: [
          { label: "Connectivity", value: "Bluetooth LE 4.2" },
          { label: "Sensors", value: "Temp, humidity, accel, magnet contact" },
          { label: "Battery", value: "CR2450, 2.5–5 years" },
          { label: "Weight", value: "18 g" },
          { label: "Rating", value: "IP67" },
        ],
      },
      {
        slug: "mielta-fantom-ble",
        name: "Mielta Fantom BLE",
        description:
          "Wireless Bluetooth fuel-level sensor — accurate tank monitoring and theft detection without cutting into the fuel line.",
        highlights: ["Wireless fuel level", "±1% accuracy", "IP67"],
        image: "/products/mielta-fantom-ble.png",
        overview:
          "The Mielta Fantom BLE is a Bluetooth-enabled sensor for accurate, wireless fuel-level measurement across tank types. It streams real-time fuel data to compatible GPS trackers, removing complex wiring while offering long battery life and theft/leakage alerts.",
        features: [
          "Bluetooth LE 4.0+ wireless link to trackers",
          "High measurement accuracy (±1%)",
          "Battery life up to 5 years",
          "Wireless pairing — simple installation",
          "Real-time fuel monitoring with theft alerts",
          "IP67 industrial-grade construction",
          "Integrates with Teltonika FMB920",
        ],
        useCases: [
          "Fleet fuel-consumption tracking",
          "Construction and mining fuel protection",
          "Fuel-tanker and distribution verification",
          "Agricultural equipment fuel management",
        ],
        specs: [
          { label: "Communication", value: "Bluetooth LE 4.0+" },
          { label: "Accuracy", value: "±1%" },
          { label: "Battery", value: "Up to 5 years" },
          { label: "Rating", value: "IP67" },
          { label: "Sizes", value: "1000 / 1500 / 2000 mm" },
        ],
      },
      {
        slug: "wired-temperature-sensor",
        name: "Wired Temperature Sensor",
        description:
          "Accurate, real-time temperature monitoring for vehicles and cargo — the precision cold-chain and reefer operations depend on.",
        highlights: ["Real-time temp", "Cold-chain ready", "Wired"],
        image: "/products/wired-temperature-sensor.png",
        overview:
          "A robust, high-accuracy sensor for real-time temperature monitoring through compatible GPS trackers like the BR06 F. It keeps temperature-sensitive goods within controlled conditions in transit — preventing spoilage and supporting compliance.",
        features: [
          "Real-time temperature sent to the GPS platform",
          "High accuracy with fast response time",
          "Direct wired connection to BR06 F",
          "Industrial-grade, vibration and moisture resistant",
          "Plug-and-play via input or RS232 adapter",
          "Data logged with vehicle movement",
          "Threshold alerts for out-of-range readings",
        ],
        useCases: [
          "Cold-chain: dairy, meat, vaccines, frozen goods",
          "Pharmaceutical transport",
          "Perishable food delivery",
          "Reefer trucks and refrigerated containers",
        ],
        specs: [
          { label: "Connection", value: "Wired (to BR06 F)" },
          { label: "Compatible", value: "BR06 F GPS tracker" },
          { label: "Cable options", value: "1 / 5 / 10 / 15 / 20 m" },
          { label: "Logging", value: "Via tracker, trip reports + live dashboards" },
        ],
      },
    ],
  },
  {
    slug: "gps-tracker-accessories",
    name: "GPS Tracker Accessories",
    tagline: "Everything to get a tracker installed and running",
    description:
      "Relays, panic buttons, and microphones to complete any installation and extend what your trackers can do.",
    products: [
      {
        slug: "engine-cut-off-relay",
        name: "Engine Cut-Off Relay",
        description:
          "Relay for safe remote vehicle immobilisation — cut the engine from the app once the vehicle has stopped, for total control and instant protection.",
        highlights: ["Remote immobiliser", "12V / 24V", "Fail-safe"],
        image: "/products/engine-cut-off-relay.png",
        overview:
          "A compact security accessory that enables remote engine shutdown through your GPS tracking system and app. It supports both 12V and 24V systems for broad vehicle compatibility, and is designed for theft prevention and unauthorised-access control.",
        features: [
          "Remote engine shutdown via GPS platform or app",
          "Dual voltage support (12V and 24V)",
          "Seamless integration with compatible trackers",
          "Controlled cutoff without electrical damage",
          "Compact, rugged construction",
        ],
        useCases: [
          "Fleets restricting use outside working hours",
          "Owners protecting against theft",
          "Truck and delivery route-deviation prevention",
          "Leasing firms enforcing contractual compliance",
        ],
        specs: [
          { label: "Voltage", value: "12V, 24V" },
          { label: "Compatibility", value: "Cars, SUVs, trucks, vans, buses" },
          { label: "Control", value: "Web dashboard or mobile app" },
        ],
      },
      {
        slug: "panic-button",
        name: "Panic Button",
        description:
          "One-touch SOS button that sends an instant emergency alert with the vehicle's location — a lifeline for drivers in critical moments.",
        highlights: ["1-touch SOS", "Location alert", "Discreet"],
        image: "/products/panic-button.png",
        overview:
          "The Panic Button is a compact emergency device that sends an instant SOS alert with GPS location to registered contacts. It works with supported GPS trackers to transmit real-time vehicle location during emergencies — for private owners, fleets, taxis, and school buses.",
        features: [
          "One-touch instant emergency signalling",
          "Live location shared via the GPS tracker",
          "Universal compatibility across vehicle types",
          "Compact, durable dashboard or seat mounting",
          "Simple activation — no complicated steps",
        ],
        useCases: [
          "Taxi and ride-hailing protection",
          "School bus and van emergency alerts",
          "Fleet and trucking safety",
          "Private car owner security on solo travel",
        ],
        specs: [
          { label: "Sizes", value: "Regular, Micro" },
          { label: "Integration", value: "Works with supported trackers" },
          { label: "Activation", value: "One-touch button press" },
        ],
      },
      {
        slug: "one-way-mic",
        name: "One-Way MIC",
        description:
          "Discreet in-vehicle microphone that pairs with the tracker for one-way audio monitoring — hear what matters and stay ahead of risks.",
        highlights: ["Audio monitoring", "Discreet", "Plug & play"],
        image: "/products/one-way-mic.png",
        overview:
          "A discreet microphone accessory that pairs with supported GPS trackers for remote live audio monitoring inside a vehicle. It lets owners and fleet supervisors listen to in-cabin sounds in real time, enhancing oversight, safety, and investigation across personal and commercial vehicles.",
        features: [
          "Live remote audio via the GPS platform",
          "Combined location and audio data",
          "High-sensitivity microphone",
          "Compact, covert design",
          "Works across cars, vans, trucks, buses, taxis",
          "Simple plug-and-play install",
        ],
        useCases: [
          "Fleet management and driver-conduct monitoring",
          "Taxi and ride-hailing safety oversight",
          "School and staff-transport supervision",
          "Logistics and delivery asset protection",
        ],
        specs: [
          { label: "Design", value: "Compact, low-profile" },
          { label: "Compatibility", value: "Supported GPS trackers" },
          { label: "Installation", value: "Plug-and-play" },
          { label: "Audio", value: "High-sensitivity capture" },
        ],
      },
    ],
  },
];

export function getProductCategory(slug: string): ProductCategory | undefined {
  return productCategories.find((category) => category.slug === slug);
}

export function getProduct(categorySlug: string, productSlug: string) {
  const category = getProductCategory(categorySlug);
  const product = category?.products.find((p) => p.slug === productSlug);
  if (!category || !product) return undefined;
  return { category, product };
}

export function productHref(categorySlug: string, productSlug: string): string {
  return `/products/${categorySlug}/${productSlug}`;
}
