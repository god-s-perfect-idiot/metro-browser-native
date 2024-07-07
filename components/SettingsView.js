import { ScrollView, Text, View } from "react-native";
import { AppTitle } from "./core/AppTitle";
import { PageTitle } from "./core/Pagetitle";
import { TextBox } from "./core/TextBox";
import { Select } from "./core/Select";
import { fonts } from "../styles/fonts";
import { Button } from "./core/Button";
import Link from "./core/Link";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

export const SettingsView = ({ navigation }) => {

  const [quickButton, setQuickButton] = useState("tabs");
  const [searchEngine, setSearchEngine] = useState("google");

  useEffect(() => {
    const fetchData = async () => {
      const quickButton = await AsyncStorage.getItem("quickButton");
      const searchEngine = await AsyncStorage.getItem("searchEngine");
      if (quickButton) setQuickButton(quickButton);
      if (searchEngine) setSearchEngine(searchEngine);
    };
    fetchData();
  }, []);

  return (
    <View className="flex flex-col w-full h-full bg-black p-4">
      <AppTitle title="Settings" />
      <PageTitle title="Metro Browser" isUpperCase classOverride={"w-[200%]"}/>
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
          <Select
            options={[
              { name: "google", value: "google" },
              { name: "bing", value: "bing" },
              { name: "yahoo", value: "yahoo" },
              { name: "duckduckgo", value: "duckduckgo"}
            ]}
            defaultValue={searchEngine}
            title="Set Default Search Engine to"
            onChange={async (option) => {
              switch (option.value) {
                case "google":
                  await AsyncStorage.setItem("searchEngine", "google");
                  setSearchEngine("google");
                  break;
                case "bing":
                  await AsyncStorage.setItem("searchEngine", "bing");
                  setSearchEngine("bing");
                  break;
                case "yahoo":
                  await AsyncStorage.setItem("searchEngine", "yahoo");
                  setSearchEngine("yahoo");
                  break;
                case "duckduckgo":
                  await AsyncStorage.setItem("searchEngine", "duckduckgo");
                  setSearchEngine("duckduckgo");
                  break;
              }
            }}
            classOverride="mt-6"
          />
          <Text className="text-[#b0b0b0] text-[13px] mt-6" style={fonts.light}>
            We'll download full web pages.
          </Text>
        </View>
        <View className="flex flex-col mt-12">
          <Button
            text="delete history"
            onPress={() => {
              console.log("clearing history");
            }}
            classOverride="w-[40%]"
          />
          <Text className="text-[#b0b0b0] text-[13px] mt-8" style={fonts.light}>
            Deletes all your browsing history, cookies and temporary Internet
            files from your phone.
          </Text>
          <Link
            classOverride="mt-6 underline text-[13px]"
            text="Privacy Statement"
            isLowerCase={false}
          />
          <Link
            classOverride="mt-6 underline text-[13px]"
            text="Learn about these settings"
            isLowerCase={false}
          />
        </View>
      </ScrollView>
    </View>
  );
};
