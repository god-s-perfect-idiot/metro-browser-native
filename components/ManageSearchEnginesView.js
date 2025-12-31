import React, { useState, useEffect, useRef } from "react";
import { View, Text, ScrollView, TouchableOpacity, Animated, BackHandler } from "react-native";
import { AppTitle } from "./core/AppTitle";
import { PageTitle } from "./core/Pagetitle";
import { Button } from "./core/Button";
import { Alert } from "./core/Alert";
import { fonts } from "../styles/fonts";
import {
  getAllSearchEngines,
  removeCustomSearchEngine,
  getDefaultSearchEngine,
} from "./utils/search-engine-manager";
import { Trash2 } from "react-native-feather";
import RoundedButton from "./core/RoundedButton";
import { useFocusEffect } from "@react-navigation/native";
import Fontisto from "@expo/vector-icons/Fontisto";
import { useCallback } from "react";

export const ManageSearchEnginesView = ({ navigation, route }) => {
  const [searchEngines, setSearchEngines] = useState([]);
  const [defaultEngine, setDefaultEngine] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertConfig, setAlertConfig] = useState(null);
  const flipAnimation = useRef(new Animated.Value(0)).current; // Start at 0 degrees (normal view)
  const [containerWidth, setContainerWidth] = useState(0);
  const skipAnimationRef = useRef(false); // Track if we should skip animation when coming back from AddSearchEngine

  useEffect(() => {
    loadSearchEngines();
  }, []);

  const loadSearchEngines = async () => {
    try {
      const engines = await getAllSearchEngines();
      const defaultEngineId = await getDefaultSearchEngine();

      setSearchEngines(engines);
      setDefaultEngine(defaultEngineId);
    } catch (error) {
      console.error("Error loading search engines:", error);
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

  useFocusEffect(
    useCallback(() => {
      // Skip animation if coming back from AddSearchEngine (check both ref and route params)
      const shouldSkipAnimation = skipAnimationRef.current || route?.params?.skipAnimation;
      
      if (shouldSkipAnimation) {
        skipAnimationRef.current = false; // Reset ref
        // Clear route param if it exists
        if (route?.params?.skipAnimation) {
          navigation.setParams({ skipAnimation: undefined });
        }
        flipAnimation.setValue(0); // Keep at 0 (no animation)
        loadSearchEngines();
        return;
      }
      
      // Trigger flip-in animation (rotate from 90 to 0 degrees)
      flipAnimation.setValue(90);
      Animated.timing(flipAnimation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
      
      loadSearchEngines();
    }, [route?.params?.skipAnimation, navigation])
  );

  // Interpolate rotation value for the flip animation
  // Entry: uses positive range [0, 90] -> ['0deg', '90deg'] (flip in from behind)
  // Exit: uses negative range [-90, 0] -> ['-90deg', '0deg'] (flip out to the right)
  // Combined range handles both directions
  const rotateY = flipAnimation.interpolate({
    inputRange: [-90, 0, 90],
    outputRange: ['-90deg', '0deg', '90deg'],
    extrapolate: 'clamp',
  });

  const showAlert = (title, message, buttons) => {
    setAlertConfig({ title, message, buttons });
    setAlertVisible(true);
  };

  const hideAlert = () => {
    setAlertVisible(false);
    setAlertConfig(null);
  };

  const handleDeleteEngine = async (engine) => {
    // Don't allow deletion of default engines
    if (!engine.id.startsWith("custom_")) {
      showAlert("Cannot Delete", "Default search engines cannot be deleted.", [
        { text: "OK", style: "default" },
      ]);
      return;
    }

    showAlert(
      "Delete Search Engine",
      `Are you sure you want to delete "${engine.name}"?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await removeCustomSearchEngine(engine.id);
              await loadSearchEngines(); // Reload the list
              showAlert("Success", "Search engine deleted successfully.", [
                { text: "OK", style: "default" },
              ]);
            } catch (error) {
              showAlert("Error", "Failed to delete search engine.", [
                { text: "OK", style: "default" },
              ]);
            }
          },
        },
      ]
    );
  };

  const handleAddNew = () => {
    skipAnimationRef.current = true; // Set flag to skip animation when coming back
    navigation.navigate("AddSearchEngine");
  };

  // Function to handle flip-out animation before navigating back to Settings
  const handleFlipOutAndGoBack = useCallback(() => {
    // Flip out animation using negative values (rotate to -90 degrees to flip out right)
    Animated.timing(flipAnimation, {
      toValue: -90,
      duration: 300,
      useNativeDriver: false,
    }).start(() => {
      // Navigate back after animation completes
      navigation.goBack();
    });
  }, [navigation]);

  const handleBack = () => {
    handleFlipOutAndGoBack();
  };

  // Handle hardware back button
  useEffect(() => {
    const backAction = () => {
      handleFlipOutAndGoBack();
      return true; // Prevent default behavior
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [handleFlipOutAndGoBack]);

  // Generate a consistent random color based on engine name (dark for white text readability)
  const getRandomColor = (name) => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = hash % 360;
    const saturation = 50 + (hash % 30); // 50-80%
    const lightness = 25 + (hash % 20); // 25-45% (dark enough for white text)
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  };

  const renderEngineItem = (engine) => {
    const isDefault = engine.id === defaultEngine;
    const isCustom = engine.id.startsWith("custom_");
    const backgroundColor = getRandomColor(engine.name);

    return (
      <View
        key={engine.id}
        className="flex flex-row items-center justify-between py-2"
      >
        <View className="flex flex-row items-center flex-1">
          <View 
            className="flex w-20 h-20 justify-end items-start pl-2 pb-2"
            style={{ backgroundColor }}
          >
            <Text className="text-white text-3xl lowercase">{engine.name.charAt(0)}</Text>
          </View>
          <View className="flex-1 ml-2">
            <Text className="text-white text-xl" style={fonts.regular}>
              {engine.name}
            </Text>
            <Text className="text-[#b0b0b0] text-sm mt-1" style={fonts.light}>
              {engine.url}
            </Text>
            {isDefault && (
              <Text
                className="text-[#046ab8] text-base mt-1"
                style={fonts.light}
              >
                Default
              </Text>
            )}
            {isCustom && (
              <Text
                className="text-[#b0b0b0] text-base mt-1"
                style={fonts.light}
              >
                Custom
              </Text>
            )}
          </View>
        </View>

        {isCustom && (
          <TouchableOpacity
            onPress={() => handleDeleteEngine(engine)}
            className="ml-4"
          >
            <RoundedButton
              Icon={<Fontisto name="trash" size={16} color="white" />}
              action={() => handleDeleteEngine(engine)}
              classOverride="bg-red-500 p-1"
            />
          </TouchableOpacity>
        )}
      </View>
    );
  };

  if (isLoading) {
    return (
      <View 
        className="flex flex-col w-full h-full bg-black"
        style={{ flex: 1, perspective: 1000 }}
        onLayout={handleLayout}
      >
        <View className="p-4">
          <AppTitle title="Search Engines" />
          <PageTitle
            title="Manage Search"
            isUpperCase
            classOverride={"w-[200%]"}
          />
          <View className="flex-1 justify-center items-center">
            <Text className="text-white text-[15px]" style={fonts.regular}>
              Loading...
            </Text>
          </View>
        </View>
      </View>
    );
  }

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
        <AppTitle title="Search Engines" />
        <PageTitle title="Manage" classOverride={"pb-2"} />
        <Alert
          visible={alertVisible}
          title={alertConfig?.title}
          message={alertConfig?.message}
          buttons={alertConfig?.buttons || []}
          onClose={hideAlert}
        />
        <ScrollView className="flex-1" bounces alwaysBounceVertical>
          <View className="flex flex-col mt-2">
            <Text className="text-[#b0b0b0] text-base my-4" style={fonts.light}>
              Manage your search engines. Default engines cannot be deleted.
            </Text>

            <View className="overflow-hidden">
              {searchEngines.map(renderEngineItem)}
            </View>

            <View className="flex flex-col items-start space-y-3 mt-6">
              <Button
                text="Add New Search Engine"
                onPress={handleAddNew}
                classOverride="px-auto mb-4"
              />

              <Button
                text="Back to Settings"
                onPress={handleBack}
                classOverride="px-auto"
              />
            </View>

            <View className="mt-8">
              <Text className="text-[#b0b0b0] text-sm mb-2" style={fonts.light}>
                Tips:
              </Text>
              <Text className="text-[#b0b0b0] text-sm mb-1" style={fonts.light}>
                Default engines are built-in and cannot be deleted
              </Text>
              <Text className="text-[#b0b0b0] text-sm mb-1" style={fonts.light}>
                Custom engines can be deleted by tapping the trash icon
              </Text>
              <Text className="text-[#b0b0b0] text-sm" style={fonts.light}>
                Set your default engine in the main Settings
              </Text>
            </View>
          </View>
        </ScrollView>
      </Animated.View>
    </View>
  );
};
