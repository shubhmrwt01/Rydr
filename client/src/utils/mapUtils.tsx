import axios from "axios";
import * as Location from "expo-location";
export const getLatLong = async (placeId: string) => {
  try {
    const response = await axios.get(
      "https://maps.googleapis.com/maps/api/place/details/json",
      {
        params: {
          placeid: placeId,
          key: process.env.GOOGLE_MAP_API_KEY,
        },
      },
    );
    const data = response.data;
    if (data.status === "OK" && data.result) {
      const location = data.result.geometry.location;
      const address = data.result.formatted_address;

      return {
        latitude: location.lat,
        longitude: location.lng,
        address: address,
      };
    } else {
      throw new Error("Unable to fetch location details");
    }
  } catch (error) {
    throw new Error("Unable to fetch location details");
  }
};

export const reverseGeocode = async (latitude: number, longitude: number) => {
  try {
    const result = await Location.reverseGeocodeAsync({
      latitude,
      longitude,
    });

    if (result.length > 0) {
      const place = result[0];

      return [
        place.name,
        place.street,
        place.city || place.region,
        place.postalCode, // ✅ PINCODE
        place.country,
      ]
        .filter(Boolean)
        .join(", ");
    }

    return "Unknown location";
  } catch (error) {
    return "Unknown location";
  }
};

function extractPlaceData(data: any) {
  return data.map((item: any) => ({
    place_id: item.place_id,
    title: item.structured_formatting.main_text,
    description: item.description,
  }));
}

export const getPlacesSuggestions = async (query: string) => {
  try {
    const res = await axios.get("https://photon.komoot.io/api/", {
      params: {
        q: query,
        limit: 8,
        lang: "en",
        bbox: "68.1,6.5,97.4,35.5", // 🇮🇳 India bounding box
      },
    });

    const features = res.data.features;

    // 🇮🇳 Filter India results
    const indianResults = features.filter(
      (item: any) => item.properties.country === "India",
    );

    // 🔥 fallback if no India results
    const baseResults = indianResults.length > 0 ? indianResults : features;

    // 🔁 Remove duplicates
    const seen = new Set();
    const unique = baseResults.filter((item: any) => {
      const key =
        (item.properties.name || "") +
        (item.properties.city || "") +
        (item.properties.state || "");

      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    // 🔥 Smart Sorting (MOST IMPORTANT)
    const sorted = unique.sort((a: any, b: any) => {
      const queryLower = query.toLowerCase();

      // ✅ Priority 1: Delhi first
      if (a.properties.state === "Delhi") return -1;
      if (b.properties.state === "Delhi") return 1;

      // ✅ Priority 2: exact name match
      const aMatch = a.properties.name?.toLowerCase().includes(queryLower);
      const bMatch = b.properties.name?.toLowerCase().includes(queryLower);

      if (aMatch && !bMatch) return -1;
      if (!aMatch && bMatch) return 1;

      // ✅ Priority 3: importance score
      return (b.properties.importance || 0) - (a.properties.importance || 0);
    });

    // 🎯 Final mapping
    return sorted.map((item: any) => ({
      place_id: item.properties.osm_id?.toString() || Math.random().toString(),

      title: item.properties.name || item.properties.city || "Unknown",

      // FULL ADDRESS
      description: [
        item.properties.name,
        item.properties.city,
        item.properties.state,
        item.properties.country,
      ]
        .filter(Boolean)
        .join(", "),

      latitude: item.geometry.coordinates[1],

      longitude: item.geometry.coordinates[0],
    }));
  } catch (err) {
    console.log("Photon error:", err);
    return [];
  }
};

export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
) => {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export const calculateFare = (distance: number) => {
  const rateStructure = {
    bike: { baseFare: 10, perKmRate: 5, minimumFare: 25 },
    auto: { baseFare: 15, perKmRate: 7, minimumFare: 30 },
    cabEconomy: { baseFare: 20, perKmRate: 10, minimumFare: 50 },
    cabPremium: { baseFare: 30, perKmRate: 15, minimumFare: 70 },
  };

  const fareCalculation = (
    baseFare: number,
    perKmRate: number,
    minimumFare: number,
  ) => {
    const calculatedFare = baseFare + distance * perKmRate;
    return Math.max(calculatedFare, minimumFare);
  };

  return {
    bike: fareCalculation(
      rateStructure.bike.baseFare,
      rateStructure.bike.perKmRate,
      rateStructure.bike.minimumFare,
    ),
    auto: fareCalculation(
      rateStructure.auto.baseFare,
      rateStructure.auto.perKmRate,
      rateStructure.auto.minimumFare,
    ),
    cabEconomy: fareCalculation(
      rateStructure.cabEconomy.baseFare,
      rateStructure.cabEconomy.perKmRate,
      rateStructure.cabEconomy.minimumFare,
    ),
    cabPremium: fareCalculation(
      rateStructure.cabPremium.baseFare,
      rateStructure.cabPremium.perKmRate,
      rateStructure.cabPremium.minimumFare,
    ),
  };
};

function quadraticBezierCurve(
  p1: any,
  p2: any,
  controlPoint: any,
  numPoints: any,
) {
  const points = [];
  const step = 1 / (numPoints - 1);

  for (let t = 0; t <= 1; t += step) {
    const x =
      (1 - t) ** 2 * p1[0] + 2 * (1 - t) * t * controlPoint[0] + t ** 2 * p2[0];
    const y =
      (1 - t) ** 2 * p1[1] + 2 * (1 - t) * t * controlPoint[1] + t ** 2 * p2[1];
    const coord = { latitude: x, longitude: y };
    points.push(coord);
  }

  return points;
}

const calculateControlPoint = (p1: any, p2: any) => {
  const d = Math.sqrt((p2[0] - p1[0]) ** 2 + (p2[1] - p1[1]) ** 2);
  const scale = 1; // Scale factor to reduce bending
  const h = d * scale; // Reduced distance from midpoint
  const w = d / 2;
  const x_m = (p1[0] + p2[0]) / 2;
  const y_m = (p1[1] + p2[1]) / 2;

  const x_c =
    x_m +
    ((h * (p2[1] - p1[1])) /
      (2 * Math.sqrt((p2[0] - p1[0]) ** 2 + (p2[1] - p1[1]) ** 2))) *
      (w / d);
  const y_c =
    y_m -
    ((h * (p2[0] - p1[0])) /
      (2 * Math.sqrt((p2[0] - p1[0]) ** 2 + (p2[1] - p1[1]) ** 2))) *
      (w / d);

  const controlPoint = [x_c, y_c];
  return controlPoint;
};

export const getPoints = (places: any) => {
  const p1 = [places[0].latitude, places[0].longitude];
  const p2 = [places[1].latitude, places[1].longitude];
  const controlPoint = calculateControlPoint(p1, p2);

  return quadraticBezierCurve(p1, p2, controlPoint, 100);
};

export const vehicleIcons: Record<
  "bike" | "auto" | "cabEconomy" | "cabPremium",
  { icon: any }
> = {
  bike: { icon: require("@/assets/icons/bike.png") },
  auto: { icon: require("@/assets/icons/auto.png") },
  cabEconomy: { icon: require("@/assets/icons/cab.png") },
  cabPremium: { icon: require("@/assets/icons/cab_premium.png") },
};
