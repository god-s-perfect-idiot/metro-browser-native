import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, Alert, TouchableOpacity } from "react-native";
import { AppTitle } from "./core/AppTitle";
import { PageTitle } from "./core/Pagetitle";
import { Button } from "./core/Button";
import { fonts } from "../styles/fonts";
import {
  getAllSearchEngines,
  removeCustomSearchEngine,
  getDefaultSearchEngine,
} from "./utils/search-engine-manager";
import { Trash2 } from "react-native-feather";
import RoundedButton from "./core/RoundedButton";
import { useFocusEffect } from "@react-navigation/native";

export const ManageSearchEnginesView = ({ navigation }) => {
  const [searchEngines, setSearchEngines] = useState([]);
  const [defaultEngine, setDefaultEngine] = useState("");
  const [isLoading, setIsLoading] = useState(true);

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

  const handleDeleteEngine = async (engine) => {
    // Don't allow deletion of default engines
    if (!engine.id.startsWith("custom_")) {
      Alert.alert("Cannot Delete", "Default search engines cannot be deleted.");
      return;
    }

    Alert.alert(
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
              Alert.alert("Success", "Search engine deleted successfully.");
            } catch (error) {
              Alert.alert("Error", "Failed to delete search engine.");
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

  const renderEngineItem = (engine) => {
    const isDefault = engine.id === defaultEngine;
    const isCustom = engine.id.startsWith("custom_");

    return (
      <View
        key={engine.id}
        className="flex flex-row items-center justify-between p-4"
      >
        <View className="flex flex-row items-center flex-1">
          <Text className="text-white text-lg mr-3">{engine.icon}</Text>
          <View className="flex-1">
            <Text className="text-white text-[15px]" style={fonts.regular}>
              {engine.name}
            </Text>
            <Text
              className="text-[#b0b0b0] text-[11px] mt-1"
              style={fonts.light}
            >
              {engine.url}
            </Text>
            {isDefault && (
              <Text
                className="text-[#a013ec] text-[11px] mt-1"
                style={fonts.light}
              >
                Default
              </Text>
            )}
            {isCustom && (
              <Text
                className="text-[#b0b0b0] text-[11px] mt-1"
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
              Icon={<Trash2 className="text-white" size={16} />}
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
      <PageTitle title="Manage Search" classOverride={"pb-2"}/>
      <ScrollView className="flex-1" bounces alwaysBounceVertical>
        <View className="flex flex-col mt-2">
          <Text className="text-[#b0b0b0] text-[13px] mb-4" style={fonts.light}>
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
            <Text
              className="text-[#b0b0b0] text-[13px] mb-2"
              style={fonts.light}
            >
              Tips:
            </Text>
            <Text
              className="text-[#b0b0b0] text-[11px]"
              style={fonts.light}
            >
              Default engines are built-in and cannot be deleted
            </Text>
            <Text
              className="text-[#b0b0b0] text-[11px]"
              style={fonts.light}
            >
              Custom engines can be deleted by tapping the trash icon
            </Text>
            <Text
              className="text-[#b0b0b0] text-[11px]"
              style={fonts.light}
            >
              Set your default engine in the main Settings
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};
