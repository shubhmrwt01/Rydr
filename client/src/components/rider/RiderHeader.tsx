import { logout } from "@/service/authService";
import { useWS } from "@/service/WSProvider";
import { useRiderStore } from "@/store/riderStore";
import { commonStyles } from "@/styles/commonStyles";
import { riderStyles } from "@/styles/riderStyles";
import { MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
import * as Location from "expo-location";
import { useCallback } from "react";
import { Alert, Image, Pressable, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomText from "../shared/CustomText";
const RiderHeader = () => {
  const { disconnect, emit } = useWS();
  const { setOnDuty, onDuty, setLocation } = useRiderStore();

  const toggleOnDuty = async () => {
    if (onDuty) {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status != "granted") {
        Alert.alert(
          "Permission Denied",
          "Location permission is required to go on duty",
        );
        return;
      }
      const location = await Location.getCurrentPositionAsync();
      const { latitude, longitude, heading } = location.coords;
      setLocation({
        latitude: latitude,
        longitude: longitude,
        address: "Somewhere",
        heading: heading as number,
      });
      emit("goOnDuty", {
        latitude: location?.coords?.latitude,
        longitude: location?.coords?.longitude,
        heading: heading,
      });
    } else {
      emit("goOffDuty");
    }
  };

  useFocusEffect(
    useCallback(() => {
      toggleOnDuty();
    }, [onDuty]),
  );

  return (
    <>
      <View style={riderStyles.headerContainer}>
        <SafeAreaView />
        <View style={commonStyles.flexRowBetween}>
          <MaterialIcons
            name="logout"
            size={24}
            color="black"
            onPress={() => logout(disconnect)}
          />
          <Pressable
            style={riderStyles.toggleContainer}
            onPress={() => setOnDuty(!onDuty)}
          >
            <CustomText
              fontFamily="SemiBold"
              fontSize={12}
              style={{ color: "#888" }}
            >
              {onDuty ? "ON-DUTY" : "OFF-DUTY"}
            </CustomText>
            <Image
              source={
                onDuty
                  ? require("@/assets/icons/switch_on.png")
                  : require("@/assets/icons/switch_off.png")
              }
              style={riderStyles.icon}
            />
          </Pressable>
          <MaterialIcons name="notifications" size={24} color="black" />
        </View>
      </View>
      <View style={riderStyles.earningContainer}>
        <CustomText fontSize={13} fontFamily="Medium" style={{ color: "#fff" }}>
          Today's Earning
        </CustomText>
        <View style={commonStyles.flexRowGap}>
          <CustomText fontFamily="Medium" style={{ color: "#fff" }}>
            ₹ 14231.22
          </CustomText>
          <MaterialIcons name="arrow-drop-down" size={24} color="#fff" />
        </View>
      </View>
    </>
  );
};

export default RiderHeader;
