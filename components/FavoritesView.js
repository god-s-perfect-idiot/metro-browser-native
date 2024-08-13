import { ScrollView, StatusBar, Text, View } from "react-native";
import { AppTitle } from "./core/AppTitle";
import { PageTitle } from "./core/Pagetitle";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Link from "./core/Link";
import { fonts } from "../styles/fonts";

export const FavoritesView = ({ navigation }) => {
  const [favorites, setFavorites] = useState([]);

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
    async function loadFavorites() {
      const favs = await AsyncStorage.getItem("favorites");
      if (favs) {
        setFavorites(JSON.parse(favs));
      }
    }
    loadFavorites();
  }, []);
  return (
    <View className="w-full h-full flex flex-col bg-black py-4 pl-4">
      {/* <StatusBar /> */}
      <AppTitle title="Metro Browser" />
      <PageTitle title="phone" />
      <View className="w-full flex flex-col mt-1 h-[88%]">
        {favorites.length === 0 && (
          <Text className="text-[#8a8a8a] text-2xl mt-4" style={fonts.light}>
            No favorites
          </Text>
        )}
        <ScrollView className="flex-1 h-[80%]">
          {favorites.map((fav, index) => (
            <View
              className="w-full h-15 flex flex-row items-center justify-between"
              key={index}
            >
              {/* <Text className="text-white">{fav.name}</Text>
                        <Text className="text-white">{fav.url}</Text> */}
              <Link
                text={fav.name}
                onPress={() => {
                  setURL(fav.url).then(() => {
                    navigation.navigate("MainView", {
                      url: fav.url,
                    });
                  });
                }}
                classOverride="text-white text-xl mt-6 w-full"
                isLowerCase={false}
                numberOfLines={1}
              />
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  );
};
