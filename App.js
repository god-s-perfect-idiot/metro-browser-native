import { useEffect, useState } from 'react';
import { StatusBar, View } from 'react-native';
import * as Font from 'expo-font';
import { MainView } from './components/MainView';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {

  // const [url, setUrl] = useState("https://www.google.com");

  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        'noto-sans-light': require('./assets/fonts/NotoSans-Light.ttf'),
        // Add other font styles if needed
      });
    }

    async function probeURL() {
      const url = await AsyncStorage.getItem("url");
      if (!url) await AsyncStorage.setItem('url', 'https://www.google.com')
    }

    loadFonts();
    probeURL();
    
  })

  return (
    <View className="flex-1 items-center justify-center bg-black w-full h-full">
      <StatusBar />
      <MainView/>
    </View>
  );
}
