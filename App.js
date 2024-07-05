import { useEffect, useState } from 'react';
import { StatusBar, View } from 'react-native';
import * as Font from 'expo-font';
import { MainView } from './components/MainView';
import { FavoritesView } from './components/FavoritesView';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AddFavorite } from './components/AddFavoriteView';
import { SettingsView } from './components/SettingsView';
import { TabsView } from './components/TabsView';

const Stack = createNativeStackNavigator();

export default function App() {

  const [fontLoaded, setFontLoaded] = useState(false);

  useEffect(() => {

    async function loadFont() {
      await Font.loadAsync({
        NotoSans_Light: require("./assets/fonts/NotoSans_Light.ttf"),
        NotoSans_Regular: require("./assets/fonts/NotoSans_Regular.ttf"),
        NotoSans_SemiBold: require("./assets/fonts/NotoSans_SemiBold.ttf"),
        Selawk: require("./assets/fonts/selawk.ttf"),
        SelawkLight: require("./assets/fonts/selawkl.ttf"),
        SelawkSemiBold: require("./assets/fonts/selawksb.ttf"),
      });
      setFontLoaded(true);
    }
    async function probeURL() {
      // const tab = await AsyncStorage.getItem("tab");
      // if (!tab) await AsyncStorage.setItem('tab', '0');
      const tabData = await AsyncStorage.getItem("tabs");
      if (!tabData) {
        await AsyncStorage.setItem('tabs', JSON.stringify([{url: "https://www.google.com"}]))
        // await AsyncStorage.setItem('tab', '0');
      };
      const quickButton = await AsyncStorage.getItem("quickButton");
      if (!quickButton) await AsyncStorage.setItem('quickButton', 'tabs');
      // const url = await AsyncStorage.getItem("url");
      // if (!url) await AsyncStorage.setItem('url', 'https://www.google.com')
    }

    probeURL();
    loadFont();
  }, [])


  if (!fontLoaded) {
    return null;
  }    

  return (
    <NavigationContainer>
      <StatusBar />
      <Stack.Navigator screenOptions={
        {
          headerShown: false
        }
      }>
        <Stack.Screen name="MainView" component={MainView} />
        <Stack.Screen name="Favourites" component={FavoritesView} />
        <Stack.Screen name="AddToFavourites" component={AddFavorite}/>
        <Stack.Screen name="Settings" component={SettingsView} />
        <Stack.Screen name="Tabs" component={TabsView} />
      </Stack.Navigator>
      {/* <View className="flex-1 items-center justify-center bg-black w-full h-full">
        <StatusBar />
        <MainView />
      </View> */}
    </NavigationContainer>
  );
}
