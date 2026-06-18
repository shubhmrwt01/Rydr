import LiveTrackingMap from "@/components/customer/LiveTrackingMap";
import LiveTrackingSheet from "@/components/customer/LiveTrackingSheet";
import SearchingRideSheet from "@/components/customer/SearchingRideSheet";
import CustomText from "@/components/shared/CustomText";
import { useWS } from "@/service/WSProvider";
import { homeStyles } from "@/styles/homeStyles";
import { rideStyles } from "@/styles/rideStyles";
import { Colors, screenHeight } from "@/utils/Constants";
import { resetAndNavigate } from "@/utils/Helpers";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";

import { ActivityIndicator, Alert, Platform, View } from "react-native";

const androidHeights = [
  screenHeight * 0.16,
  screenHeight * 0.42,
  screenHeight * 0.78,
];

const iosHeights = [
  screenHeight * 0.18,
  screenHeight * 0.5,
  screenHeight * 0.8,
];

const LiveRide = () => {
  const { emit, on, off } = useWS();
  const searchExpiredRef = useRef(false);
  const [rideData, setRideData] = useState<any>(null);

  const [riderCoords, setRiderCoords] = useState<any>(null);

  const { id } = useLocalSearchParams<{ id: string }>();
  const [timeLeft, setTimeLeft] = useState(60);

  const bottomSheetRef = useRef(null);

  const snapPoints = useMemo(
    () => (Platform.OS === "ios" ? iosHeights : androidHeights),
    [],
  );

  const [mapHeight, setMapHeight] = useState(screenHeight * 0.58);

  const handleSheetChanges = useCallback((index: number) => {
    if (index === 0) {
      setMapHeight(screenHeight * 0.84);
    } else if (index === 1) {
      setMapHeight(screenHeight * 0.58);
    } else {
      setMapHeight(screenHeight * 0.35);
    }
  }, []);

  useEffect(() => {
    if (id) {
      emit("subscribeRide", id);

      on("rideData", (data) => {
        setRideData(data);

        if (data.status === "SEARCHING_FOR_RIDER") {
          searchExpiredRef.current = false;

          emit("searchrider", id);
        }
      });

      on("rideUpdate", (data) => {
        setRideData(data);
      });

      on("rideCanceled", () => {
        resetAndNavigate("/customer/home");

        if (!searchExpiredRef.current) {
          Alert.alert("Ride Canceled");
        }
      });

      on("error", () => {
        resetAndNavigate("/customer/home");

        Alert.alert("Oh Dang! No Riders found");
      });
    }

    return () => {
      off("rideData");
      off("rideUpdate");
      off("rideCanceled");
      off("error");
    };
  }, [id]);

  useEffect(() => {
    if (rideData?.rider?._id) {
      emit("subscribeToriderLocation", rideData.rider._id);

      on("riderLocationUpdate", (data) => {
        setRiderCoords(data.coords);
      });
    }

    return () => {
      off("riderLocationUpdate");
    };
  }, [rideData]);

  useEffect(() => {
    if (!rideData || rideData.status !== "SEARCHING_FOR_RIDER") {
      setTimeLeft(60);
      return;
    }

    const rideId = rideData._id;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);

          searchExpiredRef.current = true;

          emit("cancelRide", rideId);

          Alert.alert(
            "No Riders Found",
            "We couldn't find a rider nearby. Please try again.",
            [
              {
                text: "OK",
                onPress: () => resetAndNavigate("/customer/home"),
              },
            ],
          );

          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [rideData?._id, rideData?.status]);

  return (
    <View style={rideStyles.container}>
      <StatusBar style="light" />

      {rideData && (
        <LiveTrackingMap
          height={mapHeight}
          status={rideData.status}
          drop={{
            latitude: parseFloat(rideData.drop.latitude),

            longitude: parseFloat(rideData.drop.longitude),
          }}
          pickup={{
            latitude: parseFloat(rideData.pickup.latitude),

            longitude: parseFloat(rideData.pickup.longitude),
          }}
          rider={
            riderCoords
              ? {
                  latitude: riderCoords.latitude,

                  longitude: riderCoords.longitude,

                  heading: riderCoords.heading,
                }
              : {}
          }
        />
      )}

      {rideData ? (
        <BottomSheet
          ref={bottomSheetRef}
          index={1}
          handleComponent={() => null}
          enableOverDrag={false}
          topInset={0}
          enableDynamicSizing={false}
          backgroundStyle={{
            backgroundColor: Colors.lightBg,
            borderTopLeftRadius: 15,
            borderTopRightRadius: 15,
          }}
          snapPoints={snapPoints}
          onChange={handleSheetChanges}
        >
          <BottomSheetScrollView
            contentContainerStyle={{
              ...homeStyles.scrollContainer,
              paddingTop: 0,
            }}
            nestedScrollEnabled={true}
            showsVerticalScrollIndicator={false}
            style={{
              backgroundColor: Colors.lightBg,
              borderTopLeftRadius: 15,
              borderTopRightRadius: 15,
              overflow: "hidden",
            }}
          >
            {rideData.status === "SEARCHING_FOR_RIDER" ? (
              <SearchingRideSheet item={rideData} timeLeft={timeLeft} />
            ) : (
              <LiveTrackingSheet item={rideData} />
            )}
          </BottomSheetScrollView>
        </BottomSheet>
      ) : (
        <View
          style={{
            flex: 1,
            justifyContent: "center",

            alignItems: "center",
          }}
        >
          <CustomText
            style={{
              color: "white",
            }}
            variant="h8"
          >
            Fetching ride...
          </CustomText>

          <ActivityIndicator color="white" size="small" />
        </View>
      )}
    </View>
  );
};

export default memo(LiveRide);
