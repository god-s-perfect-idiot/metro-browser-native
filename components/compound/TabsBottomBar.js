import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  getSearchEngineById,
  getDefaultSearchEngine,
} from "../utils/search-engine-manager";
import Plus from "../icons/Plus";
import { QuickMenu } from "../core/MenuBar";
import Back from "../icons/Back";

const Menu = ({ navigation }) => {
  const [searchEngine, setSearchEngine] = useState("google");

  useEffect(() => {
    const fetchData = async () => {
      const defaultEngine = await getDefaultSearchEngine();
      if (defaultEngine) setSearchEngine(defaultEngine);
    };
    fetchData();
  }, []);

  const handleNewTab = async () => {
    try {
      const engine = await getSearchEngineById(searchEngine);
      let url = "https://www.google.com"; // fallback

      if (engine) {
        // Extract the base URL from the search URL
        const searchUrl = engine.url;
        const baseUrl = searchUrl.split("?")[0].split("/search")[0];
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
  };

  return (
    <QuickMenu
      options={[
        {
          text: "new",
          onPress: handleNewTab,
          Icon: <Plus color="white" size={38} />,
        },
      ]}
    />
  );
};

export default Menu;
