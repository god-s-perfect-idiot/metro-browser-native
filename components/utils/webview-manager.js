import React, { useState, useRef, useCallback } from "react";
import { Image, View } from "react-native";
import WebView from "react-native-webview";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import ViewShot from "react-native-view-shot";
import { normalizeUrl } from "./app-helper";

// const dimension = { width: 300, height: 300 };


const AppWebView = ({
  preLoad,
  postLoad,
  onLoad,
  url,
  classOverrides,
  webViewRef,
  navBarRef
}) => {
  const [currentUrl, setCurrentUrl] = useState(url);
  const {state, handler} = navBarRef;

  // const html2canvasScript = `
  //   <script src="https://html2canvas.hertzen.com/dist/html2canvas.min.js"></script>
  // `;

  // const captureScreenshot = `
  //   (function() {
  //     if (typeof html2canvas === 'undefined') {
  //       window.ReactNativeWebView.postMessage(JSON.stringify({type: 'error', message: 'html2canvas not loaded'}));
  //       return;
  //     }
  //     html2canvas(document.body).then(function(canvas) {
  //       var screenshot = canvas.toDataURL('image/png');
  //       window.ReactNativeWebView.postMessage(JSON.stringify({type: 'screenshot', data: screenshot}));
  //     }).catch(function(error) {
  //       window.ReactNativeWebView.postMessage(JSON.stringify({type: 'error', message: error.toString()}));
  //     });
  //   })();
  //   true;
  // `;

  const handleCapture = async (uri) => {
    try {
      // const message = JSON.parse(event.nativeEvent.data);
      // if (message.type === "screenshot") {
      console.log("Screenshot captured:", uri);
      await AsyncStorage.setItem(`snap-${normalizeUrl(currentUrl)}`, uri);
      console.log("Screenshot saved for:", currentUrl);
      // } else if (message.type === "error") {
      //   console.error("Screenshot capture error:", message.message);
      // }
    } catch (error) {
      console.error("Failed to process message:", error);
    }
  };

  const handleLoadStart = (event) => {
    const { url } = event.nativeEvent;
    setCurrentUrl(url);
    preLoad(event);
  };

  const handleLoadEnd = (event) => {
    // Delay the screenshot to ensure the page is fully rendered and html2canvas is loaded
    // setTimeout(() => {
    //   webViewRef.current.injectJavaScript(captureScreenshot);
    // }, 2000);
    postLoad(event);
  };

  // return (
  //   <View style={{ flex: 1 }}>
  //     <SafeAreaView>
  //       <ViewShot onCapture={handleCapture()} captureMode="mount">
  //         <WebView
  //           className={classOverrides}
  //           ref={webViewRef}
  //           source={{ uri: url }}
  //           onLoadStart={handleLoadStart}
  //           onLoadEnd={handleLoadEnd}
  //           onLoadProgress={(e) => onLoad(e)}
  //           // onMessage={handleMessage}
  //           // injectedJavaScript={html2canvasScript}
  //         />
  //       </ViewShot>
  //     </SafeAreaView>
  //   </View>
  // );

  // const [source, setSource] = useState(null);
  const onCapture = useCallback((uri) => handleCapture(uri), []);
  return (
    <View
      style={{
        height: "97%",
        display: "flex",
      }}
    >
      {/* <ViewShot onCapture={onCapture} captureMode="mount" style={{
        // flex: 1,
        width: "100%",
        // Trust me
        height: "97%",
        display: "flex",
      }}> */}
      {/* <WebView
          source={{
            uri: 'https://github.com/gre/react-native-view-shot',
          }}
        /> */}
      <WebView
        className={classOverrides}
        ref={webViewRef}
        source={{ uri: url }}
        onLoadStart={handleLoadStart}
        onLoadEnd={handleLoadEnd}
        onLoadProgress={(e) => onLoad(e)}
        onTouchEnd={(e) => {
          if (state) {
            handler(false);
            return false;
          }
          return true;
        }}
      />
      {/* </ViewShot> */}

      {/* <Desc desc="above is a webview and below is a continuous screenshot of it" /> */}

      {/* <Image fadeDuration={0} source={source} /> */}
    </View>
  );
};

export default AppWebView;
