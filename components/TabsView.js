import { View } from "react-native";
import { AppTitle } from "./core/AppTitle";
import { PageTitle } from "./core/Pagetitle";
import Menu from "./compound/TabsBottomBar";
import { useState } from "react";

export const TabsView = ({ navigation }) => {
  const [tabs, setTabs] = useState([]);

  return (
    <View className="w-full h-full flex flex-col bg-black">
      {/* <StatusBar /> */}
      <View className="flex-1 p-4">
        <AppTitle title="Tabs" />
        <PageTitle title="phone" />
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
