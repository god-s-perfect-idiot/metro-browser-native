import React, { useState, useEffect } from 'react';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Image, View } from "react-native";

const dimension = { width: 300, height: 300 };

export const newTab = async (loadUrl = "") => {
    AsyncStorage.getItem("tabs").then((tabs) => {
        let url = loadUrl ||"";
        switch (searchEngine) {
          case "google":
            url = "https://www.google.com";
            break;
          case "bing":
            url = "https://www.bing.com";
            break;
          case "duckduckgo":
            url = "https://www.duckduckgo.com";
            break;
          case "yahoo":
            url = "https://www.yahoo.com";
            break;
          default:
            url = "https://www.google.com";
            break;
        }
        const newTabs = tabs
          ? JSON.parse(tabs).concat({
              url: url,
            })
          : [{ url: url }];
        AsyncStorage.setItem("tabs", JSON.stringify(newTabs));
          });
}

export const Tab = ({ url }) => {
    // const [snapshotUri, setSnapshotUri] = useState(null);

    // useEffect(() => {
    //     const fetchSnapshot = async () => {
    //         try {
    //             const uri = await AsyncStorage.getItem(`snap-${url}`);
    //             console.log("Snapshot URI:", uri);
    //             if (uri !== null) {
    //                 console.log("Retrieved snapshot for:", url);
    //                 setSnapshotUri(uri);
    //             }
    //         } catch (error) {
    //             console.error("Failed to retrieve snapshot:", error);
    //         }
    //     };

    //     fetchSnapshot();
    // }, [url]);

    return (
        <View className="flex flex-col mr-8 mb-8">
            <View className="w-28 h-24 bg-white">
                {/* {snapshotUri ? ( */}
                    <Image 
                        source={{
                            uri: "https://i.pinimg.com/564x/cd/d5/e4/cdd5e4858eac95d440512d9ea2f747a2.jpg",
                        }} 
                        // style={{ width: '100%', height: '100%' }}
                        // resizeMode="cover"
                        className="w-28 h-24"
                        resizeMode='cover'
                    />
                {/* ) : (
                    <View style={{ width: '100%', height: '100%', backgroundColor: '#f0f0f0' }} />
                )} */}
            </View>
        </View>
    );
}