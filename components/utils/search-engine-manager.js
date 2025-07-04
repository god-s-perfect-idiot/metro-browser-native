import AsyncStorage from "@react-native-async-storage/async-storage";

// Default search engines
const DEFAULT_SEARCH_ENGINES = [
  {
    id: "google",
    name: "Google",
    url: "https://www.google.com/search?q={q}",
    icon: "🔍"
  },
  {
    id: "bing",
    name: "Bing",
    url: "https://www.bing.com/search?q={q}",
    icon: "🔎"
  },
  {
    id: "yahoo",
    name: "Yahoo",
    url: "https://search.yahoo.com/search?p={q}",
    icon: "📧"
  },
  {
    id: "duckduckgo",
    name: "DuckDuckGo",
    url: "https://www.duckduckgo.com/?q={q}",
    icon: "🦆"
  },
  {
    id: "ecosia",
    name: "Ecosia",
    url: "https://www.ecosia.org/search?q={q}",
    icon: "🌱"
  }
];

// Get all search engines (default + custom)
export const getAllSearchEngines = async () => {
  try {
    const customEnginesData = await AsyncStorage.getItem("customSearchEngines");
    const customEngines = customEnginesData ? JSON.parse(customEnginesData) : [];
    
    // Ensure customEngines is an array
    const validCustomEngines = Array.isArray(customEngines) ? customEngines : [];
    
    return [...DEFAULT_SEARCH_ENGINES, ...validCustomEngines];
  } catch (error) {
    console.error("Error getting search engines:", error);
    return DEFAULT_SEARCH_ENGINES;
  }
};

// Get default search engine
export const getDefaultSearchEngine = async () => {
  try {
    const defaultEngine = await AsyncStorage.getItem("searchEngine");
    return defaultEngine || "google";
  } catch (error) {
    console.error("Error getting default search engine:", error);
    return "google";
  }
};

// Set default search engine
export const setDefaultSearchEngine = async (engineId) => {
  try {
    if (!engineId) {
      console.warn("No engine ID provided for setDefaultSearchEngine");
      return;
    }
    await AsyncStorage.setItem("searchEngine", engineId);
  } catch (error) {
    console.error("Error setting default search engine:", error);
  }
};

// Get search engine by ID
export const getSearchEngineById = async (engineId) => {
  try {
    if (!engineId) {
      console.warn("No engine ID provided for getSearchEngineById");
      return null;
    }
    const allEngines = await getAllSearchEngines();
    return allEngines.find(engine => engine.id === engineId) || null;
  } catch (error) {
    console.error("Error getting search engine by ID:", error);
    return null;
  }
};

// Add custom search engine
export const addCustomSearchEngine = async (engine) => {
  try {
    if (!engine || !engine.name || !engine.url) {
      throw new Error("Invalid engine data provided");
    }
    
    const customEnginesData = await AsyncStorage.getItem("customSearchEngines");
    const customEngines = customEnginesData ? JSON.parse(customEnginesData) : [];
    
    // Ensure customEngines is an array
    const validCustomEngines = Array.isArray(customEngines) ? customEngines : [];
    
    // Generate unique ID
    const newEngine = {
      ...engine,
      id: `custom_${Date.now()}`,
      icon: engine.icon || "🔍"
    };
    
    validCustomEngines.push(newEngine);
    await AsyncStorage.setItem("customSearchEngines", JSON.stringify(validCustomEngines));
    
    return newEngine;
  } catch (error) {
    console.error("Error adding custom search engine:", error);
    throw error;
  }
};

// Remove custom search engine
export const removeCustomSearchEngine = async (engineId) => {
  try {
    if (!engineId) {
      throw new Error("No engine ID provided for removal");
    }
    
    const customEnginesData = await AsyncStorage.getItem("customSearchEngines");
    const customEngines = customEnginesData ? JSON.parse(customEnginesData) : [];
    
    // Ensure customEngines is an array
    const validCustomEngines = Array.isArray(customEngines) ? customEngines : [];
    
    const updatedEngines = validCustomEngines.filter(engine => engine.id !== engineId);
    await AsyncStorage.setItem("customSearchEngines", JSON.stringify(updatedEngines));
    
    // If the removed engine was the default, reset to Google
    const currentDefault = await getDefaultSearchEngine();
    if (currentDefault === engineId) {
      await setDefaultSearchEngine("google");
    }
  } catch (error) {
    console.error("Error removing custom search engine:", error);
    throw error;
  }
};

// Update custom search engine
export const updateCustomSearchEngine = async (engineId, updates) => {
  try {
    if (!engineId) {
      throw new Error("No engine ID provided for update");
    }
    
    const customEnginesData = await AsyncStorage.getItem("customSearchEngines");
    const customEngines = customEnginesData ? JSON.parse(customEnginesData) : [];
    
    // Ensure customEngines is an array
    const validCustomEngines = Array.isArray(customEngines) ? customEngines : [];
    
    const updatedEngines = validCustomEngines.map(engine => 
      engine.id === engineId ? { ...engine, ...updates } : engine
    );
    
    await AsyncStorage.setItem("customSearchEngines", JSON.stringify(updatedEngines));
  } catch (error) {
    console.error("Error updating custom search engine:", error);
    throw error;
  }
};

// Build search URL
export const buildSearchUrl = async (query, engineId = null) => {
  try {
    if (!query) {
      console.warn("No query provided for buildSearchUrl");
      return "https://www.google.com";
    }
    
    const targetEngineId = engineId || await getDefaultSearchEngine();
    const engine = await getSearchEngineById(targetEngineId);
    
    if (!engine) {
      // Fallback to Google if engine not found
      return `https://www.google.com/search?q=${encodeURIComponent(query)}`;
    }
    
    // Replace {q} placeholder with the actual query
    const searchUrl = engine.url.replace('{q}', encodeURIComponent(query));
    return searchUrl;
  } catch (error) {
    console.error("Error building search URL:", error);
    return `https://www.google.com/search?q=${encodeURIComponent(query)}`;
  }
}; 