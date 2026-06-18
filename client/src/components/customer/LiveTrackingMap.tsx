import { mapStyles } from "@/styles/mapStyles";
import { Colors } from "@/utils/Constants";
import { customMapStyle, indiaIntialRegion } from "@/utils/CustomMap";
import { getPoints } from "@/utils/mapUtils";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { FC, memo, useEffect, useRef, useState } from "react";
import { Image, TouchableOpacity, View } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import { RFValue } from "react-native-responsive-fontsize";

const LiveTrackingMap: FC<{
  height: number;
  drop: any;
  pickup: any;
  rider: any;
  status: string;
}> = ({ drop, height, pickup, status, rider }) => {
  const mapRef = useRef<MapView>(null);
  const [isUserInteracting, setIsUserInteracting] = useState(false);

  const fitToMarkers = async () => {
    if (isUserInteracting) return;

    const coordinates = [];

    if (pickup.latitude && pickup.longitude && status == "START") {
      coordinates.push({
        latitude: pickup.latitude,
        longitude: pickup.longitude,
      });
    }

    if (drop.latitude && drop.longitude && status == "ARRIVED") {
      coordinates.push({
        latitude: drop.latitude,
        longitude: drop.longitude,
      });
    }

    if (rider.latitude && rider.longitude) {
      coordinates.push({
        latitude: rider.latitude,
        longitude: rider.longitude,
      });
    }

    if (coordinates.length === 0) return;

    try {
      mapRef.current?.fitToCoordinates(coordinates, {
        edgePadding: { top: 50, bottom: 50, left: 50, right: 50 },
        animated: true,
      });
    } catch (error) {
      console.log("Error fitting to markers ", error);
    }
  };

  const calculateInitialRegion = () => {
    if (pickup.latitude && drop.latitude) {
      const latitude = (pickup.latitude + drop.latitude) / 2;
      const longitude = (pickup.longitude + drop.longitude) / 2;

      return {
        latitude,
        longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      };
    }
    return indiaIntialRegion;
  };

  useEffect(() => {
    if (pickup.latitude && drop.latitude) fitToMarkers();
  }, [drop.latitude, pickup.latitude, rider.latitude]);

  return (
    <View style={{ height: height, width: "100%" }}>
      <MapView
        ref={mapRef}
        followsUserLocation
        onRegionChange={() => setIsUserInteracting(true)}
        onRegionChangeComplete={() => setIsUserInteracting(false)}
        style={{ flex: 1 }}
        initialRegion={calculateInitialRegion()}
        provider="google"
        showsMyLocationButton={false}
        showsCompass={false}
        showsIndoors={false}
        showsIndoorLevelPicker={false}
        customMapStyle={customMapStyle}
        showsScale={false}
        showsUserLocation={true}
      >
        {/* 🚗 Rider → Destination Line (REPLACEMENT) */}
        {rider?.latitude &&
          (status === "START" ? pickup?.latitude : drop?.latitude) && (
            <Polyline
              coordinates={[
                {
                  latitude: rider.latitude,
                  longitude: rider.longitude,
                },
                {
                  latitude:
                    status === "START" ? pickup.latitude : drop.latitude,
                  longitude:
                    status === "START" ? pickup.longitude : drop.longitude,
                },
              ]}
              strokeColor={Colors.tertiary}
              strokeWidth={4}
            />
          )}

        {/* 📍 Drop */}
        {drop.latitude && (
          <Marker
            coordinate={{ latitude: drop.latitude, longitude: drop.longitude }}
            anchor={{ x: 0.5, y: 1 }}
            zIndex={1}
          >
            <Image
              source={require("@/assets/icons/drop_marker.png")}
              style={{ height: 30, width: 30, resizeMode: "contain" }}
            />
          </Marker>
        )}

        {/* 📍 Pickup */}
        {pickup.latitude && (
          <Marker
            coordinate={{
              latitude: pickup.latitude,
              longitude: pickup.longitude,
            }}
            anchor={{ x: 0.5, y: 1 }}
            zIndex={2}
          >
            <Image
              source={require("@/assets/icons/marker.png")}
              style={{ height: 30, width: 30, resizeMode: "contain" }}
            />
          </Marker>
        )}

        {/* 🚗 Rider */}
        {rider.latitude && (
          <Marker
            coordinate={{
              latitude: rider.latitude,
              longitude: rider.longitude,
            }}
            anchor={{ x: 0.5, y: 1 }}
            zIndex={3}
          >
            <View style={{ transform: [{ rotate: `${rider.heading}deg` }] }}>
              <Image
                source={require("@/assets/icons/cab_marker.png")}
                style={{ height: 40, width: 40, resizeMode: "contain" }}
              />
            </View>
          </Marker>
        )}

        {/* 📏 Pickup → Drop dashed line */}
        {drop?.latitude && pickup?.latitude && (
          <Polyline
            coordinates={getPoints([drop, pickup])}
            strokeColor={Colors.iosColor}
            strokeWidth={5}
            geodesic={true}
            lineDashPattern={[12, 10]}
          />
        )}
      </MapView>

      <TouchableOpacity style={mapStyles.gpsButton} onPress={fitToMarkers}>
        <MaterialCommunityIcons
          name="crosshairs-gps"
          size={RFValue(16)}
          color="#3C75BE"
        />
      </TouchableOpacity>
    </View>
  );
};

export default memo(LiveTrackingMap);
