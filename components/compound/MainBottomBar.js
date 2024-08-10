import React, { useEffect, useState } from "react";
import { TouchableWithoutFeedback, View } from "react-native";
import { Copy, Lock, RefreshCw, Star, X } from "react-native-feather";
import Link from "../core/Link";
import { MenuBar } from "../core/MenuBar";
import RoundedButton from "../core/RoundedButton";
import { TextBox } from "../core/TextBox";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";
import * as Animatable from "react-native-animatable";

const Menu = ({
  url,
  onURLChange,
  onSubmitURL,
  navigation,
  loader,
  isLoading,
  webViewRef,
}) => {
  const [quickButton, setQuickButton] = useState("tabs");
  const [isReloading, setIsReLoading] = useState(false);
  const isFocused = useIsFocused();

  const AnimatedView = Animatable.createAnimatableComponent(View);

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
                <TouchableWithoutFeedback
                  onPress={() => {
                    setIsReLoading(!isReloading);
                  }}
                >
                  {isReloading ? (
                    <X stroke={"black"} width={16} strokeWidth={"3px"} />
                  ) : (
                    <RefreshCw
                      stroke={"black"}
                      width={16}
                      strokeWidth={"3px"}
                    />
                  )}
                </TouchableWithoutFeedback>
              </View>
            </View>
          </View>
        </>
      }
      options={
        <View className="flex flex-col align-left pl-4 py-4">
          <AnimatedView animation="fadeInUp" duration={300} delay={0}>
            <Link
              to={"https://google.com"}
              classOverride="text-xl"
              text={quickButton === "tabs" ? "favourites" : "tabs"}
              onPress={() =>
                navigation.navigate(
                  quickButton === "tabs" ? "Favourites" : "Tabs"
                )
              }
            />
          </AnimatedView>
          <AnimatedView animation="fadeInUp" duration={300} delay={50}>
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
          </AnimatedView>

          <AnimatedView animation="fadeInUp" duration={300} delay={100}>
            <Link
              to={"https://google.com"}
              classOverride="mt-4 text-xl"
              text="find on page"
              disabled
            />
          </AnimatedView>
          <AnimatedView animation="fadeInUp" duration={300} delay={150}>
            <Link
              to={"https://google.com"}
              classOverride="mt-4 text-xl"
              text="share page"
              disabled
            />
          </AnimatedView>
          <AnimatedView animation="fadeInUp" duration={300} delay={200}>
            <Link
              to={"https://google.com"}
              classOverride="mt-4 text-xl"
              text="pin to start"
              disabled
            />
          </AnimatedView>
          <AnimatedView animation="fadeInUp" duration={300} delay={250}>
            <Link
              to={"https://google.com"}
              classOverride="mt-4 text-xl"
              text="recent"
              onPress={() => navigation.navigate("Recent")}
            />
          </AnimatedView>
          <AnimatedView animation="fadeInUp" duration={300} delay={600}>
            <Link
              to={"https://google.com"}
              classOverride="mt-4 text-xl"
              text="settings"
              onPress={() => navigation.navigate("Settings")}
            />
          </AnimatedView>
        </View>
      }
    />
  );
};

export default Menu;
