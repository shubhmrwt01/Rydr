import { commonStyles } from "@/styles/commonStyles";
import { uiStyles } from "@/styles/uiStyles";
import { Colors } from "@/utils/Constants";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import CustomText from "../shared/CustomText";
const cubes = [
  { name: "Bike", imageUrl: require("@/assets/icons/bike.png") },
  { name: "Auto", imageUrl: require("@/assets/icons/auto.png") },
  { name: "Cab Economy", imageUrl: require("@/assets/icons/cab.png") },
  { name: "Parcel", imageUrl: require("@/assets/icons/parcel.png") },
  { name: "Cab Premium", imageUrl: require("@/assets/icons/cab_premium.png") },
];
export default function SheetContent() {
  return (
    <View
      style={{
        height: "100%",
        backgroundColor: Colors.lightBg,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        overflow: "hidden", // 🔥 REQUIRED
        marginTop: 0, // ❌ remove this
      }}
    >
      <TouchableOpacity
        style={uiStyles.searchBarContainer}
        onPress={() => router.navigate("/customer/selectlocations")}
      >
        <Ionicons name="search-outline" size={RFValue(16)} color="black" />
        <CustomText style={{ color: "#000" }} fontFamily="Medium" fontSize={11}>
          Where are you going?
        </CustomText>
      </TouchableOpacity>
      <View style={commonStyles.flexRowBetween}>
        <CustomText
          style={{ color: "#fff", paddingLeft: 4 }}
          fontFamily="Regular"
          fontSize={10}
        >
          Explore
        </CustomText>
        <TouchableOpacity style={commonStyles.flexRow}>
          <CustomText
            style={{ color: "#fff" }}
            fontFamily="Regular"
            fontSize={10}
          >
            View All
          </CustomText>
          <Ionicons name="chevron-forward" size={RFValue(14)} color="#fff" />
        </TouchableOpacity>
      </View>
      <View style={uiStyles.cubes}>
        {cubes?.slice(0, 4).map((item, index) => (
          <TouchableOpacity
            style={uiStyles.cubeContainer}
            key={index}
            onPress={() => router.navigate("/customer/selectlocations")}
          >
            <View style={uiStyles.cubeIconContainer}>
              <Image source={item?.imageUrl} style={uiStyles.cubeIcon} />
            </View>
            <CustomText
              fontFamily="Medium"
              fontSize={9.5}
              style={{ textAlign: "center", color: "#fff" }}
            >
              {item?.name}
            </CustomText>
          </TouchableOpacity>
        ))}
      </View>
      <View style={uiStyles.adSection}>
        <Image
          source={require("@/assets/images/ad_banner.png")}
          style={uiStyles.adImage}
        />
      </View>
      <View style={uiStyles.bannerContainer}>
        <Image
          source={require("@/assets/icons/footer.png")}
          style={uiStyles.banner}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({});
