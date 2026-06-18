import { mapStyles } from "@/styles/mapStyles";
import { customMapStyle, indiaIntialRegion } from "@/utils/CustomMap";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import polyline from "@mapbox/polyline";
import { FC, memo, useEffect, useRef, useState } from "react";
import { Image, TouchableOpacity, View } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import { RFValue } from "react-native-responsive-fontsize";
const RoutesMap: FC<{ drop: any; pickup: any }> = ({ drop, pickup }) => {
  const mapRef = useRef<MapView>(null);
  const [routeCoords, setRouteCoords] = useState<any[]>([]);

  const fetchRoute = async () => {
    if (!pickup?.latitude || !drop?.latitude) return;

    try {
      const url = `https://router.project-osrm.org/route/v1/driving/${pickup.longitude},${pickup.latitude};${drop.longitude},${drop.latitude}?overview=full&geometries=polyline`;

      const res = await fetch(url);
      const data = await res.json();

      if (data.routes?.length) {
        // ✅ Decode polyline
        const decoded = polyline.decode(data.routes[0].geometry);

        const coords = decoded.map((point: number[]) => ({
          latitude: point[0],
          longitude: point[1],
        }));

        setRouteCoords(coords);

        setTimeout(() => {
          mapRef.current?.fitToCoordinates(coords, {
            edgePadding: { top: 50, bottom: 50, right: 50, left: 50 },
            animated: true,
          });
        }, 300);
      }
    } catch (err) {
      console.log("Route error", err);
    }
  };

  useEffect(() => {
    fetchRoute();
  }, [pickup, drop]);

  const calculateInitialRegion = () => {
    if (pickup.latitude && drop.latitude) {
      return {
        latitude: (pickup.latitude + drop.latitude) / 2,
        longitude: (pickup.longitude + drop.longitude) / 2,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      };
    }
    return indiaIntialRegion;
  };

  return (
    <View style={{ flex: 1 }}>
      <MapView
        ref={mapRef}
        style={{ flex: 1 }}
        initialRegion={calculateInitialRegion()}
        showsUserLocation
        customMapStyle={customMapStyle}
      >
        {/* 🚗 Route */}
        {routeCoords.length > 0 && (
          <Polyline
            coordinates={routeCoords}
            strokeWidth={5}
            strokeColor="#3C75BE"
          />
        )}

        {/* 📍 Drop */}
        {drop.latitude && (
          <Marker coordinate={drop}>
            <Image
              source={require("@/assets/icons/drop_marker.png")}
              style={{ height: 30, width: 30, resizeMode: "contain" }}
            />
          </Marker>
        )}

        {/* 📍 Pickup */}
        {pickup.latitude && (
          <Marker coordinate={pickup}>
            <Image
              source={require("@/assets/icons/marker.png")}
              style={{ height: 30, width: 30, resizeMode: "contain" }}
            />
          </Marker>
        )}
      </MapView>

      <TouchableOpacity style={mapStyles.gpsButton}>
        <MaterialCommunityIcons
          name="crosshairs-gps"
          size={RFValue(16)}
          color="#3C75BE"
        />
      </TouchableOpacity>
    </View>
  );
};

export default memo(RoutesMap);
