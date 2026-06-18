import CustomText from "@/components/shared/CustomText";
import { roleStyles } from "@/styles/roleStyles";
import { router } from "expo-router";
import React from "react";
import { Image, TouchableOpacity, View } from "react-native";

const Role = () => {
  const handleCustomerPress = () => {
    router.navigate("/customer/auth");
  };
  const handleRiderPress = () => {
    router.navigate("/rider/auth");
  };
  return (
    <View style={roleStyles.container}>
      <Image
        source={require("@/assets/images/logo_t.png")}
        style={roleStyles.logo}
      />
      <CustomText fontFamily="Bold" variant="h5" style={roleStyles.text}>
        Choose your user type
      </CustomText>
      <TouchableOpacity style={roleStyles.card} onPress={handleCustomerPress}>
        <Image
          source={require("@/assets/images/customer.jpg")}
          style={roleStyles.image}
        />
        <View style={roleStyles.cardContent}>
          <CustomText style={roleStyles.title}>Customer</CustomText>
          <CustomText style={roleStyles.description}>
            Are you a customer? Order rides and deliveries easily.
          </CustomText>
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={roleStyles.card} onPress={handleRiderPress}>
        <Image
          source={require("@/assets/images/rider.jpg")}
          style={roleStyles.image}
        />
        <View style={roleStyles.cardContent}>
          <CustomText style={roleStyles.title}>Rider</CustomText>
          <CustomText style={roleStyles.description}>
            Are you a Rider? Join us to drive and deliver.
          </CustomText>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default Role;
