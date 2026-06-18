import OtpInputModal from "@/components/rider/OtpInputModal";
import RideLiveTracking from "@/components/rider/RideLiveTracking";
import RiderActionButton from "@/components/rider/RiderActionButton";
import { updateRideStatus } from "@/service/rideService";
import { useWS } from "@/service/WSProvider";
import { useRiderStore } from "@/store/riderStore";
import { rideStyles } from "@/styles/rideStyles";
import { resetAndNavigate } from "@/utils/Helpers";
import { useLocalSearchParams } from "expo-router";
import * as Location from "expo-location";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { Alert, View } from "react-native";
const LiveRide = () => {
  const [isOtpVisible, setIsOtpVisible] = useState(false);
  const { location, setOnDuty, setLocation } = useRiderStore();
  const { emit, on, off } = useWS();
  const [rideData, setRideData] = useState<any>(null);
  const { id } = useLocalSearchParams<{ id: string }>();

  useEffect(() => {
    let locationSubscription: any;
    const startLocationUpdates = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status == "granted") {
        locationSubscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            timeInterval: 5000,
            distanceInterval: 200,
          },
          (location) => {
            const { latitude, longitude, heading } = location.coords;
            setLocation({
              latitude: latitude,
              longitude: longitude,
              address: "Somewhere",
              heading: heading as number,
            });
            setOnDuty(true);
            emit("goOnDuty", {
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              heading: heading as number,
            });
            emit("updateLocation", {
              latitude,
              longitude,
              heading,
            });
            console.log(
              `Location updated: Lat ${latitude},Lon ${longitude}, Heading: ${heading}`,
            );
          },
        );
      } else {
        console.log("Location permission denied");
      }
    };
    startLocationUpdates();
    return () => {
      if (locationSubscription) {
        locationSubscription.remove();
      }
    };
  }, [id]);

  useEffect(() => {
    if (id) {
      emit("subscribeRide", id);

      on("rideData", (data) => {
        setRideData(data);
      });

      on("rideCanceled", (error) => {
        console.log("Ride error:", error);
        resetAndNavigate("/rider/home");
        Alert.alert("Ride Canceled");
      });

      on("rideUpdate", (data) => {
        setRideData(data);
      });

      on("error", (error) => {
        console.log("Ride error", error);
        resetAndNavigate("/rider/home");
        Alert.alert("Oh Dang! There was an error");
      });
    }
    return () => {
      off("rideData");
      off("error");
    };
  }, [id, emit, on, off]);

  return (
    <View style={rideStyles.container}>
      <StatusBar style="light" />
      {rideData && (
        <RideLiveTracking
          status={rideData?.status}
          drop={{
            latitude: parseFloat(rideData?.drop.latitude),
            longitude: parseFloat(rideData?.drop.longitude),
          }}
          pickup={{
            latitude: parseFloat(rideData?.pickup.latitude),
            longitude: parseFloat(rideData?.pickup.longitude),
          }}
          rider={{
            latitude: location?.latitude,
            longitude: location?.longitude,
          }}
        />
      )}
      <RiderActionButton
        ride={rideData}
        title={
          rideData?.status == "START"
            ? "ARRIVED"
            : rideData?.status == "ARRIVED"
              ? "COMPLETED"
              : "SUCCESS"
        }
        onPress={async () => {
          if (rideData?.status == "START") {
            setIsOtpVisible(true);
            return;
          }
          const isSuccesss = await updateRideStatus(rideData?._id, "COMPLETED");
          if (isSuccesss) {
            Alert.alert("Congralutions! you rock🎉");
            resetAndNavigate("/rider/home");
          } else {
            Alert.alert("There was an error");
          }
        }}
        color="#228B22"
      />

      {isOtpVisible && (
        <OtpInputModal
          visible={isOtpVisible}
          onClose={() => setIsOtpVisible(false)}
          title="Enter OTP Below"
          onConfirm={async (otp) => {
            if (otp == rideData?.otp) {
              const isSuccess = await updateRideStatus(
                rideData?._id,
                "ARRIVED",
              );
              if (isSuccess) {
                setIsOtpVisible(false);
              } else {
                Alert.alert("Technical Error");
              }
            } else {
              Alert.alert("Wrong OTP");
            }
          }}
        />
      )}
    </View>
  );
};

export default LiveRide;
