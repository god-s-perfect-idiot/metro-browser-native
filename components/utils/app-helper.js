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

export const normalizeUrl = (url) => url.replace(/\/+$/, "");

export const isURL = (url) => {
    const urlRegex = new RegExp(
        "^(https?|ftp|file):\\/\\/" +
            "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|((\\d{1,3}\\.){3}\\d{1,3}))" +
            "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" +
            "(\\?[;&a-z\\d%_.~+=-]*)?" +
            "(\\#[-a-z\\d_]*)?$",
        "i"
    );
    return urlRegex.test(url);
};

export const isIncompleteURL = (url) => {
    const incompleteURLRegex = new RegExp(
        "^((https?|ftp|file):\\/\\/)?(www\\.)?[a-zA-Z0-9-]+\\.[a-z]{2,}.*$",
        "i"
    );
    return incompleteURLRegex.test(url);
};