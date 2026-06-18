import CustomText from "@/components/shared/CustomText";
import { refresh_tokens } from "@/service/apiInterceptors";
import { logout } from "@/service/authService";
import { tokenStorage } from "@/store/storage";
import { useUserStore } from "@/store/userStore";
import { Colors } from "@/utils/Constants";
import { resetAndNavigate } from "@/utils/Helpers";
import { useFonts } from "expo-font";
import { jwtDecode } from "jwt-decode";
import React, { useEffect, useState } from "react";
import { Alert, Image, StyleSheet, View } from "react-native";
interface DecodedToken {
  exp: number;
}
const Main = () => {
  const [loaded] = useFonts({
    Bold: require("../assets/fonts/NotoSans-Bold.ttf"),
    Regular: require("../assets/fonts/NotoSans-Regular.ttf"),
    Medium: require("../assets/fonts/NotoSans-Medium.ttf"),
    Light: require("../assets/fonts/NotoSans-Light.ttf"),
    SemiBold: require("../assets/fonts/NotoSans-SemiBold.ttf"),
  });

  const { user } = useUserStore();
  const [hasNavigated, setHasNavigated] = useState(false);
  const tokenCheck = async () => {
    const access_token = tokenStorage.getString("access_token") as string;
    const refresh_token = tokenStorage.getString("refresh_token") as string;
    if (access_token) {
      const decodedAccessToken = jwtDecode<DecodedToken>(access_token);
      const decodedRefreshToken = jwtDecode<DecodedToken>(refresh_token);
      const currentTime = Date.now() / 1000;
      if (decodedRefreshToken?.exp < currentTime) {
        logout();
        Alert.alert("Session expired,please login again");
      }
      if (decodedAccessToken?.exp < currentTime) {
        try {
          refresh_tokens();
        } catch (error) {
          console.groupCollapsed(error);
          Alert.alert("Refresh Token Error");
        }
      }
      if (user) {
        resetAndNavigate("/customer/home");
      } else {
        resetAndNavigate("/rider/home");
      }
      return;
    }
    resetAndNavigate("/role");
  };
  useEffect(() => {
    if (loaded && !hasNavigated) {
      const timeoutId = setTimeout(() => {
        tokenCheck();
        setHasNavigated(true);
      }, 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [loaded, hasNavigated]);
  if (!loaded) return null;
  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image
        source={require("@/assets/images/logo_t.png")}
        style={styles.logo}
      />
      <CustomText style={styles.title} variant="h4" fontFamily="Bold">
        Rydr
      </CustomText>
      {/* Tagline */}
      <CustomText style={styles.tagline} fontFamily="Medium">
        Ride Smart. Ride Fast.
      </CustomText>

      {/* Footer */}
      <CustomText style={styles.footer}>Made with &hearts; for 🇮🇳</CustomText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: "center",
    alignItems: "center",
  },

  logo: {
    width: 110,
    height: 110,
    marginBottom: 20,
    shadowColor: "#F2C94C",
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 10,
  },

  title: {
    fontSize: 42,
    letterSpacing: 2,
    textAlign: "center",
    color: "#F2C94C",
  },

  tagline: {
    fontSize: 16,
    color: "#A1A1AA",
    marginTop: 8,
  },

  footer: {
    position: "absolute",
    bottom: 40,
    fontSize: 14,
    color: "#fff",
  },
});

export default Main;
