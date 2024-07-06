import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { Copy, Lock, RefreshCw, Star } from "react-native-feather";
import Link from "../core/Link";
import { MenuBar } from "../core/MenuBar";
import RoundedButton from "../core/RoundedButton";
import { TextBox } from "../core/TextBox";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";

const Menu = ({
  url,
  onURLChange,
  onSubmitURL,
  navigation,
  loader,
  isLoading,
}) => {
  const [quickButton, setQuickButton] = useState("tabs");
  const isFocused = useIsFocused();

  useEffect(() => {
    const fetchQuickButton = async () => {
      const quickButton = await AsyncStorage.getItem("quickButton");
      setQuickButton(quickButton);
    };
    fetchQuickButton();
  }, [isFocused, navigation]);

  return (
    <MenuBar
      controls={
        <>
          <View className="w-[15%] h-full flex justify-center items-center">
            <RoundedButton
              Icon={
                quickButton === "tabs" ? (
                  <Copy width={20} stroke={"white"} />
                ) : (
                  <Star width={20} stroke={"white"} />
                )
              }
              action={() => {
                if (quickButton === "tabs") {
                  navigation.navigate("Tabs");
                } else {
                  navigation.navigate("Favourites");
                }
              }}
            />
          </View>
          <View className="w-[70%] h-full flex justify-center items-center ">
            <View className="w-full flex flex-col justify-start items-start bg-[#c9c9c9] my-1">
              {isLoading && (
                <View
                  className={`absolute z-10 ${
                    loader !== 1
                      ? "w-[" + Math.round((loader * 10) / 10) * 100 + "%]"
                      : "w-full"
                  } h-[10%] bg-[#87f]`}
                />
              )}
              <View className="w-full flex flex-row justify-center items-center px-6">
                <Lock stroke={"#828382"} width={16} strokeWidth={"3px"} />
                <TextBox
                  defaultValue={url}
                  onChangeText={onURLChange}
                  onSubmitText={onSubmitURL}
                  classOverrides="!h-10"
                />
                <RefreshCw stroke={"black"} width={16} strokeWidth={"3px"} />
              </View>
            </View>
          </View>
        </>
      }
      options={
        <>
          <Link
            to={"https://google.com"}
            classOverride="text-lg"
            text={quickButton === "tabs" ? "favourites" : "tabs"}
            onPress={() =>
              navigation.navigate(
                quickButton === "tabs" ? "Favourites" : "Tabs"
              )
            }
          />
          <Link
            to={"https://google.com"}
            classOverride="mt-4 text-lg"
            text="add to favourites"
            onPress={() => {
              navigation.navigate("AddToFavourites", {
                url: url,
              });
            }}
          />
          <Link
            to={"https://google.com"}
            classOverride="mt-4 text-lg"
            text="find on page"
            disabled
          />
          <Link
            to={"https://google.com"}
            classOverride="mt-4 text-lg"
            text="share page"
            disabled
          />
          <Link
            to={"https://google.com"}
            classOverride="mt-4 text-lg"
            text="pin to start"
            disabled
          />
          <Link
            to={"https://google.com"}
            classOverride="mt-4 text-lg"
            text="recent"
            disabled
          />
          <Link
            to={"https://google.com"}
            classOverride="mt-4 text-lg"
            text="settings"
            onPress={() => navigation.navigate("Settings")}
          />
        </>
      }
    />
  );
};

export default Menu;
