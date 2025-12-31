import React, { useState, useRef, useCallback, useEffect } from "react";
import { View, Text, ScrollView, Animated, Dimensions, BackHandler } from "react-native";
import { AppTitle } from "./core/AppTitle";
import { PageTitle } from "./core/Pagetitle";
import { TextBox } from "./core/TextBox";
import { Button } from "./core/Button";
import { Toast } from "./core/Toast";
import { Alert } from "./core/Alert";
import { fonts } from "../styles/fonts";
import { addCustomSearchEngine } from "./utils/search-engine-manager";
import { useFocusEffect } from "@react-navigation/native";

const screenHeight = Dimensions.get('window').height;

export const AddSearchEngineView = ({ navigation }) => {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [alertVisible, setAlertVisible] = useState(false);
  const slideAnimation = useRef(new Animated.Value(screenHeight)).current; // Start below screen

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

  // Function to handle slide-down exit animation
  const handleSlideDownAndGoBack = useCallback(() => {
    // Slide down animation before navigating back
    Animated.timing(slideAnimation, {
      toValue: screenHeight,
      duration: 300,
      useNativeDriver: false,
    }).start(() => {
      // Navigate back after animation completes
      navigation.goBack();
    });
  }, [navigation]);

  const handleCancel = () => {
    handleSlideDownAndGoBack();
  };

  // Handle hardware back button
  useEffect(() => {
    const backAction = () => {
      handleSlideDownAndGoBack();
      return true; // Prevent default behavior
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [handleSlideDownAndGoBack]);

  // Use focus effect to trigger slide-in animation when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      // Trigger slide-in animation (slide from bottom to top)
      slideAnimation.setValue(screenHeight);
      Animated.timing(slideAnimation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }, [])
  );

  return (
    <View className="flex flex-col w-full h-full bg-black" style={{ flex: 1 }}>
      <Animated.View
        style={{
          flex: 1,
          padding: 16,
          transform: [{ translateY: slideAnimation }],
        }}
      >
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
              navigation.navigate("ManageSearchEngines", { skipAnimation: true });
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
      </Animated.View>
    </View>
  );
};
