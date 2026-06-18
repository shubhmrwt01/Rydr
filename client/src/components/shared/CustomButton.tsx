import { Colors } from "@/utils/Constants";
import { CustomButtonProps } from "@/utils/types";
import { FC } from "react";
import { ActivityIndicator, StyleSheet, TouchableOpacity } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import CustomText from "./CustomText";

const CustomButton: FC<CustomButtonProps> = ({
  onPress,
  title,
  loading,
  disabled,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={[
        styles.container,
        { backgroundColor: disabled ? Colors.secondary : Colors.primary },
      ]}
    >
      {loading ? (
        <ActivityIndicator color="white" size="small" />
      ) : (
        <CustomText
          fontFamily="SemiBold"
          style={{
            fontSize: RFValue(14),
            color: disabled ? "#6B7280" : "#000",
          }}
        >
          {title}
        </CustomText>
      )}
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    margin: 10,
    padding: 10,
    height: 45,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
});
export default CustomButton;
