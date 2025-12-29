import React, { useEffect, useState } from 'react';
import { StatusBar, Linking } from 'react-native';
import * as Font from 'expo-font';
import { MainView } from './components/MainView';
import { FavoritesView } from './components/FavoritesView';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AddFavorite } from './components/AddFavoriteView';
import { SettingsView } from './components/SettingsView';
import { TabsView } from './components/TabsView';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { RecentView } from './components/RecentView';
import { clearNavigation } from './components/utils/app-helper';
import { ManageSearchEnginesView } from './components/ManageSearchEnginesView';
import { AddSearchEngineView } from './components/AddSearchEngineView';
import { initFontPreference } from './styles/fonts';

const Stack = createNativeStackNavigator();

export default function App() {
  const [fontLoaded, setFontLoaded] = useState(false);
  const [initialUrl, setInitialUrl] = useState(null);
  const navigationRef = useNavigationContainerRef();

  useEffect(() => {
    async function initializeApp() {
      // Load fonts first
      await Font.loadAsync({
        NotoSans_Light: require("./assets/fonts/NotoSans_Light.ttf"),
        NotoSans_Regular: require("./assets/fonts/NotoSans_Regular.ttf"),
        NotoSans_SemiBold: require("./assets/fonts/NotoSans_SemiBold.ttf"),
        Selawk: require("./assets/fonts/Selawk.ttf"),
        SelawkLight: require("./assets/fonts/SelawkLight.ttf"),
        SelawkSemiBold: require("./assets/fonts/SelawkSemiBold.ttf"),
        SegoeWP: require("./assets/fonts/SegoeWP.ttf"),
        SegoeWPLight: require("./assets/fonts/SegoeWPLight.ttf"),
        SegoeWPSemiBold: require("./assets/fonts/SegoeWPSemiBold.ttf"),
        SegoeWPN: require("./assets/fonts/SegoeWPN.ttf"),
        SegoeWPNLighter: require("./assets/fonts/SegoeWPN-Light.ttf"),
        SegoeWPNLight: require("./assets/fonts/SegoeWPN-Semilight.ttf"),
        SegoeWPNSemibold: require("./assets/fonts/SegoeWPN-Semibold.ttf"),
        SegoeWPNBold: require("./assets/fonts/SegoeWPN-Bold.ttf"),
      });
      
      // Initialize preferences
      const tabData = await AsyncStorage.getItem("tabs");
      if (!tabData) {
        await AsyncStorage.setItem('tabs', JSON.stringify([{url: "https://www.google.com"}]));
      }
      const quickButton = await AsyncStorage.getItem("quickButton");
      if (!quickButton) await AsyncStorage.setItem('quickButton', 'tabs');
      const searchEngine = await AsyncStorage.getItem("searchEngine");
      if (!searchEngine) await AsyncStorage.setItem('searchEngine', 'google');
      
      // Initialize font preference AFTER fonts are loaded
      await initFontPreference();
      
      setFontLoaded(true);
    }

    // Handle initial URL from app launch (when opened as default browser)
    async function handleInitialUrl() {
      const url = await Linking.getInitialURL();
      if (url) {
        setInitialUrl(url);
        // Update the tab with the incoming URL
        await AsyncStorage.setItem('tabs', JSON.stringify([{url: url}]));
      }
    }

    // Handle URLs when app is already running
    const subscription = Linking.addEventListener('url', async ({ url }) => {
      if (url) {
        setInitialUrl(url);
        // Update the tab with the incoming URL
        await AsyncStorage.setItem('tabs', JSON.stringify([{url: url}]));
        // Navigate to MainView with the new URL if navigation is ready
        if (navigationRef.isReady()) {
          navigationRef.navigate('MainView', { url: url });
        }
      }
    });

    initializeApp();
    clearNavigation();
    handleInitialUrl();

    return () => {
      subscription.remove();
    };
  }, []);

  if (!fontLoaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer ref={navigationRef}>
        <SafeAreaView style={{ flex: 1 }}>
          <StatusBar backgroundColor="black" barStyle="light-content" />
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen 
              name="MainView" 
              component={MainView} 
              initialParams={{ url: initialUrl }}
              options={{ animation: 'slide_from_left' }} 
            />
            <Stack.Screen name="Favourites" component={FavoritesView} options={{ animation: 'slide_from_right' }} />
            <Stack.Screen name="AddToFavourites" component={AddFavorite} options={{ animation: 'slide_from_right' }} />
            <Stack.Screen name="Settings" component={SettingsView} options={{ animation: 'slide_from_right' }} />
            <Stack.Screen name="Recent" component={RecentView} options={{ animation: 'slide_from_right' }} />
            <Stack.Screen name="Tabs" component={TabsView} options={{ animation: 'slide_from_right' }} />
            <Stack.Screen name="ManageSearchEngines" component={ManageSearchEnginesView} options={{ animation: 'slide_from_right' }} />
            <Stack.Screen name="AddSearchEngine" component={AddSearchEngineView} options={{ animation: 'slide_from_right' }} />
          </Stack.Navigator>
        </SafeAreaView>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
