import { useEffect, useState } from "react";
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
  const [loader, setLoader] = useState(0.0);
  const [isLoading, setIsLoading] = useState(false);
  // const [tab , setTab] = useState(0);

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
      // const tab = await AsyncStorage.getItem("tab");
      const url = JSON.parse(tabData)[0].url;
      if (url) setUrl(url);
      console.log("url", url);
      // if (tab) setTab(tab);
    };
    fetchData();
  }, [AsyncStorage.getItem("tabs")]);

  const onURLChange = (e) => {
    if (typeof e === "string") setUrlPreview(e);
  };

  const onSubmitURL = () => {
    setUrl(urlPreview);
  };

  return (
    <View className="w-full h-full flex flex-col">
      {/* <StatusBar /> */}
      {url !== "" ? (
        <WebView
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
      />
    </View>
  );
};
