import { useEffect, useState } from "react"
import { View, Text, StatusBar } from "react-native"
import WebView from "react-native-webview"
import BottomBar from "./compound/MainBottomBar"
import AsyncStorage from "@react-native-async-storage/async-storage"

export const MainView = ({navigation, route}) => {
    // idk how but this works. god bless react native
    const [url, setUrl] = useState(route && route.params && route.params.url || "https://www.google.com");
    const [urlPreview, setUrlPreview] = useState("")

    useEffect(() => {

        // async function loadURL() {
        //     const URL = await AsyncStorage.getItem("url");
        //     setUrl(URL)
        // }

        setUrl(route && route.params && route.params.url || "https://www.google.com")
    }, [route])
    
    const onURLChange = (e) => {
        if (typeof e === "string") setUrlPreview(e)
    }

    const onSubmitURL = () => {
        setUrl(urlPreview)
    }

    return (
        <View className="w-full h-full flex flex-col">
            {/* <StatusBar /> */}
            {url!=="" ? (
                <WebView className="flex-1 w-full h-full" source={{ uri: url}} />
            ): (
                <Text className="text-white">Basic Loader. Replace with WP8 Loader</Text>
            )}
            <BottomBar url={url} onURLChange={onURLChange} onSubmitURL={onSubmitURL} navigation={navigation}/>
        </View>
    )  
}