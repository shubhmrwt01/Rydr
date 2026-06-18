import RiderHeader from "@/components/rider/RiderHeader";
import RiderRidesItem from "@/components/rider/RiderRidesItem";
import CustomText from "@/components/shared/CustomText";
import { getMyRides } from "@/service/rideService";
import { useWS } from "@/service/WSProvider";
import { useRiderStore } from "@/store/riderStore";
import { homeStyles } from "@/styles/homeStyles";
import { riderStyles } from "@/styles/riderStyles";
import { useFocusEffect } from "expo-router";
import { useCallback } from "react";
import * as Location from "expo-location";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { FlatList, Image, View } from "react-native";
const RiderHome = () => {
  const { emit, on, off } = useWS();
  const { onDuty, setLocation } = useRiderStore();
  const [rideOffers, setRideOffers] = useState<any[]>([]);

  useEffect(() => {
    getMyRides(false);
  }, []);
  useFocusEffect(
    useCallback(() => {
      if (!onDuty) return;

      let locationSubscription: any;

      const startLocationUpdates = async () => {
        const { status } = await Location.requestForegroundPermissionsAsync();

        if (status === "granted") {
          locationSubscription = await Location.watchPositionAsync(
            {
              accuracy: Location.Accuracy.High,
              timeInterval: 10000,
              distanceInterval: 10,
            },
            (location) => {
              const { latitude, longitude, heading } = location.coords;

              setLocation({
                latitude,
                longitude,
                address: "Somewhere",
                heading: heading as number,
              });

              emit("updateLocation", {
                latitude,
                longitude,
                heading,
              });
            },
          );
        }
      };

      startLocationUpdates();

      return () => {
        locationSubscription?.remove();
      };
    }, [onDuty]),
  );
  useFocusEffect(
    useCallback(() => {
      if (!onDuty) return;

      const rideOfferHandler = (rideDetails: any) => {
        setRideOffers((prevOffers) => {
          const existingIds = new Set(prevOffers.map((offer) => offer._id));

          if (!existingIds.has(rideDetails?._id)) {
            return [...prevOffers, rideDetails];
          }

          return prevOffers;
        });
      };

      on("rideOffer", rideOfferHandler);

      return () => {
        off("rideOffer");
      };
    }, [onDuty, on, off]),
  );

  const removeRide = (id: string) => {
    setRideOffers((prevOffers) =>
      prevOffers.filter((offer) => offer?._id !== id),
    );
  };

  const renderRides = ({ item }: any) => {
    return (
      <RiderRidesItem removeIt={() => removeRide(item?._id)} item={item} />
    );
  };
  return (
    <View style={homeStyles.container}>
      <StatusBar style="light" />
      <RiderHeader />
      <FlatList
        data={!onDuty ? [] : rideOffers}
        renderItem={renderRides}
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 10, paddingBottom: 120 }}
        keyExtractor={(item: any) => item?._id || Math.random().toString()}
        ListEmptyComponent={
          <View style={riderStyles.emptyContainer}>
            <Image
              source={require("@/assets/icons/ride.png")}
              style={riderStyles.emptyImage}
            />
            <CustomText
              fontSize={12}
              style={{ textAlign: "center", color: "#aeabab" }}
            >
              {onDuty
                ? "There are no available rides! Stay Active"
                : "You're currently OFF-DUTY, please go ON-DUTY to start earning"}
            </CustomText>
          </View>
        }
      />
    </View>
  );
};

export default RiderHome;
