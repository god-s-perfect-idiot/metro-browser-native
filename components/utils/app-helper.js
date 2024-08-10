import AsyncStorage from "@react-native-async-storage/async-storage";

export async function getNavigatedURLs() {
    const navigatedURLs = await AsyncStorage.getItem("navigation");
    return navigatedURLs ? JSON.parse(navigatedURLs) : [];
}

export async function addToNavigation(url) {
    const navigatedURLs = await getNavigatedURLs();
    if (navigatedURLs[navigatedURLs.length - 1] === url) {
        return;
    }
    navigatedURLs.push(url);
    await AsyncStorage.setItem("navigation", JSON.stringify(navigatedURLs));
    console.log("added to navigation", url, navigatedURLs);
}

export async function popNavigation() {
    const navigatedURLs = await getNavigatedURLs();
    navigatedURLs.pop();
    await AsyncStorage.setItem("navigation", JSON.stringify(navigatedURLs));
    return navigatedURLs[navigatedURLs.length - 1];
}

export async function clearNavigation() {
    await AsyncStorage.removeItem("navigation");
    const tabsRaw = await AsyncStorage.getItem("tabs");
    const tabs = JSON.parse(tabsRaw);
    const url = tabs[0].url;
    await addToNavigation(url);
}
