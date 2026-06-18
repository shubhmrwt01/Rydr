import CustomButton from "@/components/shared/CustomButton";
import CustomText from "@/components/shared/CustomText";
import PhoneInput from "@/components/shared/PhoneInput";
import { signin } from "@/service/authService";
import { useWS } from "@/service/WSProvider";
import { authStyles } from "@/styles/authStyles";
import { commonStyles } from "@/styles/commonStyles";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React, { useState } from "react";
import { Alert, Image, Pressable, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
const Auth = () => {
  const { updateAccessToken } = useWS();
  const [phone, setPhone] = useState("");
  const handleNext = async () => {
    if (!phone || phone.length != 10) {
      Alert.alert("Please enter valid phone number");
      return;
    }
    signin({ role: "customer", phone }, updateAccessToken);
  };
  return (
    <SafeAreaView style={authStyles.container}>
      <ScrollView contentContainerStyle={authStyles.container}>
        <View style={commonStyles.flexRowBetween}>
          <Image
            source={require("@/assets/images/logo_t.png")}
            style={authStyles.logo}
          />
          <Pressable style={authStyles.flexRowGap}>
            <MaterialIcons name="help" size={20} color="grey" />
            <CustomText fontFamily="Medium" variant="h7">
              Help
            </CustomText>
          </Pressable>
        </View>
        <CustomText fontFamily="Medium" variant="h6">
          What's your number?
        </CustomText>
        <CustomText
          fontFamily="Regular"
          variant="h7"
          style={commonStyles.lightText}
        >
          Enter your phone number to proceed
        </CustomText>
        <PhoneInput onChangeText={setPhone} value={phone} />
      </ScrollView>
      <View style={authStyles.footerContainer}>
        <CustomText
          variant="h8"
          fontFamily="Regular"
          style={[
            commonStyles.lightText,
            { textAlign: "center", marginHorizontal: 4 },
          ]}
        >
          By continuing, you agree to the terms and privacy policy of Rydr
        </CustomText>
        <CustomButton
          title="Next"
          onPress={handleNext}
          loading={false}
          disabled={false}
        />
      </View>
    </SafeAreaView>
  );
};

export default Auth;
