import { useEffect, useRef, useState } from "react";
import { View, Text, StatusBar } from "react-native";
import WebView from "react-native-webview";
import BottomBar from "./compound/MainBottomBar";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
    const fetchData = async () => {
      const tabData = await AsyncStorage.getItem("tabs");
      const searchEngine = await AsyncStorage.getItem("searchEngine");
      const url = JSON.parse(tabData)[0].url;
      if (url) setUrl(url);
      if (searchEngine) setSearchEngine(searchEngine);
    };
    fetchData();
  }, [AsyncStorage.getItem("tabs")]);

  const onURLChange = (e) => {
    if (typeof e === "string") setUrlPreview(e);
  };

  const onSubmitURL = () => {
    // if search query, append to search engine
    if (urlPreview.includes(" ")) {
      switch (searchEngine) {
        case "google":
          setUrl("https://www.google.com/search?q=" + urlPreview);
          console.log("https://www.google.com/search?q=" + urlPreview);
          break;
        case "bing":
          setUrl("https://www.bing.com/search?q=" + urlPreview);
          break;
        case "duckduckgo":
          setUrl("https://www.duckduckgo.com/search?t=" + urlPreview);
          break;
        case "yahoo":
          setUrl("https://www.yahoo.com/search?p=" + urlPreview);
          break;
        default:
          setUrl("https://www.google.com/search?q=" + urlPreview);
          break;
      }
    } else {
      // add https:// if not present and www. if not present
      if (!urlPreview.includes("https://")) {
        if (!urlPreview.includes("www.") && urlPreview.split(".").length <= 2) {
          setUrl("https://www." + urlPreview);
        } else {
          setUrl("https://" + urlPreview);
        }
      } else {
        setUrl(urlPreview);
      }
    }
  };

  return (
    <View className="w-full h-full flex flex-col">
      <StatusBar />
      {url !== "" ? (
        <WebView
          ref={webViewRef}
          className="flex-1 w-full h-full"
          source={{ uri: url }}
          userAgent={agent}
          onLoadProgress={(e) => {
            setLoader(e.nativeEvent.progress);
            setUrl(e.nativeEvent.url);
            setTabUrl(e.nativeEvent.url);
          }}
          onLoadStart={() => setIsLoading(true)}
          onLoadEnd={() => setIsLoading(false)}
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
      />
    </View>
  );
};
