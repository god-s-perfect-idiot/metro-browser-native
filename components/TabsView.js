import { Image, ScrollView, Text, TouchableWithoutFeedback, View } from "react-native";
import { AppTitle } from "./core/AppTitle";
import { PageTitle } from "./core/Pagetitle";
import Menu from "./compound/TabsBottomBar";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fonts } from "../styles/fonts";
import WebView from "react-native-webview";
import { X } from "react-native-feather";
import ScaledWebView from "./utils/webview-manager";
import { Tab } from "./utils/tab-manager";

export const TabsView = ({ navigation }) => {
  const [tabs, setTabs] = useState([]);

  useEffect(() => {
    async function loadTabs() {
      const tabs = await AsyncStorage.getItem("tabs");
      if (tabs) {
        setTabs(JSON.parse(tabs));
      }
    }
    loadTabs();
  }, [AsyncStorage.getItem("tabs")]);

  return (
    <View className="w-full h-full flex flex-col bg-black">
      {/* <StatusBar /> */}
      <View className="flex-1 p-4">
        <AppTitle title="Tabs" />
        <PageTitle title="phone" />
        <ScrollView className="mt-4">
          <Text className="text-base text-[#b0b0b0]" style={fonts.light}>
            recent
          </Text>
          <View className="flex flex-row flex-wrap mt-6">
            {tabs.map((tab, index) => (
              <TouchableWithoutFeedback
                onPress={() => {
                  const tempTabs = tabs.filter((t, i) => i !== index);
                  tempTabs.unshift(tab);
                  setTabs(tempTabs);
                  AsyncStorage.setItem("tabs", JSON.stringify(tempTabs));
                  navigation.navigate("MainView", {
                    url: tab.url,
                  });
                }}
                key={index}
              >
                <View className="flex flex-col mr-8 mb-8">
                  <View className="w-28 h-24 bg-white">
                    {/* <WebView
                      source={{ uri: tab.url }}
                      className="w-32 h-28"
                      injectedJavaScript={`
      const iOS = !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);
      if (!iOS) {
        const meta = document.createElement('meta');
        let initialScale = 1;
        if(screen.width <= 800) {
        initialScale = ((screen.width / window.innerWidth) + 0.1).toFixed(2);
        }
        const content = 'width=device-width, initial-scale=' + initialScale ;
        meta.setAttribute('name', 'viewport');
        meta.setAttribute('content', content);
        document.getElementsByTagName('head')[0].appendChild(meta);
      }
    `}
                      scalesPageToFit={true}
                    /> */}
                    {/* <Image source={{ uri: tab.url }} /> */}
                    {/* <ScaledWebView url={tab.url} /> */}
                    <Tab url={tab.url} />
                    <TouchableWithoutFeedback
                      onPress={() => {
                        setTabs(tabs.filter((t, i) => i !== index));
                        AsyncStorage.setItem(
                          "tabs",
                          JSON.stringify(tabs.filter((t, i) => i !== index))
                        );
                      }}
                    >
                      <View className="absolute top-2 right-2 bg-black border-2 border-white rounded-full">
                        <X className="text-white" />
                      </View>
                    </TouchableWithoutFeedback>
                  </View>
                  <Text
                    className="text-white mt-1 text-xs w-28 text-clip"
                    ellipsizeMode="tail"
                    numberOfLines={1}
                    style={fonts.regular}
                  >
                    {tab.url}
                  </Text>
                </View>
              </TouchableWithoutFeedback>
            ))}
          </View>
        </ScrollView>
      </View>

      <Menu navigation={navigation} />
      {/* <View className="w-full flex flex-col mt-1">
        {favorites.map((fav, index) => (
          <View
            className="w-full h-15 flex flex-row items-center justify-between"
            key={index}
          >
            <Link
              text={fav.name}
              onPress={() => {
                setURL(fav.url).then(() => {
                  console.log("navigating", fav.url, fav);
                  navigation.navigate("MainView", {
                    url: fav.url,
                  });
                });
              }}
              classOverride="text-white text-xl mt-6"
              isLowerCase={false}
            />
          </View>
        ))}
      </View> */}
    </View>
  );
};
