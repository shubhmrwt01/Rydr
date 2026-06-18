import RoutesMap from "@/components/customer/RoutesMap";
import CustomButton from "@/components/shared/CustomButton";
import CustomText from "@/components/shared/CustomText";
import { createRide } from "@/service/rideService";
import { useUserStore } from "@/store/userStore";
import { commonStyles } from "@/styles/commonStyles";
import { rideStyles } from "@/styles/rideStyles";
import { calculateFare } from "@/utils/mapUtils";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { memo, useCallback, useMemo, useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

const RideBooking = () => {
  const item = useLocalSearchParams<any>();
  const { location } = useUserStore() as any;
  const [selectedOption, setSelectedOption] = useState("Bike");
  const [loading, setLoading] = useState(false);

  const farePrices = useMemo(
    () => calculateFare(parseFloat(item?.distanceInKm)),
    [item?.distanceInKm],
  );

  const rideOption = useMemo(
    () => [
      {
        type: "Bike",
        seats: 1,
        time: "1 min",
        dropTime: "4:28 pm",
        price: farePrices?.bike,
        isFastest: true,
        icon: require("@/assets/icons/bike.png"),
      },
      {
        type: "Auto",
        seats: 3,
        time: "1 min",
        dropTime: "4:30 pm",
        price: farePrices?.auto,
        icon: require("@/assets/icons/auto.png"),
      },
      {
        type: "Cab Economy",
        seats: 4,
        time: "1 min",
        dropTime: "4:28 pm",
        price: farePrices?.cabEconomy,
        icon: require("@/assets/icons/cab.png"),
      },
      {
        type: "Cab Premium",
        seats: 4,
        time: "1 min",
        dropTime: "4:30 pm",
        price: farePrices?.cabPremium,
        isFastest: true,
        icon: require("@/assets/icons/cab_premium.png"),
      },
    ],
    [farePrices],
  );

  const handleOptionSelect = useCallback((type: string) => {
    setSelectedOption(type);
  }, []);
  const handleRideBooking = async () => {
    setLoading(true);

    await createRide({
      vehicle:
        selectedOption == "Cab Economy"
          ? "cabEconomy"
          : selectedOption == "Cab Premium"
            ? "cabPremium"
            : selectedOption == "Bike"
              ? "bike"
              : "auto",
      drop: {
        latitude: parseFloat(item.drop_latitude),
        longitude: parseFloat(item.drop_longitude),
        address: item?.drop_address,
      },
      pickup: {
        latitude: parseFloat(location.latitude),
        longitude: parseFloat(location.longitude),
        address: location.address,
      },
    });

    setLoading(false);
  };

  return (
    <View style={rideStyles.container}>
      <StatusBar style="light" />
      {item?.drop_latitude && location.latitude && (
        <RoutesMap
          drop={{
            latitude: parseFloat(item.drop_latitude),
            longitude: parseFloat(item.drop_longitude),
          }}
          pickup={{
            latitude: parseFloat(location.latitude),
            longitude: parseFloat(location.longitude),
            address: location.address,
          }}
        />
      )}
      <View style={rideStyles.rideSelectionContainer}>
        <View style={rideStyles.offerContainer}>
          <CustomText fontSize={12} style={rideStyles.offerText}>
            You can get ₹10 off 5 coins caashback
          </CustomText>
        </View>
        <ScrollView
          contentContainerStyle={rideStyles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          {rideOption.map((ride, index) => (
            <RideOption
              key={index}
              ride={ride}
              selected={selectedOption}
              onSelect={handleOptionSelect}
            />
          ))}
        </ScrollView>
      </View>
      <TouchableOpacity
        style={rideStyles.backButton}
        onPress={() => router.back()}
      >
        <MaterialIcons
          name="arrow-back-ios"
          size={RFValue(14)}
          style={{ left: 4 }}
          color="black"
        />
      </TouchableOpacity>
      <View style={rideStyles.bookingContainer}>
        <View style={commonStyles.flexRowBetween}>
          <View
            style={[
              rideStyles.couponContainer,
              { borderRightWidth: 1, borderRightColor: "#ccc" },
            ]}
          >
            <Image
              source={require("@/assets/icons/rupee.png")}
              style={rideStyles.icon}
            />
            <View>
              <CustomText
                style={{ color: "#000" }}
                fontFamily="Medium"
                fontSize={12}
              >
                Cash
              </CustomText>
              <CustomText
                fontFamily="Medium"
                fontSize={10}
                style={{ opacity: 0.7, color: "#000" }}
              >
                Far: {item.distanceInKm} KM
              </CustomText>
            </View>
            <Ionicons name="chevron-forward" size={RFValue(14)} color="#777" />
          </View>

          <View style={rideStyles.couponContainer}>
            <Image
              source={require("@/assets/icons/coupon.png")}
              style={rideStyles.icon}
            />
            <View>
              <CustomText
                style={{ color: "#000" }}
                fontFamily="Medium"
                fontSize={12}
              >
                RYDY10
              </CustomText>
              <CustomText
                fontFamily="Medium"
                fontSize={10}
                style={{ opacity: 0.7, color: "#000" }}
              >
                Coupon Applied
              </CustomText>
            </View>
            <Ionicons name="chevron-forward" size={RFValue(14)} color="#777" />
          </View>
        </View>

        <CustomButton
          title="Book Ride"
          disabled={loading}
          loading={loading}
          onPress={handleRideBooking}
        />
      </View>
    </View>
  );
};

const RideOption = memo(({ ride, selected, onSelect }: any) => (
  <TouchableOpacity
    onPress={() => onSelect(ride.type)}
    style={[
      rideStyles.rideOption,
      selected === ride.type && rideStyles.selectedRide,
    ]}
  >
    <View style={commonStyles.flexRowBetween}>
      <Image source={ride.icon} style={rideStyles.rideIcon} />

      <View style={rideStyles.rideDetails}>
        <CustomText style={{ color: "#000" }} fontFamily="Medium" fontSize={12}>
          {ride?.type}
          {ride.isFastest && (
            <Text style={rideStyles.fastestLabel}> FASTEST</Text>
          )}
        </CustomText>
        <CustomText style={{ color: "#000" }} fontSize={10}>
          {ride?.seats} seats • {ride.time} away • Drop {ride.dropTime}
        </CustomText>
      </View>
      <View style={rideStyles.priceContainer}>
        <CustomText style={{ color: "#000" }} fontFamily="Medium" fontSize={14}>
          ₹{ride.price.toFixed(2)}
        </CustomText>
        {selected == ride.type && (
          <Text style={rideStyles.discountedPrice}>
            ₹{Number(ride.price + 10).toFixed(2)}
          </Text>
        )}
      </View>
    </View>
  </TouchableOpacity>
));

export default memo(RideBooking);
