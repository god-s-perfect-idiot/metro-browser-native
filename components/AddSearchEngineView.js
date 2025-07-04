import React, { useState } from "react";
import { View, Text, ScrollView, Alert } from "react-native";
import { AppTitle } from "./core/AppTitle";
import { PageTitle } from "./core/Pagetitle";
import { TextBox } from "./core/TextBox";
import { Button } from "./core/Button";
import { fonts } from "../styles/fonts";
import { addCustomSearchEngine } from "./utils/search-engine-manager";

export const AddSearchEngineView = ({ navigation }) => {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [icon, setIcon] = useState("🔍");
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    if (!name.trim()) {
      Alert.alert("Error", "Please enter a search engine name");
      return false;
    }

    if (!url.trim()) {
      Alert.alert("Error", "Please enter a search URL");
      return false;
    }

    // Basic URL validation - should contain {q} placeholder
    if (!url.includes("{q}")) {
      Alert.alert("Error", "URL must contain {q} placeholder for search query");
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const newEngine = {
        name: name.trim(),
        url: url.trim(),
        icon: icon.trim() || "🔍",
      };

      await addCustomSearchEngine(newEngine);

      Alert.alert("Success", "Custom search engine added successfully!", [
        {
          text: "OK",
          onPress: () => {
            navigation.navigate("ManageSearchEngines");
          },
        },
      ]);
    } catch (error) {
      Alert.alert("Error", "Failed to add search engine. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  return (
    <View className="flex flex-col w-full h-full bg-black p-4">
      <AppTitle title="Add Search Engine" />
      <PageTitle title="Custom Search" />

      <ScrollView className="flex-1 h-full mt-4" bounces alwaysBounceVertical>
        <View className="flex flex-col mt-2 h-full gap-4">
          <Text className="text-[#b0b0b0] text-[13px] mb-2" style={fonts.light}>
            Add your own search engine. The URL must contain {"{q}"} as a
            placeholder for the search query.
          </Text>

          <View className="flex flex-col gap-4 justify-start items-start h-12">
            <TextBox
              placeholder="Name"
              value={name}
              onChangeText={setName}
              title="Search Engine Name"
              boxOverrides="!h-8 !py-0"
            />
          </View>

          <View className="flex flex-col gap-4 justify-start items-start h-12">
            <TextBox
              placeholder="https://example.com/search?q={q}"
              value={url}
              onChangeText={setUrl}
              title="Search URL"
              boxOverrides="!h-8 !py-0"
            />
          </View>
          <View className="flex flex-col gap-4 justify-start items-start h-12">
            <TextBox
              placeholder="emoji or text"
              value={icon}
              onChangeText={setIcon}
              title="Icon"
              boxOverrides="!h-8 !py-0"
            />
          </View>

          <View className="flex flex-col items-start space-y-3 pt-4">
            <Button
              text={isLoading ? "Adding..." : "Add Search Engine"}
              onPress={handleSubmit}
              disabled={isLoading}
              classOverride="px-auto mb-4"
            />

            <Button
              text="Cancel"
              onPress={handleCancel}
              classOverride="px-auto"
            />
          </View>

          <View className="mt-8">
            <Text
              className="text-[#b0b0b0] text-[13px] mb-2"
              style={fonts.light}
            >
              Examples:
            </Text>
            <Text
              className="text-[#b0b0b0] text-[11px] mb-1"
              style={fonts.light}
            >
              • Google: https://www.google.com/search?q={"{q}"}
            </Text>
            <Text
              className="text-[#b0b0b0] text-[11px] mb-1"
              style={fonts.light}
            >
              • Bing: https://www.bing.com/search?q={"{q}"}
            </Text>
            <Text
              className="text-[#b0b0b0] text-[11px] mb-1"
              style={fonts.light}
            >
              • DuckDuckGo: https://www.duckduckgo.com/?q={"{q}"}
            </Text>
            <Text
              className="text-[#b0b0b0] text-[11px] mb-1"
              style={fonts.light}
            >
              • Ecosia: https://www.ecosia.org/search?q={"{q}"}
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};
