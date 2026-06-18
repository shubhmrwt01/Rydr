import { logout } from "@/service/authService";
import { useWS } from "@/service/WSProvider";
import { useUserStore } from "@/store/userStore";
import { uiStyles } from "@/styles/uiStyles";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { TouchableOpacity, View } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomText from "../shared/CustomText";
const LocationBar = () => {
  const { location } = useUserStore();
  const { disconnect } = useWS();
  return (
    <View style={uiStyles.absoluteTop}>
      <SafeAreaView />
      <View style={uiStyles.container}>
        <TouchableOpacity
          style={uiStyles.btn}
          onPress={() => logout(disconnect)}
        >
          <MaterialIcons name="logout" size={RFValue(14)} color="black" />
        </TouchableOpacity>
        <TouchableOpacity
          style={uiStyles.locationBar}
          onPress={() => router.navigate("/customer/selectlocations")}
        >
          <View style={uiStyles.dot} />
          <CustomText numberOfLines={1} style={uiStyles.locationText}>
            {location?.address
              ? location.address
              : location?.latitude
                ? "Fetching address..."
                : "Getting location..."}
          </CustomText>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LocationBar;
