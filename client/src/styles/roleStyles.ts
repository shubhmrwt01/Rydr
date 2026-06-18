import { Colors } from "@/utils/Constants";
import { StyleSheet } from "react-native";

export const roleStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.lightBg,
    alignItems: "center",
  },
  logo: {
    resizeMode: "contain",
    height: 80,
    marginTop: 120,
    marginBottom: 40,
  },
  text: {
    color: "#e6e6e6",
  },
  card: {
    width: "88%",
    marginTop: 40,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#e6e6e6",
    marginVertical: 10,
    alignItems: "center",
  },
  cardContent: {
    width: "100%",
    padding: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  image: {
    height: 120,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    width: "100%",
    resizeMode: "stretch",
  },
  description: {
    fontSize: 14,
    color: "#000",
  },
});
