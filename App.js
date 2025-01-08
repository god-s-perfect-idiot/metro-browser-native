import React, { useEffect, useState } from 'react';
import { Linking, StatusBar } from 'react-native';
import * as Font from 'expo-font';
import { MainView } from './components/MainView';
import { FavoritesView } from './components/FavoritesView';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AddFavorite } from './components/AddFavoriteView';
import { SettingsView } from './components/SettingsView';
import { TabsView } from './components/TabsView';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { RecentView } from './components/RecentView';
import { clearNavigation } from './components/utils/app-helper';
import { newTab } from './components/utils/tab-manager';

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
        SegoeWP: require("./assets/fonts/segoe.ttf"),
        SegoeWPLight: require("./assets/fonts/segoel.ttf"),
      });
      setFontLoaded(true);
    }

    async function probeURL() {
      const tabData = await AsyncStorage.getItem("tabs");
      if (!tabData) {
        await AsyncStorage.setItem('tabs', JSON.stringify([{url: "https://www.google.com"}]));
      }
      const quickButton = await AsyncStorage.getItem("quickButton");
      if (!quickButton) await AsyncStorage.setItem('quickButton', 'tabs');
      const searchEngine = await AsyncStorage.getItem("searchEngine");
      if (!searchEngine) await AsyncStorage.setItem('searchEngine', 'google');
    }

    probeURL();
    loadFont();
    clearNavigation();
  }, []);

  useEffect(() => {
    const handleUrl = ({url}) => {
      // Handle the URL here
      const searchEngine = AsyncStorage.getItem("searchEngine").then(() => {
        newTab(searchEngine);
        navigation.navigate("MainView", {
          url: tab.url,
        });
      });
    };
  
    // Add event listener for deep links
    Linking.addEventListener('url', handleUrl);
  });

  if (!fontLoaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <SafeAreaView style={{ flex: 1 }}>
          <StatusBar backgroundColor="black" barStyle="light-content" />
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="MainView" component={MainView} options={{ animation: 'slide_from_left' }} />
            <Stack.Screen name="Favourites" component={FavoritesView} options={{ animation: 'slide_from_right' }} />
            <Stack.Screen name="AddToFavourites" component={AddFavorite} options={{ animation: 'slide_from_right' }} />
            <Stack.Screen name="Settings" component={SettingsView} options={{ animation: 'slide_from_right' }} />
            <Stack.Screen name="Recent" component={RecentView} options={{ animation: 'slide_from_right' }} />
            <Stack.Screen name="Tabs" component={TabsView} options={{ animation: 'slide_from_right' }} />
          </Stack.Navigator>
        </SafeAreaView>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
