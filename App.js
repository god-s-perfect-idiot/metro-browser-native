import { useEffect, useState } from 'react';
import { StatusBar, View } from 'react-native';
import * as Font from 'expo-font';
import { MainView } from './components/MainView';
import { FavoritesView } from './components/FavoritesView';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AddFavorite } from './components/AddFavorite';

const Stack = createNativeStackNavigator();

export default function App() {

  useEffect(() => {

    async function probeURL() {
      const url = await AsyncStorage.getItem("url");
      if (!url) await AsyncStorage.setItem('url', 'https://www.google.com')
    }

    probeURL();

  }, [])

  const [fontsLoaded] = Font.useFonts({
    'notoSansLight': require('./assets/fonts/Noto Sans Light.ttf'),
    'notoSansRegular': require('./assets/fonts/Noto Sans Regular.ttf'),
  });
    

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
      </Stack.Navigator>
      {/* <View className="flex-1 items-center justify-center bg-black w-full h-full">
        <StatusBar />
        <MainView />
      </View> */}
    </NavigationContainer>
  );
}
