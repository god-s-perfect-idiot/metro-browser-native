import React, { useEffect } from "react";
import { View } from "react-native";
import { Copy, Lock, RefreshCw } from "react-native-feather";
import Link from "../core/Link";
import { MenuBar } from "../core/MenuBar";
import RoundedButton from "../core/RoundedButton";
import { TextBox } from "../core/TextBox";

const Menu = ({
  url,
  onURLChange,
  onSubmitURL,
  navigation,
  loader,
  isLoading,
}) => {
  useEffect(() => {
    console.log(loader);
  }, [loader]);

  return (
    <MenuBar
      controls={
        <>
          <View className="w-[15%] h-full flex justify-center items-center">
            <RoundedButton Icon={<Copy width={20} stroke={"white"} />} />
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
            classOverride="text-xl"
            text="favourites"
            onPress={() => navigation.navigate("Favourites")}
          />
          <Link
            to={"https://google.com"}
            classOverride="mt-4 text-xl"
            text="add to favourites"
            onPress={() => {
              navigation.navigate("AddToFavourites", {
                url: url,
              });
            }}
          />
          <Link
            to={"https://google.com"}
            classOverride="mt-4 text-xl"
            text="find on page"
            disabled
          />
          <Link
            to={"https://google.com"}
            classOverride="mt-4 text-xl"
            text="share page"
            disabled
          />
          <Link
            to={"https://google.com"}
            classOverride="mt-4 text-xl"
            text="pin to start"
            disabled
          />
          <Link
            to={"https://google.com"}
            classOverride="mt-4 text-xl"
            text="recent"
            disabled
          />
          <Link
            to={"https://google.com"}
            classOverride="mt-4 text-xl"
            text="settings"
            onPress={() => navigation.navigate("Settings")}
          />
        </>
      }
    />
  );
};

export default Menu;
