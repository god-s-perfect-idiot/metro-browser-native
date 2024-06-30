import { StatusBar, Text, View } from "react-native"
import { AppTitle } from "./core/AppTitle"
import { PageTitle } from "./core/Pagetitle"
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Link from "./core/Link";
import WebView from "react-native-webview";

export const FavoritesView = ({ navigation }) => {
    const [favorites, setFavorites] = useState([]);

    async function setURL(url) {
        await AsyncStorage.setItem("url", url);
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
        <View className="w-full h-full flex flex-col bg-black p-4">
            {/* <StatusBar /> */}
            <AppTitle title="Metro Browser"/>
            <PageTitle title="phone"/>
            <View className="w-full flex flex-col mt-1">
                {favorites.map((fav, index) => (
                    <View className="w-full h-15 flex flex-row items-center justify-between" key={index}>
                        {/* <Text className="text-white">{fav.name}</Text>
                        <Text className="text-white">{fav.url}</Text> */}
                        <Link
                            text={fav.name}
                            onPress={() => {
                                setURL(fav.url).then(() => {
                                    console.log("navigating", fav.url, fav)
                                    navigation.navigate("MainView", {
                                        url: fav.url
                                    })
                                });
                            }}
                            classOverride="text-white text-xl mt-6"
                            isLowerCase={false}
                        />
                    </View>
                ))}
            </View>
        </View>
    )
}