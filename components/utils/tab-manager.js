import React, { useState, useEffect } from 'react';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Image, View, Text } from "react-native";

const dimension = { width: 300, height: 300 };

// Utility function to extract domain from URL
const getDomainFromUrl = (url) => {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.replace('www.', '');
  } catch (error) {
    // Fallback for invalid URLs
    return url.replace(/^https?:\/\//, '').replace('www.', '').split('/')[0];
  }
};

// Utility function to get favicon URL
const getFaviconUrl = (url) => {
  try {
    const domain = getDomainFromUrl(url);
    const baseUrl = `https://${domain}`;
    
    // Try multiple favicon sources in order of preference
    const faviconSources = [
      `${baseUrl}/favicon.ico`,
      `${baseUrl}/apple-touch-icon.png`,
      `${baseUrl}/apple-touch-icon-precomposed.png`,
      `https://www.google.com/s2/favicons?domain=${domain}&sz=64`,
      `${baseUrl}/favicon-32x32.png`,
      `${baseUrl}/favicon-16x16.png`
    ];
    
    return faviconSources[0]; // Return the first one, we'll handle fallbacks in the component
  } catch (error) {
    return null;
  }
};

// Utility function to get screenshot URL (using multiple free services)
const getScreenshotUrl = (url) => {
  try {
    // Try multiple free screenshot services
    const services = [
      `https://s0.wp.com/mshots/v1/${encodeURIComponent(url)}?w=300&h=200`,
      `https://api.microlink.io/?url=${encodeURIComponent(url)}&screenshot=true&meta=false&embed=screenshot.url`,
      `https://image.thum.io/get/width/300/crop/200/${url}`
    ];
    return services[0]; // Use the first service for now
  } catch (error) {
    return null;
  }
};

// Utility function to get first two letters of domain for fallback
const getDomainInitials = (url) => {
  const domain = getDomainFromUrl(url);
  return domain.substring(0, 2).toUpperCase();
};

// Utility function to get a color based on domain
const getDomainColor = (url) => {
  const domain = getDomainFromUrl(url);
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
    '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
  ];
  const hash = domain.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  return colors[Math.abs(hash) % colors.length];
};

export const Tab = ({ url, showScreenshot = false }) => {
    const [faviconUrl, setFaviconUrl] = useState(null);
    const [screenshotUrl, setScreenshotUrl] = useState(null);
    const [imageError, setImageError] = useState(false);
    const [screenshotError, setScreenshotError] = useState(false);
    const [loading, setLoading] = useState(true);
    const [currentFaviconIndex, setCurrentFaviconIndex] = useState(0);

    // Get all possible favicon sources
    const getAllFaviconSources = (url) => {
        try {
            const domain = getDomainFromUrl(url);
            const baseUrl = `https://${domain}`;
            
            return [
                `${baseUrl}/favicon.ico`,
                `${baseUrl}/apple-touch-icon.png`,
                `${baseUrl}/apple-touch-icon-precomposed.png`,
                `https://www.google.com/s2/favicons?domain=${domain}&sz=64`,
                `${baseUrl}/favicon-32x32.png`,
                `${baseUrl}/favicon-16x16.png`
            ];
        } catch (error) {
            return [];
        }
    };

    useEffect(() => {
        const loadPreview = async () => {
            setLoading(true);
            setImageError(false);
            setScreenshotError(false);
            setCurrentFaviconIndex(0);
            
            // Try to get favicon first
            const faviconSources = getAllFaviconSources(url);
            if (faviconSources.length > 0) {
                setFaviconUrl(faviconSources[0]);
            }
            
            if (showScreenshot) {
                const screenshot = getScreenshotUrl(url);
                setScreenshotUrl(screenshot);
            }
            
            setLoading(false);
        };
        
        loadPreview();
    }, [url, showScreenshot]);

    const handleImageError = () => {
        const faviconSources = getAllFaviconSources(url);
        const nextIndex = currentFaviconIndex + 1;
        
        if (nextIndex < faviconSources.length) {
            setCurrentFaviconIndex(nextIndex);
            setFaviconUrl(faviconSources[nextIndex]);
        } else {
            setImageError(true);
        }
    };

    const handleScreenshotError = () => {
        setScreenshotError(true);
    };

    // Loading state
    if (loading) {
        return (
            <View className="w-28 h-24 bg-white relative overflow-hidden rounded">
                {faviconUrl ? (
                    <View className="relative">
                        <Image 
                            source={{ uri: faviconUrl }}
                            className="w-28 h-24"
                            resizeMode='cover'
                        />
                        {showScreenshot && (
                            <View className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                                <View className="w-2 h-2 bg-white rounded-full animate-pulse"></View>
                            </View>
                        )}
                    </View>
                ) : (
                    <View 
                        className="w-28 h-24 flex items-center justify-center"
                        style={{ backgroundColor: getDomainColor(url) }}
                    >
                        <Text className="text-white font-bold text-lg">
                            {getDomainInitials(url)}
                        </Text>
                    </View>
                )}
            </View>
        );
    }

    // If screenshot is enabled and available, show it
    if (showScreenshot && screenshotUrl && !screenshotError) {
        return (
            <View className="w-28 h-24 bg-white relative overflow-hidden rounded">
                <Image 
                    source={{ uri: screenshotUrl }}
                    className="w-28 h-24"
                    resizeMode='cover'
                    onError={handleScreenshotError}
                />
            </View>
        );
    }

    // Show favicon if available
    if (faviconUrl && !imageError) {
        return (
            <View className="w-28 h-24 bg-white relative overflow-hidden rounded">
                <Image 
                    source={{ uri: faviconUrl }}
                    className="w-28 h-24"
                    resizeMode='cover'
                    onError={handleImageError}
                />
            </View>
        );
    }

    // Fallback to domain initials with colored background
    return (
        <View 
            className="w-28 h-24 flex items-center justify-center rounded"
            style={{ backgroundColor: getDomainColor(url) }}
        >
            <Text className="text-white font-bold text-lg">
                {getDomainInitials(url)}
            </Text>
        </View>
    );
}