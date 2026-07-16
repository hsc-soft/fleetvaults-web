export type Solution = {
  slug: string;
  name: string;
  tagline: string;
  summary: string;
  audience: string;
  features: { title: string; description: string }[];
  outcomes: string[];
};

export const solutions: Solution[] = [
  {
    slug: "fleet-tracking",
    name: "Fleet Tracking",
    tagline: "One dashboard for your entire fleet",
    summary:
      "Track every vehicle in real time, cut idle fuel burn, and prove delivery times with a tamper-proof trip history.",
    audience: "Logistics companies, distributors, and rental operators",
    features: [
      {
        title: "Live map with 10-second refresh",
        description:
          "Every vehicle plotted on one map with speed, heading, ignition state, and driver assignment.",
      },
      {
        title: "Geofence alerts",
        description:
          "Draw zones around depots, customer sites, or restricted areas and get notified on entry and exit.",
      },
      {
        title: "Fuel and idling reports",
        description:
          "Spot the vehicles bleeding fuel while parked, and back it up with per-trip consumption data.",
      },
      {
        title: "Driver scorecards",
        description:
          "Harsh braking, over-speeding, and night driving rolled into a score you can act on.",
      },
    ],
    outcomes: [
      "Up to 18% lower fuel spend from idling control",
      "Delivery ETAs your customers can actually rely on",
      "Complete audit trail for every disputed trip",
    ],
  },
  {
    slug: "car-tracking",
    name: "Car Tracking",
    tagline: "Know where your car is. Always.",
    summary:
      "A compact GPS unit that gives private owners live location, theft alerts, and remote immobilisation from their phone.",
    audience: "Private car owners and small self-drive fleets",
    features: [
      {
        title: "Anti-theft alerts",
        description:
          "Instant push and SMS the moment the car moves without the key, or the device is unplugged.",
      },
      {
        title: "Remote engine immobiliser",
        description:
          "Cut the ignition safely from the app once the vehicle has come to a stop.",
      },
      {
        title: "Trip history",
        description:
          "Every journey stored for 90 days with route, distance, and top speed.",
      },
      {
        title: "Family sharing",
        description:
          "Give trusted members view-only access without handing over your account.",
      },
    ],
    outcomes: [
      "Recovery support coordinated with local authorities",
      "Lower insurance premiums with many providers",
      "Peace of mind when a teen driver has the keys",
    ],
  },
  {
    slug: "truck-tracking",
    name: "Truck & Trailer",
    tagline: "Built for long-haul and heavy cargo",
    summary:
      "Route compliance, cargo-door sensors, and temperature monitoring for trucks that carry things worth protecting.",
    audience: "Transporters, cold-chain operators, and freight contractors",
    features: [
      {
        title: "Route deviation alerts",
        description:
          "Assign an approved route and get alerted the moment a truck strays from it.",
      },
      {
        title: "Door and cargo sensors",
        description:
          "Know exactly when a container door opens, and where the truck was standing at that moment.",
      },
      {
        title: "Cold-chain temperature logs",
        description:
          "Continuous reefer temperature logging with threshold breach alerts.",
      },
      {
        title: "Halt and rest analysis",
        description:
          "See unplanned stops, long halts, and how they stack up against your delivery windows.",
      },
    ],
    outcomes: [
      "Cargo pilferage caught while the truck is still on the road",
      "Compliance reports ready for the client without manual work",
      "Fewer spoilage claims on temperature-sensitive loads",
    ],
  },
  {
    slug: "school-bus-tracking",
    name: "School Bus Tracking",
    tagline: "Every child accounted for, every trip",
    summary:
      "Live bus location for parents, RFID student attendance, and speed governance the school administration can monitor.",
    audience: "Schools, colleges, and transport contractors",
    features: [
      {
        title: "Parent app with live ETA",
        description:
          "Parents see the bus approaching their stop and get a notification a few minutes ahead.",
      },
      {
        title: "RFID boarding attendance",
        description:
          "Automatic check-in and check-out logs so the school knows who boarded which bus, and when.",
      },
      {
        title: "Over-speed governance",
        description:
          "Speed thresholds per route, with alerts to the transport in-charge on every breach.",
      },
      {
        title: "SOS panic button",
        description:
          "A single press alerts the school control room with the bus location attached.",
      },
    ],
    outcomes: [
      "Parent phone calls to the school office drop sharply",
      "A defensible safety record for audits and inspections",
      "Drivers held to the same standard on every route",
    ],
  },
];

export function getSolution(slug: string): Solution | undefined {
  return solutions.find((solution) => solution.slug === slug);
}
