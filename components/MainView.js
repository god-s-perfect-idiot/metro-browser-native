import { useEffect, useState } from "react"
import { View, Text, StatusBar } from "react-native"
import WebView from "react-native-webview"
import BottomBar from "./compound/MainBottomBar"
import AsyncStorage from "@react-native-async-storage/async-storage"

export const MainView = ({navigation, route}) => {
    // idk how but this works. god bless react native
    const [url, setUrl] = useState(route && route.params && route.params.url || "https://www.google.com");    
    const [urlPreview, setUrlPreview] = useState("")
    const [agent, setAgent] = useState("")

    useEffect(() => {
        // this wont work
        async function fetchAgent() {
            const agent = await AsyncStorage.getItem("agent");
            switch(agent) {
                case "desktop":
                    setAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko)");
                    break;
                case "mobile":
                    setAgent("Mozilla/5.0 (Linux; Android 11; Pixel 5) AppleWebKit/537.36 (KHTML, like Gecko)");
                    break;
                default:
                    setAgent("Mozilla/5.0 (Linux; Android 11; Pixel 5) AppleWebKit/537.36 (KHTML, like Gecko)");
                    break;
            }
        }
        fetchAgent();
    }, [])

    useEffect(() => {
        

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
                <WebView className="flex-1 w-full h-full" source={{ uri: url}} userAgent={agent}/>
            ): (
                <Text className="text-white">Basic Loader. Replace with WP8 Loader</Text>
            )}
            <BottomBar url={url} onURLChange={onURLChange} onSubmitURL={onSubmitURL} navigation={navigation}/>
        </View>
    )  
}