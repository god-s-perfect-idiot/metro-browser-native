import React, { useEffect, useState } from "react";
import { ScrollView, Text, TouchableWithoutFeedback, View } from "react-native";
import { Plus } from "react-native-feather";
import RoundedButton from "../core/RoundedButton";
import { TextBox } from "../core/TextBox";
import Link from "../core/Link";
import { fonts } from "../../styles/fonts";
import { MenuBar, QuickMenu } from "../core/MenuBar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getSearchEngineById, getDefaultSearchEngine } from "../utils/search-engine-manager";

const Menu = ({ navigation }) => {
  const [expanded, setExpanded] = useState(false);
  const [searchEngine, setSearchEngine] = useState("google");

  useEffect(() => {
    const fetchData = async () => {
      const defaultEngine = await getDefaultSearchEngine();
      if (defaultEngine) setSearchEngine(defaultEngine);
    };
    fetchData();
  }, []);

  return (
    <View
      className={` ${
        expanded ? "h-20" : "h-14"
      } flex flex-row w-full bg-[#222] `}
    >
      <View className="w-[15%] flex" />
      <View className="w-[70%] justify-center flex-row">
        <TouchableWithoutFeedback onPress={() => {}}>
          <View className="flex flex-col justify-center items-center mx-4 my-2 mb-3 px-1">
            <RoundedButton
              Icon={<Plus width={20} stroke={"white"} strokeWidth={3} />}
              action={async () => {
                try {
                  const engine = await getSearchEngineById(searchEngine);
                  let url = "https://www.google.com"; // fallback
                  
                  if (engine) {
                    // Extract the base URL from the search URL
                    const searchUrl = engine.url;
                    const baseUrl = searchUrl.split('?')[0].split('/search')[0];
                    url = baseUrl;
                  }
                  
                  AsyncStorage.getItem("tabs").then((tabs) => {
                    const newTabs = tabs
                      ? JSON.parse(tabs).concat({
                          url: url,
                        })
                      : [{ url: url }];
                    AsyncStorage.setItem("tabs", JSON.stringify(newTabs));
                  });
                } catch (error) {
                  console.error("Error getting search engine:", error);
                  // Fallback to Google
                  AsyncStorage.getItem("tabs").then((tabs) => {
                    const newTabs = tabs
                      ? JSON.parse(tabs).concat({
                          url: "https://www.google.com",
                        })
                      : [{ url: "https://www.google.com" }];
                    AsyncStorage.setItem("tabs", JSON.stringify(newTabs));
                  });
                }
              }}
            />
            {expanded && (
              <View className="flex flex-1 flex-row justify-center mt-1">
                <Text className="text-white text-[10px]" style={fonts.light}>
                  done
                </Text>
              </View>
            )}
          </View>
        </TouchableWithoutFeedback>
      </View>
      <TouchableWithoutFeedback onPress={() => setExpanded(!expanded)}>
        <View className="w-[15%] h-full items-start justify-center flex flex-row gap-1 pt-2">
          <View className="w-1 h-1 bg-white rounded-full" />
          <View className="w-1 h-1 bg-white rounded-full" />
          <View className="w-1 h-1 bg-white rounded-full" />
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
};

export default Menu;
