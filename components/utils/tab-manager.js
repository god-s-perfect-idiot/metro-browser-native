import React, { useState, useEffect } from 'react';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Image, View } from "react-native";

const dimension = { width: 300, height: 300 };

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
            <View className="w-36 h-32 bg-white">
                {/* {snapshotUri ? ( */}
                    <Image 
                        source={{
                            uri: "https://i.pinimg.com/564x/cd/d5/e4/cdd5e4858eac95d440512d9ea2f747a2.jpg",
                        }} 
                        // style={{ width: '100%', height: '100%' }}
                        // resizeMode="cover"
                        className="w-36 h-32"
                        resizeMode='cover'
                    />
                {/* ) : (
                    <View style={{ width: '100%', height: '100%', backgroundColor: '#f0f0f0' }} />
                )} */}
            </View>
        </View>
    );
}