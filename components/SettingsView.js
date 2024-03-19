import { Text, View } from "react-native"
import { AppTitle } from "./core/AppTitle"
import { PageTitle } from "./core/Pagetitle"
import { TextBox } from "./core/TextBox"
import { Select } from "./core/Select"
import { fonts } from "../styles/fonts"
import { Button } from "./core/Button"
import Link from "./core/Link"
import AsyncStorage from "@react-native-async-storage/async-storage"

export const SettingsView = ({ navigation }) => {
    return (
        <View className="flex flex-col w-full h-full bg-black p-4">
            <AppTitle title="Settings"/>
            <PageTitle title="Metro Browser" isUpperCase/>
            <View className="flex flex-col mt-6">
                <Select 
                    options = {[
                        {name: "mobile version", value: "mobile"},
                        {name: "desktop version", value: "desktop"}
                    ]}
                    defaultValue="mobile"
                    title="Website Preference"
                    onChange = { async (option) => {
                        switch (option.value) {
                            case "mobile":
                                await AsyncStorage.setItem("agent", "mobile");
                                break;
                            case "desktop":
                                await AsyncStorage.setItem("agent", "desktop");
                                break;
                        }
                        
                    }}
                />
                <Select 
                    options = {[
                        {name: "tabs", value: "tabs"},
                        {name: "favourites", value: "favourites"}
                    ]}
                    defaultValue="tabs"
                    title="Use address bar button for"
                    onChange = {(option) => {
                        console.log(option);
                    }}
                    classOverride="mt-6"
                />
                <Text className="text-[#b0b0b0] text-sm mt-6" style={fonts.light}>
                    We'll download full web pages.
                </Text>
            </View>
            <View className="flex flex-col mt-20">
                <Button 
                    text="delete history"
                    onPress={() => {
                        console.log("clearing history")
                    }}
                    classOverride="w-[40%]"
                />
                <Text className="text-[#b0b0b0] text-sm mt-8" style={fonts.light}>
                    Deletes all your browsing history, cookies and temporary Internet files from your phone.
                </Text>
                <Link classOverride="mt-6 underline text-sm" text="Privacy Statement" isLowerCase={false}/>
                <Link classOverride="mt-6 underline text-sm" text="Learn about these settings" isLowerCase={false}/>
            </View>
        </View>
    )
}