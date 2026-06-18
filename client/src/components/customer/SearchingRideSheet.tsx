import { useWS } from "@/service/WSProvider";
import { commonStyles } from "@/styles/commonStyles";
import { rideStyles } from "@/styles/rideStyles";
import { vehicleIcons } from "@/utils/mapUtils";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { FC } from "react";
import { ActivityIndicator, Image, TouchableOpacity, View } from "react-native";
import CustomText from "../shared/CustomText";

type VehicleType = "bike" | "auto" | "cabEconomy" | "cabPremium";
interface Props {
  item: RideItem;
  timeLeft: number;
}

interface RideItem {
  vehicle: VehicleType;
  _id: string;
  pickup: {
    address: string;
  };
  drop: {
    address: string;
  };
  fare: number;
}

const SearchingRideSheet: FC<Props> = ({ item, timeLeft }) => {
  const { emit } = useWS();

  return (
    <View>
      <View style={rideStyles.headerContainer}>
        <View style={commonStyles.flexRowBetween}>
          {item?.vehicle && (
            <Image
              source={vehicleIcons[item.vehicle]?.icon}
              style={rideStyles.rideIcon}
            />
          )}
          <View style={{ marginLeft: 10 }}>
            <CustomText style={{ color: "white" }} fontSize={10}>
              Looking for you{" "}
            </CustomText>
            <CustomText style={{ color: "white" }} fontFamily="Medium">
              {item.vehicle} ride{" "}
            </CustomText>
          </View>
        </View>
        <View style={{ alignItems: "center" }}>
          <View style={{ alignItems: "center" }}>
            <ActivityIndicator color="white" size="small" />

            <CustomText
              fontSize={10}
              style={{
                color: timeLeft <= 10 ? "#ff6b6b" : "white",
                marginTop: 4,
              }}
            >
              Finding rider... {timeLeft}s
            </CustomText>
          </View>
        </View>
      </View>
      <View style={{ padding: 10 }}>
        <CustomText
          style={{ color: "white" }}
          fontFamily="SemiBold"
          fontSize={12}
        >
          Location Details
        </CustomText>
        <View
          style={[
            commonStyles.flexRowGap,
            {
              marginVertical: 15,
              width: "100%",
            },
          ]}
        >
          <Image
            source={require("@/assets/icons/marker.png")}
            style={rideStyles.pinIcon}
          />
          <CustomText
            style={{
              color: "white",
              flex: 1,
              flexWrap: "wrap",
            }}
            fontSize={10}
          >
            {item.pickup.address}
          </CustomText>
        </View>
        <View style={[commonStyles.flexRowGap, { width: "90%" }]}>
          <Image
            source={require("@/assets/icons/drop_marker.png")}
            style={rideStyles.pinIcon}
          />
          <CustomText
            style={{
              color: "white",
              flex: 1,
              flexWrap: "wrap",
            }}
            fontSize={10}
          >
            {item.drop.address}
          </CustomText>
        </View>
        <View style={{ marginVertical: 20 }}>
          <View style={[commonStyles.flexRowBetween]}>
            <View style={[commonStyles.flexRow]}>
              <MaterialCommunityIcons
                name="credit-card"
                size={24}
                color="white"
              />
              <CustomText
                style={{ color: "white", marginLeft: 10 }}
                fontFamily="SemiBold"
                fontSize={12}
              >
                Payment
              </CustomText>
            </View>
            <CustomText
              style={{ color: "white" }}
              fontFamily="SemiBold"
              fontSize={14}
            >
              ₹{item.fare.toFixed(2)}
            </CustomText>
          </View>
          <CustomText style={{ color: "white" }} fontSize={10}>
            Payment via cash
          </CustomText>
        </View>
      </View>
      <View style={rideStyles.bottomButtonContainer}>
        <TouchableOpacity
          style={rideStyles.cancelButton}
          onPress={() => {
            emit("cancelRide", item._id);
          }}
        >
          <CustomText
            fontSize={14}
            fontFamily="SemiBold"
            style={rideStyles.cancelButtonText}
          >
            Cancel
          </CustomText>
        </TouchableOpacity>
        <TouchableOpacity
          style={rideStyles.backBtn}
          onPress={() => router.back()}
        >
          <CustomText
            fontSize={14}
            fontFamily="SemiBold"
            style={rideStyles.backBtnText}
          >
            Back
          </CustomText>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SearchingRideSheet;
