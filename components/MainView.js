import { useEffect, useState } from "react"
import { View, Text } from "react-native"
import WebView from "react-native-webview"
import BottomBar from "./BottomBar"
import AsyncStorage from "@react-native-async-storage/async-storage"

export const MainView = () => {

    const [url, setUrl] = useState("");
    const [urlPreview, setUrlPreview] = useState("")

    useEffect(() => {
        async function loadURL() {
            const URL = await AsyncStorage.getItem("url");
            setUrl(URL)
            console.log(URL)
        }

        loadURL()
    }, [])
    
    const onURLChange = (e) => {
        if (typeof e === "string") setUrlPreview(e)
    }

    const onSubmitURL = () => {
        setUrl(urlPreview)
    }

    return (
        <View className="w-full h-full flex flex-col">
            {url!=="" ? (
                <WebView className="flex-1 w-full h-full" source={{ uri: url}} />
            ): (
                <Text className="text-white">Basic Loader. Replace with WP8 Loader</Text>
            )}
            <BottomBar url={url} onURLChange={onURLChange} onSubmitURL={onSubmitURL}/>
        </View>
    )  
}