import AsyncStorage from "@react-native-async-storage/async-storage";
import { addToNavigation } from "./app-helper";

export async function getHistory() {
    const history = await AsyncStorage.getItem("history");
    return history ? JSON.parse(history) : [];
}

export async function addToHistory(url) {
    const history = await getHistory();
    if (history[history.length - 1] === url) {
        return;
    }
    history.push(url);
    await AsyncStorage.setItem("history", JSON.stringify(history));
    await addToNavigation(url);
}

export async function clearHistory() {
    await AsyncStorage.removeItem("history");
}
