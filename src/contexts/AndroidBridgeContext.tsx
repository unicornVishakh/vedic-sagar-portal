import React, { createContext, useContext, useState, useEffect } from 'react';

// This tells TypeScript about our native bridge
interface AndroidInterface {
  speak: (text: string) => void;
  stop: () => void;
}
declare global {
  interface Window {
    Android?: AndroidInterface;
    // This is the new function Android will call from onPageFinished
    androidBridgeReady?: () => void;
  }
}

interface BridgeContextType {
  isBridgeReady: boolean;
}

// 1. Create the context
const AndroidBridgeContext = createContext<BridgeContextType>({
  isBridgeReady: false,
});

// 2. Create a hook to easily use the context
export const useAndroidBridge = () => useContext(AndroidBridgeContext);

// 3. Create the Provider component
export const AndroidBridgeProvider = ({ children }: { children: React.ReactNode }) => {
  const [isBridgeReady, setIsBridgeReady] = useState(false);

  useEffect(() => {
    // 1. Expose the function for Android to call
    window.androidBridgeReady = () => {
      console.log("Android Bridge is now ready!");
      setIsBridgeReady(true);
    };

    // 2. Fallback: Check if bridge is *already* ready
    // (in case the event fired before React hydrated)
    if (window.Android && window.Android.speak) {
       console.log("Android Bridge was already ready.");
       setIsBridgeReady(true);
    }
    
    // 3. Cleanup function
    return () => {
      delete window.androidBridgeReady;
    };
  }, []);

  return (
    <AndroidBridgeContext.Provider value={{ isBridgeReady }}>
      {children}
    </AndroidBridgeContext.Provider>
  );
};
