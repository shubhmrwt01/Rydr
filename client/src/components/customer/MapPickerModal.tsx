import { useUserStore } from "@/store/userStore";
import { mapStyles } from "@/styles/mapStyles";
import { modalStyles } from "@/styles/modalStyles";
import { customMapStyle, indiaIntialRegion } from "@/utils/CustomMap";
import { getPlacesSuggestions, reverseGeocode } from "@/utils/mapUtils";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { FC, memo, useEffect, useRef, useState } from "react";
import {
  FlatList,
  Image,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Region } from "react-native-maps";
import { RFValue } from "react-native-responsive-fontsize";
import LocationItem from "./LocationItem";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "@/utils/Constants";
interface MapPickerModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  selectedLocation: {
    latitude: number;
    longitude: number;
    address: string;
  };
  onSelectLocation: (location: any) => void;
}

const MapPickerModal: FC<MapPickerModalProps> = ({
  visible,
  selectedLocation,
  onClose,
  title,
  onSelectLocation,
}) => {
  const mapRef = useRef<MapView>(null);
  const [text, setText] = useState("");
  const { location } = useUserStore();
  const [address, setAddress] = useState("");
  const [region, setRegion] = useState<Region | null>(null);
  const [locations, setLocations] = useState([]);
  const textInputRef = useRef<TextInput>(null);

  const fetchLocation = async (query: string) => {
    if (query?.length > 2) {
      const data = await getPlacesSuggestions(query);
      setLocations(data);
    } else {
      setLocations([]);
    }
  };

  useEffect(() => {
    if (selectedLocation?.latitude) {
      setAddress(selectedLocation?.address);

      setRegion({
        latitude: selectedLocation?.latitude,
        longitude: selectedLocation?.longitude,
        latitudeDelta: 0.5,
        longitudeDelta: 0.5,
      });

      mapRef?.current?.fitToCoordinates(
        [
          {
            latitude: selectedLocation?.latitude,
            longitude: selectedLocation?.longitude,
          },
        ],
        {
          edgePadding: { top: 50, left: 50, bottom: 50, right: 50 },
          animated: true,
        },
      );
    }
  }, [selectedLocation, mapRef]);

  const addLocation = async (item: any) => {
    setRegion({
      latitude: item.latitude,
      longitude: item.longitude,
      latitudeDelta: 0.5,
      longitudeDelta: 0.5,
    });

    setAddress(item.description);

    textInputRef.current?.blur();

    setText("");

    setLocations([]);
  };

  const renderLocations = ({ item }: any) => {
    return <LocationItem item={item} onPress={() => addLocation(item)} />;
  };

  const handleRegionChangeComplete = async (newRegion: Region) => {
    try {
      const address = await reverseGeocode(
        newRegion?.latitude,
        newRegion?.longitude,
      );
      setRegion(newRegion);
      setAddress(address);
    } catch (error) {
      console.log(error);
    }
  };
  const handleGPSButtonPress = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      mapRef?.current?.fitToCoordinates([{ latitude, longitude }], {
        edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
        animated: true,
      });
      const address = await reverseGeocode(latitude, longitude);
      setAddress(address);
      setRegion({
        latitude: latitude,
        longitude: longitude,
        latitudeDelta: 0.5,
        longitudeDelta: 0.5,
      });
    } catch (error) {
      console.log("Error getting location", error);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.searchWrapper}>
          <View style={modalStyles.searchContainer}>
            <Ionicons name="search-outline" size={RFValue(16)} color="#777" />
            <TextInput
              ref={textInputRef}
              style={modalStyles.input}
              placeholder="Search address"
              placeholderTextColor="#000"
              value={text}
              onChangeText={(e) => {
                setText(e);
                fetchLocation(e);
              }}
            />
          </View>
        </View>
        {text != "" ? (
          <View style={styles.searchResults}>
            <FlatList
              ListHeaderComponent={
                <View>
                  {text.length > 4 ? (
                    <View style={styles.resultsHeader}>
                      <Text style={styles.resultsHeaderText}>
                        Nearby Places
                      </Text>
                    </View>
                  ) : (
                    <Text
                      style={{
                        marginHorizontal: 16,
                        marginVertical: 12,
                        color: "#666",
                      }}
                    >
                      Enter at least 4 characters to search
                    </Text>
                  )}
                </View>
              }
              data={locations}
              renderItem={renderLocations}
              keyExtractor={(item: any) => item.place_id}
              keyboardShouldPersistTaps="handled"
            />
          </View>
        ) : (
          <>
            <MapView
              ref={mapRef}
              maxZoomLevel={16}
              minZoomLevel={12}
              pitchEnabled={false}
              onRegionChangeComplete={handleRegionChangeComplete}
              style={{ flex: 1 }}
              initialRegion={{
                latitude:
                  region?.latitude ??
                  location?.latitude ??
                  indiaIntialRegion?.latitude,
                longitude:
                  region?.longitude ??
                  location?.longitude ??
                  indiaIntialRegion?.longitude,
                latitudeDelta: 0.5,
                longitudeDelta: 0.5,
              }}
              provider="google"
              showsMyLocationButton={false}
              showsCompass={false}
              showsIndoors={false}
              showsIndoorLevelPicker={false}
              showsTraffic={false}
              showsBuildings={false}
              customMapStyle={customMapStyle}
              showsScale={false}
              showsUserLocation={true}
            />
            <View style={mapStyles.centerMarkerContainer}>
              <Image
                source={
                  title == "drop"
                    ? require("@/assets/icons/drop_marker.png")
                    : require("@/assets/icons/marker.png")
                }
                style={mapStyles.marker}
              />
            </View>
            <TouchableOpacity
              style={mapStyles.gpsButton}
              onPress={handleGPSButtonPress}
            >
              <MaterialCommunityIcons
                name="crosshairs-gps"
                size={RFValue(16)}
                color="#3C75BE"
              />
            </TouchableOpacity>
            <View style={modalStyles.footerContainer}>
              <Text style={modalStyles.addressText} numberOfLines={2}>
                {address == "" ? "Getting address..." : address}
              </Text>
              <View style={modalStyles.buttonContainer}>
                <TouchableOpacity
                  style={modalStyles.button}
                  onPress={() => {
                    onSelectLocation({
                      type: title,
                      latitude: region?.latitude,
                      longitude: region?.longitude,
                      address: address,
                    });
                    onClose();
                  }}
                >
                  <Text style={modalStyles.buttonText}>Set Address</Text>
                </TouchableOpacity>
              </View>
            </View>
          </>
        )}
      </SafeAreaView>
    </Modal>
  );
};
const styles = StyleSheet.create({
  header: {
    position: "absolute",
    top: 50,
    left: 0,
    right: 0,
    zIndex: 1000,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  searchWrapper: {
    position: "absolute",
    top: 40,
    left: 16,
    right: 16,
    zIndex: 1000,
  },
  searchResults: {
    position: "absolute",

    top: 110,
    left: 16,
    right: 16,

    maxHeight: 400,

    backgroundColor: "#FFFFFF",

    borderRadius: 18,

    overflow: "hidden",

    zIndex: 1001,

    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,

    elevation: 8,
  },

  resultsHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FAFAFA",
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },

  resultsHeaderText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#888",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
});
export default memo(MapPickerModal);
