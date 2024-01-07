import { StatusBar, View } from "react-native"
import { AppTitle } from "./core/AppTitle"
import { TextBox } from "./core/TextBox"
import Menu from "./compound/AddFavoriteBottomBar"
import AsyncStorage from "@react-native-async-storage/async-storage"

export const AddFavorite = ({
    navigation,
    route
}) => {

    return (
        <View className="w-full h-full flex flex-col bg-black">
            <View className="flex-1 p-4">
                <AppTitle title="Add Favourite"/>
                <View className="w-full h-full flex">
                    <TextBox 
                        title="Name" 
                        classOverrides="mt-12" 
                        placeholder={route.params.url}
                        defaultValue={route.params.url}
                    />
                    <TextBox 
                        title="Web address" 
                        classOverrides="mt-8" 
                        placeholder={route.params.url}
                        defaultValue={route.params.url}
                    />
                </View>
            </View>
            <Menu navigation={navigation} methods={
                {
                    accept: async () => {
                        // validate duplicate name and url later
                        const favs = await AsyncStorage.getItem("favorites");
                        if (favs) {
                            const favsArray = JSON.parse(favs);
                            favsArray.push({
                                name: route.params.url,
                                url: route.params.url
                            })
                            await AsyncStorage.setItem("favorites", JSON.stringify(favsArray));
                        } else {
                            await AsyncStorage.setItem("favorites", JSON.stringify([{
                                name: route.params.url,
                                url: route.params.url
                            }]));
                        }
                        navigation.navigate("MainView")
                    }, 
                    cancel: () => {
                        navigation.navigate("MainView")
                    }
                }
            }/>
        </View>
    )
}