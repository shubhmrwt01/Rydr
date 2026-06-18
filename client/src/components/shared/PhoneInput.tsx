import { PhoneInputProps } from "@/utils/types";
import React, { FC } from "react";
import { StyleSheet, TextInput, View } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import CustomText from "./CustomText";

const PhoneInput: FC<PhoneInputProps> = ({
  value,
  onChangeText,
  onBlur,
  onFocus,
}) => {
  return (
    <View style={styles.container}>
      <CustomText fontFamily="Medium" style={styles.text}>
        🇮🇳+91
      </CustomText>
      <TextInput
        placeholder="0000000000"
        keyboardType="phone-pad"
        value={value}
        maxLength={10}
        onChangeText={onChangeText}
        onFocus={onFocus}
        onBlur={onBlur}
        placeholderTextColor={"#ccc"}
        style={styles.input}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginVertical: 16,
    borderWidth: 1,
    borderColor: "#d0d0d0",
    borderRadius: 0,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },

  input: {
    fontSize: RFValue(13),
    fontFamily: "Medium",
    height: 45,
    width: "90%",
    color: "#d0d0d0",
  },

  text: {
    fontSize: RFValue(13),
    top: -1,
    fontFamily: "Medium",
    color: "#fff",
  },
});

export default PhoneInput;
