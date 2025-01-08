import { useCallback, useEffect, useRef, useState } from "react";
import { View, Text, StatusBar, BackHandler } from "react-native";
import WebView from "react-native-webview";
import BottomBar from "./compound/MainBottomBar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import AppWebView from "./utils/webview-manager";
import { addToHistory } from "./utils/history-manager";
import {
  attachBackHandler,
  detachBackHandler,
  isIncompleteURL,
  isURL,
  normalizeUrl,
  popNavigation,
} from "./utils/app-helper";

export const MainView = ({ navigation, route }) => {
  // idk how but this works. god bless react native
  const [url, setUrl] = useState(
    (route && route.params && route.params.url) || "https://www.google.com"
  );
  const [urlPreview, setUrlPreview] = useState("");
  const [agent, setAgent] = useState("");
  const [searchEngine, setSearchEngine] = useState("google");
  const [loader, setLoader] = useState(0.0);
  const [isLoading, setIsLoading] = useState(false);
  const [navBarExpanded, setNavBarExpanded] = useState(false);
  const webViewRef = useRef(null);

  const setTabUrl = async (url) => {
    const tabData = await AsyncStorage.getItem("tabs");
    const tabs = JSON.parse(tabData);
    tabs[0].url = url;
    await AsyncStorage.setItem("tabs", JSON.stringify(tabs));
  };

  // useEffect(() => {
  //   // this wont work
  //   async function fetchAgent() {
  //     const agent = await AsyncStorage.getItem("agent");
  //     switch (agent) {
  //       case "desktop":
  //         setAgent(
  //           "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko)"
  //         );
  //         break;
  //       case "mobile":
  //         setAgent(
  //           "Mozilla/5.0 (Linux; Android 11; Pixel 5) AppleWebKit/537.36 (KHTML, like Gecko)"
  //         );
  //         break;
  //       default:
  //         setAgent(
  //           "Mozilla/5.0 (Linux; Android 11; Pixel 5) AppleWebKit/537.36 (KHTML, like Gecko)"
  //         );
  //         break;
  //     }
  //   }
  //   // enable this to fetch agent from settings
  //   // fetchAgent();
  // }, []);

  useEffect(() => {
    const backAction = () => {
      if (navigation.canGoBack()) {
        navigation.goBack();
        return true; // Prevent default behavior
      } else {
        if (navBarExpanded) {
          setNavBarExpanded(false);
          return true; // Prevent default behavior
        } else {
          popNavigation().then((url) => {
            if (url) {
              setUrl(url);
              return true;
            } else {
              BackHandler.exitApp();
              return false;
            }
          });
          return true; // Prevent default behavior
        }
      }
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove(); // Clean up the event listener
  }, [navigation, navBarExpanded]);

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        const tabData = await AsyncStorage.getItem("tabs");
        // const tab = await AsyncStorage.getItem("tab");
        const url = JSON.parse(tabData)[0].url;
        if (url) setUrl(url);
        const searchEngine = await AsyncStorage.getItem("searchEngine");
        if (searchEngine) setSearchEngine(searchEngine);
        // if (tab) setTab(tab);
      };
      fetchData();
    }, [])
  );

  const onURLChange = (e) => {
    if (typeof e === "string") setUrlPreview(e);
  };

  const onSubmitURL = () => {
    // if search query, append to search engine
    if (!isURL(urlPreview)) {
      if (isIncompleteURL(urlPreview)) {
        if (!urlPreview.includes("https://")) {
          if (
            !urlPreview.includes("www.") &&
            urlPreview.split(".").length <= 2
          ) {
            setUrl("https://www." + urlPreview);
          } else {
            setUrl("https://" + urlPreview);
          }
        }
      } else {
        switch (searchEngine) {
          case "google":
            setUrl("https://www.google.com/search?q=" + urlPreview);
            console.log("https://www.google.com/search?q=" + urlPreview);
            break;
          case "bing":
            setUrl("https://www.bing.com/search?q=" + urlPreview);
            break;
          case "duckduckgo":
            setUrl("https://www.duckduckgo.com/?q=" + urlPreview);
            break;
          case "yahoo":
            setUrl("https://search.yahoo.com/search?p=" + urlPreview);
            break;
          default:
            setUrl("https://www.google.com/search?q=" + urlPreview);
            break;
        }
      }
    } else {
      // add https:// if not present and www. if not present
      setUrl(urlPreview);
    }
  };

  const updateUrl = (url) => {
    AsyncStorage.getItem("tabs").then((tabData) => {
      if (!tabData) return;
      if (normalizeUrl(JSON.parse(tabData)[0].url) === normalizeUrl(url))
        return;
      setTabUrl(url);
      setUrl(url);
      console.log("url updated to:", url);
    });
  };

  return (
    <View className="w-full h-full flex flex-col">
      <StatusBar />
      {url !== "" ? (
        <AppWebView
          url={url}
          webViewRef={webViewRef}
          preLoad={(e) => {
            setIsLoading(true);
            updateUrl(e.nativeEvent.url);
            addToHistory(e.nativeEvent.url);
          }}
          postLoad={() => setIsLoading(false)}
          onLoad={(e) => setLoader(e.nativeEvent.progress)}
          classOverrides={"flex-1 w-full h-full"}
          navBarRef={{
            state: navBarExpanded,
            handler: setNavBarExpanded,
          }}
        />
      ) : (
        <View className="bg-white flex-1 h-full w-full"></View>
      )}
      <BottomBar
        url={url}
        onURLChange={onURLChange}
        onSubmitURL={onSubmitURL}
        navigation={navigation}
        loader={loader}
        isLoading={isLoading}
        webViewRef={webViewRef}
        navBarRef={{
          state: navBarExpanded,
          handler: setNavBarExpanded,
        }}
      />
    </View>
  );
};
