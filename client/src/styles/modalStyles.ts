import { Colors } from "@/utils/Constants";
import { StyleSheet } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

export const modalStyles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.lightBg,
    marginTop: 250,
  },
  footerContainer: {
    backgroundColor: "#fff",
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowColor: "#000",
    elevation: 10,
    padding: 15,
  },
  addressText: {
    fontSize: RFValue(12),
  },
  button: {
    backgroundColor: Colors.lightBg,
    borderRadius: 6,
    padding: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonContainer: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    marginVertical: 10,
    borderTopWidth: 1,
    borderColor: "#ccc",
  },
  buttonText: {
    color: "#fff",
    fontSize: RFValue(13),
    fontWeight: "700",
  },
  centerText: {
    textAlign: "center",
    fontWeight: "600",
    marginTop: 15,
    fontSize: RFValue(13),
    textTransform: "capitalize",
    color: "#fff",
  },
  cancelButton: {
    color: "#fff",
    fontSize: RFValue(13),
    position: "absolute",
    top: -18,
    zIndex: 99,
    right: 14,
  },
  searchContainer: {
    backgroundColor: "#f2f2f2",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    margin: 15,
    justifyContent: "space-between",
    borderRadius: 10,
    borderColor:'#000'
  },
  input: {
    backgroundColor: "#f2f2f2",
    width: "92%",
    height: 42,
  },
});
