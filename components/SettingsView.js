import { ScrollView, Text, View } from "react-native";
import { AppTitle } from "./core/AppTitle";
import { PageTitle } from "./core/Pagetitle";
import { TextBox } from "./core/TextBox";
import { Select } from "./core/Select";
import { Button } from "./core/Button";
import Link from "./core/Link";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
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

  // Use focus effect to reload data when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  return (
    <View className="flex flex-col w-full h-full bg-black p-4">
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
          <Select
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
          />
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
            onPress={() => {
              navigation.navigate('ManageSearchEngines');
            }}
            classOverride="px-auto mb-4"
          />
          <Button
            text="delete history"
            onPress={() => {
              clearHistory();
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
    </View>
  );
};
