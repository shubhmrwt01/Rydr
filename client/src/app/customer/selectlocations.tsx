import LocationInput from "@/components/customer/LocationInput";
import LocationItem from "@/components/customer/LocationItem";
import MapPickerModal from "@/components/customer/MapPickerModal";
import CustomText from "@/components/shared/CustomText";
import { useUserStore } from "@/store/userStore";
import { commonStyles } from "@/styles/commonStyles";
import { homeStyles } from "@/styles/homeStyles";
import { locationStyles } from "@/styles/locationStyles";
import { uiStyles } from "@/styles/uiStyles";
import { Colors } from "@/utils/Constants";
import { calculateDistance, getPlacesSuggestions } from "@/utils/mapUtils";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import debounce from "lodash.debounce";
import { useEffect, useMemo, useState } from "react";
import { FlatList, Image, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const LocationSelection = () => {
  const { location, setLocation } = useUserStore();

  const [pickup, setPickup] = useState("");
  const [pickupCoords, setPickupCoords] = useState<any>(null);

  const [dropCoords, setDropCoords] = useState<any>(null);

  const [drop, setDrop] = useState("");

  const [locations, setLocations] = useState([]);

  const [focusedInput, setFocusedInput] = useState("drop");

  const [modalTitle, setModalTitle] = useState("drop");

  const [isMapModalVisible, setMapModalVisible] = useState(false);

  // =========================================
  // FETCH PLACE SUGGESTIONS
  // =========================================

  const fetchLocation = async (query: string) => {
    if (query?.length > 2) {
      const data = await getPlacesSuggestions(query);

      setLocations(data);
    } else {
      setLocations([]);
    }
  };

  const fetchLocationDebounced = useMemo(
    () => debounce(fetchLocation, 400),
    [],
  );

  useEffect(() => {
    return () => {
      fetchLocationDebounced.cancel();
    };
  }, []);

  // =========================================
  // ADD LOCATION
  // =========================================

  const addLocation = async (item: any) => {
    const coords = {
      latitude: item.latitude,
      longitude: item.longitude,
    };

    // IMPORTANT:
    // Use Google place description directly
    // instead of reverse geocode
    const fullAddress = item.description;

    if (focusedInput === "drop") {
      setDrop(fullAddress);
      setDropCoords(coords);
    } else {
      setPickup(fullAddress);
      setPickupCoords(coords);

      setLocation({
        ...coords,
        address: fullAddress,
      });
    }

    setLocations([]);
  };

  // =========================================
  // RENDER LOCATION ITEM
  // =========================================

  const renderLocations = ({ item }: any) => {
    return <LocationItem item={item} onPress={() => addLocation(item)} />;
  };

  // =========================================
  // CHECK DISTANCE
  // =========================================

  const checkDistance = async () => {
    if (!pickupCoords || !dropCoords) return;

    const { latitude: lat1, longitude: long1 } = pickupCoords;

    const { latitude: lat2, longitude: long2 } = dropCoords;

    if (lat1 === lat2 && long1 === long2) {
      alert(
        "Pickup and drop locations cannot be same. Please select different locations.",
      );

      return;
    }

    const distance = calculateDistance(lat1, long1, lat2, long2);

    const minDistance = 0.5;
    const maxDistance = 50;

    if (distance < minDistance) {
      alert(
        "The selected locations are too close. Please choose locations that are further apart.",
      );
    } else if (distance > maxDistance) {
      alert(
        "The selected locations are too far apart. Please select a closer drop location.",
      );
    } else {
      setLocations([]);

      router.navigate({
        pathname: "/customer/ridebooking",

        params: {
          distanceInKm: distance.toFixed(2),

          drop_latitude: dropCoords.latitude,

          drop_longitude: dropCoords.longitude,

          drop_address: drop,
        },
      });

      console.log(`Distance is valid : ${distance.toFixed(2)} km`);
    }
  };

  // =========================================
  // AUTO CHECK DISTANCE
  // =========================================

  useEffect(() => {
    if (dropCoords && pickupCoords) {
      checkDistance();
    } else {
      setLocations([]);
      setMapModalVisible(false);
    }
  }, [dropCoords, pickupCoords]);

  // =========================================
  // SET USER CURRENT LOCATION
  // =========================================

  useEffect(() => {
    if (location) {
      setPickupCoords(location);
      setPickup(location?.address);
    }
  }, [location]);

  // =========================================
  // UI
  // =========================================

  return (
    <View style={homeStyles.container}>
      <StatusBar style="light" />

      <SafeAreaView />

      <TouchableOpacity
        style={commonStyles.flexRow}
        onPress={() => router.back()}
      >
        <Ionicons name="chevron-back" size={24} color={Colors.iosColor} />

        <CustomText
          fontFamily="Regular"
          style={{
            color: Colors.iosColor,
          }}
        >
          Back
        </CustomText>
      </TouchableOpacity>

      {/* INPUTS */}

      <View style={uiStyles.locationInputs}>
        <LocationInput
          placeholder="Search Pickup Location"
          type="pickup"
          value={pickup}
          onChangeText={(text) => {
            setPickup(text);

            fetchLocationDebounced(text);
          }}
          onFocus={() => setFocusedInput("pickup")}
        />

        <LocationInput
          placeholder="Search Drop Location"
          type="drop"
          value={drop}
          onChangeText={(text) => {
            setDrop(text);

            fetchLocationDebounced(text);
          }}
          onFocus={() => setFocusedInput("drop")}
        />

        <CustomText
          fontFamily="Medium"
          fontSize={10}
          style={[uiStyles.suggestionText, { color: "#fff" }]}
        >
          {focusedInput} suggestions
        </CustomText>
      </View>

      {/* SUGGESTIONS */}

      <FlatList
        data={locations}
        renderItem={renderLocations}
        keyExtractor={(item: any) => item?.place_id}
        initialNumToRender={5}
        windowSize={5}
        ListFooterComponent={
          <TouchableOpacity
            style={[commonStyles.flexRow, locationStyles.container]}
            onPress={() => {
              setModalTitle(focusedInput);

              setMapModalVisible(true);
            }}
          >
            <Image
              source={require("@/assets/icons/map_pin.png")}
              style={uiStyles.mapPinIcon}
            />

            <CustomText
              style={{
                color: "#fff",
              }}
              fontFamily="Medium"
              fontSize={12}
            >
              Select from Map
            </CustomText>
          </TouchableOpacity>
        }
      />

      {/* MAP PICKER MODAL */}

      {isMapModalVisible && (
        <MapPickerModal
          selectedLocation={{
            latitude:
              focusedInput === "drop"
                ? dropCoords?.latitude
                : pickupCoords?.latitude,

            longitude:
              focusedInput === "drop"
                ? dropCoords?.longitude
                : pickupCoords?.longitude,

            address: focusedInput === "drop" ? "drop" : "pickup",
          }}
          title={modalTitle}
          visible={isMapModalVisible}
          onClose={() => setMapModalVisible(false)}
          onSelectLocation={(data) => {
            if (data) {
              if (modalTitle === "drop") {
                setDropCoords(data);

                setDrop(data?.address);
              } else {
                setLocation(data);

                setPickupCoords(data);

                setPickup(data?.address);
              }
            }
          }}
        />
      )}
    </View>
  );
};

export default LocationSelection;
