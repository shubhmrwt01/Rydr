import { commonStyles } from "@/styles/commonStyles";
import { locationStyles } from "@/styles/locationStyles";
import { uiStyles } from "@/styles/uiStyles";
import { Ionicons } from "@expo/vector-icons";
import { FC } from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import CustomText from "../shared/CustomText";
import { Colors } from "@/utils/Constants";
import { SafeAreaView } from "react-native-safe-area-context";

const LocationItem: FC<{
  item: any;
  onPress: () => void;
}> = ({ item, onPress }) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={styles.container}
    >
      <View style={styles.iconContainer}>
        <Ionicons name="location" size={20} color={Colors.primary} />
      </View>

      <View style={styles.content}>
        <CustomText fontFamily="Medium" numberOfLines={1} style={styles.title}>
          {item?.title}
        </CustomText>

        <CustomText
          fontFamily="Regular"
          numberOfLines={2}
          style={styles.description}
        >
          {item?.description}
        </CustomText>
      </View>

      <Ionicons name="chevron-forward" size={18} color="#BDBDBD" />
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",

    paddingHorizontal: 16,
    paddingVertical: 14,

    backgroundColor: "#FFFFFF",

    borderBottomWidth: 1,
    borderBottomColor: "#F2F2F2",
  },

  iconContainer: {
    width: 42,
    height: 42,

    borderRadius: 21,

    backgroundColor: "#F4F7FC",

    justifyContent: "center",
    alignItems: "center",

    marginRight: 12,
  },

  content: {
    flex: 1,
  },

  title: {
    fontSize: 15,
    color: "#111827",
  },

  description: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 3,
    lineHeight: 18,
  },
});

export default LocationItem;
