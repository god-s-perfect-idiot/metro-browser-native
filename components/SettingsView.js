import { ScrollView, Text, View, Animated } from "react-native";
import { AppTitle } from "./core/AppTitle";
import { PageTitle } from "./core/Pagetitle";
import { TextBox } from "./core/TextBox";
import { Select } from "./core/Select";
import { Button } from "./core/Button";
import Link from "./core/Link";
import { Toast } from "./core/Toast";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState, useRef } from "react";
import { clearHistory } from "./utils/history-manager";
import { getAllSearchEngines, setDefaultSearchEngine, getDefaultSearchEngine } from "./utils/search-engine-manager";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import { fonts } from "../styles/fonts";

export const SettingsView = ({ navigation }) => {

  const [quickButton, setQuickButton] = useState("tabs");
  const [searchEngine, setSearchEngine] = useState("google");
  const [searchEngines, setSearchEngines] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fullscreen, setFullscreen] = useState("disabled");
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const flipAnimation = useRef(new Animated.Value(0)).current; // Start at 0 degrees (normal view)
  const [containerWidth, setContainerWidth] = useState(0);

  const showToast = (message) => {
    setToastMessage(message);
    setToastVisible(true);
  };

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const quickButton = await AsyncStorage.getItem("quickButton");
      const defaultEngine = await getDefaultSearchEngine();
      const engines = await getAllSearchEngines();
      const fullscreenPref = await AsyncStorage.getItem("fullscreen");
      
      if (quickButton) setQuickButton(quickButton);
      if (defaultEngine) setSearchEngine(defaultEngine);
      if (fullscreenPref) setFullscreen(fullscreenPref);
      setSearchEngines(engines);
    } catch (error) {
      console.error("Error loading settings:", error);
      // Set fallback values
      setSearchEngines([
        { id: "google", name: "Google", value: "google" },
        { id: "bing", name: "Bing", value: "bing" },
        { id: "yahoo", name: "Yahoo", value: "yahoo" },
        { id: "duckduckgo", name: "DuckDuckGo", value: "duckduckgo" },
        { id: "ecosia", name: "Ecosia", value: "ecosia" }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle layout to get container width for rotation axis
  const handleLayout = (event) => {
    const { width } = event.nativeEvent.layout;
    if (width > 0) {
      setContainerWidth(width);
    }
  };

  // Use focus effect to reload data and trigger flip-in animation when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      // Trigger flip-in animation (rotate from 90 to 0 degrees)
      flipAnimation.setValue(90);
      Animated.timing(flipAnimation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
      
      fetchData();
    }, [])
  );

  // Function to handle flip-out animation before navigating to ManageSearchEngines
  const handleFlipOutToManageSearchEngines = useCallback(() => {
    // Flip out animation using negative values (rotate to -90 degrees to flip out right)
    Animated.timing(flipAnimation, {
      toValue: -90,
      duration: 300,
      useNativeDriver: false,
    }).start(() => {
      // Navigate after animation completes
      navigation.navigate('ManageSearchEngines');
    });
  }, [navigation]);

  // Interpolate rotation value for the flip animation
  // Entry: uses positive range [0, 90] -> ['0deg', '90deg'] (flip in from behind)
  // Exit: uses negative range [-90, 0] -> ['-90deg', '0deg'] (flip out to the right)
  // Combined range handles both directions
  const rotateY = flipAnimation.interpolate({
    inputRange: [-90, 0, 90],
    outputRange: ['-90deg', '0deg', '90deg'],
    extrapolate: 'clamp',
  });

  return (
    <View 
      className="flex flex-col w-full h-full bg-black"
      style={{ flex: 1, perspective: 1000 }}
      onLayout={handleLayout}
    >
      <Animated.View
        style={{
          flex: 1,
          padding: 16,
          transform: [
            { translateX: containerWidth > 0 ? -containerWidth / 2 : 0 },
            { rotateY },
            { translateX: containerWidth > 0 ? containerWidth / 2 : 0 },
          ],
        }}
      >
        <Toast
          visible={toastVisible}
          message={toastMessage}
          type="success"
          onHide={() => setToastVisible(false)}
        />
        <AppTitle title="Settings" />
        <PageTitle title="Metro Browser" classOverride={"w-[200%]"}/>
        <ScrollView className="flex-1" bounces alwaysBounceVertical>
        <View className="flex flex-col mt-6">
          <Select
            options={[
              { name: "mobile version", value: "mobile" },
              { name: "desktop version", value: "desktop" },
            ]}
            defaultValue="mobile"
            title="Website Preference"
            onChange={async (option) => {
              switch (option.value) {
                case "mobile":
                  await AsyncStorage.setItem("agent", "mobile");
                  break;
                case "desktop":
                  await AsyncStorage.setItem("agent", "desktop");
                  break;
              }
            }}
          />
          {/* <Select
            options={[
              { name: "enabled", value: "enabled" },
              { name: "disabled", value: "disabled" },
            ]}
            defaultValue={fullscreen}
            title="Fullscreen Mode"
            onChange={async (option) => {
              await AsyncStorage.setItem("fullscreen", option.value);
              setFullscreen(option.value);
            }}
            classOverride="mt-6"
          /> */}
          <Select
            options={[
              { name: "tabs", value: "tabs" },
              { name: "favourites", value: "favourites" },
            ]}
            defaultValue={quickButton}
            title="Use address bar button for"
            onChange={async (option) => {
              switch (option.value) {
                case "tabs":
                  await AsyncStorage.setItem("quickButton", "tabs");
                  setQuickButton("tabs");
                  break;
                case "favourites":
                  await AsyncStorage.setItem("quickButton", "favourites");
                  setQuickButton("favourites");
                  break;
              }
            }}
            classOverride="mt-6"
          />
          {!isLoading && (
            <Select
              options={searchEngines.map(engine => ({
                name: engine.name,
                value: engine.id
              }))}
              defaultValue={searchEngine}
              title="Set Default Search Engine to"
              onChange={async (option) => {
                await setDefaultSearchEngine(option.value);
                setSearchEngine(option.value);
              }}
              classOverride="mt-6"
            />
          )}
          <Text className="text-[#b0b0b0] text-sm mt-6" style={fonts.regular}>
            We'll download full web pages.
          </Text>
        </View>
        <View className="flex flex-col mt-12 justify-start items-start">
          <Button
            text="manage search engines"
            onPress={handleFlipOutToManageSearchEngines}
            classOverride="px-auto mb-4"
          />
          <Button
            text="delete history"
            onPress={async () => {
              await clearHistory();
              showToast("History deleted successfully");
            }}
            classOverride="px-auto"
          />
          <Text className="text-[#b0b0b0] text-sm mt-8" style={fonts.regular}>
            Deletes all your browsing history, cookies and temporary Internet
            files from your phone.
          </Text>
          <Link
            classOverride="mt-6 underline !text-base"
            fontStyle="regular"
            text="Privacy Statement"
            isLowerCase={false}
          />
          <Link
            classOverride="mt-6 underline !text-base"
            fontStyle="regular"
            text="Learn about these settings"
            isLowerCase={false}
          />
        </View>
      </ScrollView>
      </Animated.View>
    </View>
  );
};
