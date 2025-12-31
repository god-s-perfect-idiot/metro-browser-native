import { ScrollView, StatusBar, Text, View } from "react-native";
import { AppTitle } from "./core/AppTitle";
import { PageTitle } from "./core/Pagetitle";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Link from "./core/Link";
import { Toast } from "./core/Toast";
import { clearHistory, getHistory } from "./utils/history-manager";
import Menu from "./compound/RecentsBottomBar";
import { fonts } from "../styles/fonts";

export const RecentView = ({ navigation }) => {
  const [recent, setRecent] = useState([]);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const showToast = (message) => {
    setToastMessage(message);
    setToastVisible(true);
  };

  async function setURL(url) {
    // await AsyncStorage.setItem("url", url);
    const tabs = await AsyncStorage.getItem("tabs");
    if (tabs) {
      const tempTabs = JSON.parse(tabs);
      tempTabs.unshift({ name: url, url: url });
      await AsyncStorage.setItem("tabs", JSON.stringify(tempTabs));
    }
  }

  useEffect(() => {
    getHistory().then((history) => {
      setRecent(history);
    });
  }, []);
  return (
    <View>
      <View className="w-full h-full flex flex-col bg-black py-4 pl-4">
        {/* <StatusBar /> */}
        <Toast
          visible={toastVisible}
          message={toastMessage}
          type="success"
          onHide={() => setToastVisible(false)}
        />
        <AppTitle title="Metro Browser" />
        <PageTitle title="recent" />
        <View className="w-full flex flex-col mt-1 h-full">
          {recent.length === 0 && (
            <Text className="text-[#8a8a8a] text-2xl mt-4" style={fonts.light}>
              No browsing history
            </Text>
          )}
          <ScrollView className="flex-1">
            {recent.map((recent, index) => (
              <View
                className="w-full h-15 flex flex-row items-center justify-between"
                key={index}
              >
                {/* <Text className="text-white">{recent.name}</Text>
                        <Text className="text-white">{recent.url}</Text> */}
                <Link
                  text={recent}
                  onPress={() => {
                    setURL(recent).then(() => {
                      navigation.navigate("MainView", {
                        url: recent,
                      });
                    });
                  }}
                  classOverride="text-white text-2xl mt-4 ellipsis w-full"
                  isLowerCase={false}
                  helper={recent}
                />
              </View>
            ))}
          </ScrollView>
        </View>
      </View>
      <Menu
        navigation={navigation}
        methods={{
          delete: async () => {
            if (recent.length === 0) return;
            await clearHistory().then(() => {
              setRecent([]);
              showToast("History deleted successfully");
            });
          },
        }}
        props={{ disabled: recent.length === 0 }}
      />
    </View>
  );
};
