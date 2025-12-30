import React, { useState } from "react";
import { View, Text, ScrollView } from "react-native";
import { AppTitle } from "./core/AppTitle";
import { PageTitle } from "./core/Pagetitle";
import { TextBox } from "./core/TextBox";
import { Button } from "./core/Button";
import { Toast } from "./core/Toast";
import { Alert } from "./core/Alert";
import { fonts } from "../styles/fonts";
import { addCustomSearchEngine } from "./utils/search-engine-manager";

export const AddSearchEngineView = ({ navigation }) => {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [alertVisible, setAlertVisible] = useState(false);

  const showToast = (message) => {
    setToastMessage(message);
    setToastVisible(true);
  };

  const validateForm = () => {
    if (!name.trim()) {
      showToast("Please enter a search engine name");
      return false;
    }

    if (!url.trim()) {
      showToast("Please enter a search URL");
      return false;
    }

    // Basic URL validation - should contain {q} placeholder
    if (!url.includes("{q}")) {
      showToast("URL must contain {q} placeholder for search query");
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
        icon: "",
      };

      await addCustomSearchEngine(newEngine);

      setAlertVisible(true);
    } catch (error) {
      showToast("Failed to add search engine. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  return (
    <View className="flex flex-col w-full h-full bg-black p-4">
      <Toast
        visible={toastVisible}
        message={toastMessage}
        type="error"
        onHide={() => setToastVisible(false)}
      />
      <Alert
        visible={alertVisible}
        title="Success"
        message="Custom search engine added successfully!"
        buttons={[
          {
            text: "OK",
            onPress: () => {
              navigation.navigate("ManageSearchEngines");
            },
          },
        ]}
        onClose={() => setAlertVisible(false)}
      />
      <AppTitle title="Add Search Engine" />
      <PageTitle title="Custom Search" />

      <ScrollView className="flex-1 h-full mt-4" bounces alwaysBounceVertical>
        <View className="flex flex-col mt-2 h-full gap-4">
          <Text className="text-[#b0b0b0] text-[13px] mb-2" style={fonts.light}>
            Add your own search engine. The URL must contain {"{q}"} as a
            placeholder for the search query.
          </Text>

          <View className="flex flex-col gap-4 justify-start items-start h-fit">
            <TextBox
              placeholder="Name"
              value={name}
              onChangeText={setName}
              title="Search Engine Name"
              boxOverrides="h-auto !py-2"
            />
          </View>

          <View className="flex flex-col gap-4 justify-start items-start h-12fit">
            <TextBox
              placeholder="https://example.com/search?q={q}"
              value={url}
              onChangeText={setUrl}
              title="Search URL"
              boxOverrides="h-auto !py-2"
              classOverride="text-black placeholder:!text-[#f1f1f1]"
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
