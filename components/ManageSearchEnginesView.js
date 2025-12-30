import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
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

export const ManageSearchEnginesView = ({ navigation }) => {
  const [searchEngines, setSearchEngines] = useState([]);
  const [defaultEngine, setDefaultEngine] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertConfig, setAlertConfig] = useState(null);

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

  useFocusEffect(
    React.useCallback(() => {
      loadSearchEngines();
    }, [])
  );

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
    navigation.navigate("AddSearchEngine");
  };

  const handleBack = () => {
    navigation.goBack();
  };

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
      <View className="flex flex-col w-full h-full bg-black p-4">
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
    );
  }

  return (
    <View className="flex flex-col w-full h-full bg-black p-4">
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
    </View>
  );
};
