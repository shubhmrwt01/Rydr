import { commonStyles } from "@/styles/commonStyles";
import { orderStyles } from "@/styles/riderStyles";
import { rideStyles } from "@/styles/rideStyles";
import { Colors } from "@/utils/Constants";
import { Ionicons } from "@expo/vector-icons";
import { FC } from "react";
import { View } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import SwipeButton from "rn-swipe-button";
import CustomText from "../shared/CustomText";
const RiderActionButton: FC<{
  ride: any;
  color?: string;
  title: string;
  onPress: () => void;
}> = ({ ride, color = Colors.wtext, title, onPress }) => {
  const checkOutButton = () => (
    <Ionicons
      name="arrow-forward-sharp"
      size={32}
      style={{ bottom: 2 }}
      color={"#000"}
    />
  );
  return (
    <View style={rideStyles.swipeableContaninerRider}>
      <View style={commonStyles.flexRowBetween}>
        <CustomText
          fontFamily="Medium"
          fontSize={11}
          style={{ marginTop: 10, marginBottom: 3 }}
          numberOfLines={1}
        >
          Meet the Customer
        </CustomText>
        <CustomText
          fontFamily="Medium"
          fontSize={11}
          style={{ marginTop: 10, marginBottom: 3 }}
          numberOfLines={1}
        >
          +91{" "}
          {ride?.customer?.phone &&
            ride?.customer?.phone?.slice(0, 5) +
              " " +
              ride?.customer?.phone?.slice(5)}
        </CustomText>
      </View>
      <View style={orderStyles.locationsContainer}>
        <View style={orderStyles.flexRowBase}>
          <View>
            <View style={orderStyles.pickupHollowCircle} />
            <View style={orderStyles.continuousLine} />
          </View>
          <View style={orderStyles.infoText}>
            <CustomText fontFamily="SemiBold" fontSize={11} numberOfLines={1}>
              {ride?.pickup?.address.split(",")[0]}
            </CustomText>
            <CustomText
              numberOfLines={2}
              fontFamily="Medium"
              fontSize={9.5}
              style={orderStyles.label}
            >
              {ride?.pickup?.address}
            </CustomText>
          </View>
        </View>

        <View style={orderStyles.flexRowBase}>
          <View>
            <View style={orderStyles.dropHollowCircle} />
            <View style={orderStyles.continuousLine} />
          </View>
          <View style={orderStyles.infoText}>
            <CustomText fontFamily="SemiBold" fontSize={11} numberOfLines={1}>
              {ride?.drop?.address.split(",")[0]}
            </CustomText>
            <CustomText
              numberOfLines={2}
              fontFamily="Medium"
              fontSize={9.5}
              style={orderStyles.label}
            >
              {ride?.drop?.address}
            </CustomText>
          </View>
        </View>
      </View>
      <SwipeButton
        containerStyles={rideStyles.swipeButtonContainer}
        height={30}
        shouldResetAfterSuccess={true}
        resetAfterSuccessAnimDelay={200}
        onSwipeSuccess={onPress}
        railBackgroundColor={color}
        railStyles={rideStyles.railStyles}
        railBorderColor="transparent"
        railFillBackgroundColor="rgba(255,255,255,0.6)"
        railFillBorderColor="rgba(255,255,255,0.6)"
        titleColor="#fff"
        titleFontSize={RFValue(13)}
        titleStyles={rideStyles.titleStyles}
        thumbIconComponent={checkOutButton}
        thumbIconStyles={rideStyles.thumbIconStyles}
        title={title.toUpperCase()}
        thumbIconBackgroundColor="transparent"
        thumbIconBorderColor="transparent"
        thumbIconHeight={50}
        thumbIconWidth={60}
      />
    </View>
  );
};

export default RiderActionButton;
