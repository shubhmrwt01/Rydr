import { Colors } from "@/utils/Constants";
import { StyleSheet } from "react-native";

export const homeStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.lightBg,
  },
  scrollContainer: {
    backgroundColor: Colors.lightBg, // ✅ match everything
    paddingHorizontal: 10,
    flexGrow: 1,
    paddingTop: 5,
  },
});
