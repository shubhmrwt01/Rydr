import DraggableMap from "@/components/customer/DraggableMap";
import LocationBar from "@/components/customer/LocationBar";
import SheetContent from "@/components/customer/SheetContent";
import { getMyRides } from "@/service/rideService";
import { homeStyles } from "@/styles/homeStyles";
import { Colors, screenHeight } from "@/utils/Constants";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Platform, View } from "react-native";

const androidHeights = [
  screenHeight * 0.2,
  screenHeight * 0.42,
  screenHeight * 0.7,
];
const iosHeights = [screenHeight * 0.2, screenHeight * 0.5, screenHeight * 0.8];
const CustomerHome = () => {
  const bottomSheetRef = useRef(null);
  const snapPoints = useMemo(
    () => (Platform.OS == "ios" ? iosHeights : androidHeights),
    [],
  );
  const [mapHeight, setMapHeight] = useState(snapPoints[0]);
  const handleSheetChanges = useCallback((index: number) => {
    let height = screenHeight * 0.8;
    if (index === 1) {
      height = screenHeight * 0.58;
    }
    setMapHeight(height);
  }, []);

  useEffect(() => {
    getMyRides();
  }, []);
  return (
    <View style={{ flex: 1 }}>
      <StatusBar style="light" />
      <LocationBar />
      <DraggableMap height={mapHeight} />
      <BottomSheet
        ref={bottomSheetRef}
        index={1}
        handleComponent={() => null}
        enableOverDrag={false}
        topInset={0}
        enableDynamicSizing={false}
        backgroundStyle={{
          backgroundColor: Colors.lightBg,
          borderTopLeftRadius: 15,
          borderTopRightRadius: 15,
        }}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
      >
        <BottomSheetScrollView
          contentContainerStyle={{
            ...homeStyles.scrollContainer,
            paddingTop: 0,
          }}
          nestedScrollEnabled={true}
          showsVerticalScrollIndicator={false}
          style={{
            backgroundColor: Colors.lightBg,
            borderTopLeftRadius: 15,
            borderTopRightRadius: 15,
            overflow: "hidden",
          }}
        >
          <SheetContent />
        </BottomSheetScrollView>
      </BottomSheet>
    </View>
  );
};

export default CustomerHome;
