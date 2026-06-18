export default {
  expo: {
    name: "Rydr",
    slug: "rydr",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./src/assets/images/icon.png",
    scheme: "rydr",
    newArchEnabled: true,
    userInterfaceStyle: "automatic",

    splash: {
      image: "./src/assets/images/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },

    ios: {
      buildNumber: "1",
      supportsTablet: true,
      bundleIdentifier: "com.shubhmrwt01.rydr",
      config: {
        googleMapsApiKey: process.env.GOOGLE_MAP_API_KEY,
      },
      infoPlist: {
        NSLocationAlwaysAndWhenInUseUsageDescription:
          "Rydr uses your location to track rides and improve your experience.",
      },
    },

    android: {
      package: "com.shubhmrwt01.rydr",
      usesCleartextTraffic: true,
      config: {
        googleMaps: {
          apiKey: process.env.GOOGLE_MAP_API_KEY,
        },
      },
      permissions: [
        "INTERNET",
        "ACCESS_FINE_LOCATION",
        "ACCESS_COARSE_LOCATION",
      ],
      adaptiveIcon: {
        foregroundImage: "./src/assets/images/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
    },

    web: {
      bundler: "metro",
      output: "static",
      favicon: "./src/assets/images/favicon.png",
    },

    plugins: [
      "expo-router",
      "expo-font",
      "expo-image",
      "expo-splash-screen",
      "expo-status-bar",
      "expo-web-browser",
      [
        "expo-location",
        {
          locationAlwaysAndWhenInUsePermission:
            "Rydr uses your location to track rides and navigation.",
        },
      ],
    ],
    extra: {
      eas: {
        projectId: "d7d39b47-73e7-4582-996a-14c668b7e6d6",
      },
    },
    experiments: {
      typedRoutes: true,
    },
  },
};
