import React, { useEffect, useState, useMemo } from "react";
import { TouchableWithoutFeedback, View } from "react-native";
import { Copy, Lock, RefreshCw, Star, X } from "react-native-feather";
import Link from "../core/Link";
import { MenuBar } from "../core/MenuBar";
import RoundedButton from "../core/RoundedButton";
import { TextBox } from "../core/TextBox";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";
import * as Animatable from "react-native-animatable";
import Ionicons from "@expo/vector-icons/Ionicons";
import Foundation from "@expo/vector-icons/Foundation";

const AnimatedView = Animatable.createAnimatableComponent(View);

const Menu = ({
  url,
  onURLChange,
  onSubmitURL,
  navigation,
  loader,
  isLoading,
  webViewRef,
  navBarRef,
  keyboardHeight,
}) => {
  const [quickButton, setQuickButton] = useState("tabs");
  const [isReloading, setIsReLoading] = useState(false);
  const isFocused = useIsFocused();

  useEffect(() => {
    const fetchQuickButton = async () => {
      const quickButton = await AsyncStorage.getItem("quickButton");
      setQuickButton(quickButton);
    };
    fetchQuickButton();
  }, [isFocused, navigation]);

  useEffect(() => {
    if (isReloading) {
      webViewRef.current.reload();
      setIsReLoading(false);
    }
  }, [isReloading]);

  const menuOptions = useMemo(() => {
    return (
      <View className="flex flex-col align-left pl-4 py-4">
        <AnimatedView animation="fadeInUp" duration={300} delay={0}>
          <Link
            to={"https://google.com"}
            classOverride="text-2xl"
            text={quickButton === "tabs" ? "favourites" : "tabs"}
            onPress={() =>
              navigation.navigate(
                quickButton === "tabs" ? "Favourites" : "Tabs"
              )
            }
          />
        </AnimatedView>
        <AnimatedView
          animation="fadeInUp"
          duration={300}
          delay={50}
          iterationCount={1}
        >
          <Link
            to={"https://google.com"}
            classOverride="mt-4 text-2xl"
            text="add to favourites"
            onPress={() => {
              navigation.navigate("AddToFavourites", {
                url: url,
              });
            }}
          />
        </AnimatedView>

        <AnimatedView
          animation="fadeInUp"
          duration={300}
          delay={100}
          iterationCount={1}
        >
          <Link
            to={"https://google.com"}
            classOverride="mt-4 text-2xl"
            text="find on page"
            disabled
          />
        </AnimatedView>
        <AnimatedView
          animation="fadeInUp"
          duration={300}
          delay={150}
          iterationCount={1}
        >
          <Link
            to={"https://google.com"}
            classOverride="mt-4 text-2xl"
            text="share page"
            disabled
          />
        </AnimatedView>
        <AnimatedView
          animation="fadeInUp"
          duration={300}
          delay={200}
          iterationCount={1}
        >
          <Link
            to={"https://google.com"}
            classOverride="mt-4 text-2xl"
            text="pin to start"
            disabled
          />
        </AnimatedView>
        <AnimatedView
          animation="fadeInUp"
          duration={300}
          delay={250}
          iterationCount={1}
        >
          <Link
            to={"https://google.com"}
            classOverride="mt-4 text-2xl"
            text="recent"
            onPress={() => navigation.navigate("Recent")}
          />
        </AnimatedView>
        <AnimatedView
          animation="fadeInUp"
          duration={300}
          delay={600}
          iterationCount={1}
        >
          <Link
            to={"https://google.com"}
            classOverride="mt-4 text-2xl"
            text="settings"
            onPress={() => navigation.navigate("Settings")}
          />
        </AnimatedView>
      </View>
    );
  }, [quickButton, url, navigation]);

  return (
    <MenuBar
      controls={
        <>
          <View className="w-[15%] h-full flex justify-center items-center">
            <RoundedButton
              Icon={
                quickButton === "tabs" ? (
                  <Ionicons name="copy-sharp" size={18} color="white" />
                ) : (
                  <Foundation name="star" size={20} color="white" />
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
                <TouchableWithoutFeedback
                  onPress={() => {
                    setIsReLoading(!isReloading);
                  }}
                >
                  {isReloading ? (
                    <X stroke={"black"} width={16} strokeWidth={"3px"} />
                  ) : (
                    <Foundation
                      name="refresh"
                      size={24}
                      color="black"
                      style={{ transform: [{ rotate: "270deg" }] }}
                    />
                  )}
                </TouchableWithoutFeedback>
              </View>
            </View>
          </View>
        </>
      }
      options={menuOptions}
      navBarRef={navBarRef}
      keyboardHeight={keyboardHeight}
    />
  );
};

export default Menu;
