import { StatusBar, Text, View } from "react-native"
import { AppTitle } from "./core/AppTitle"
import { PageTitle } from "./core/Pagetitle"

export const FavoritesView = () => {
    return (
        <View className="w-full h-full flex flex-col bg-black p-4">
            {/* <StatusBar /> */}
            <AppTitle title="Metro Browser"/>
            <PageTitle title="phone"/>
        </View>
    )
}