import { useState } from "react";
import SplashScreen from "@/components/SplashScreen";
import Layout from "@/components/Layout";
import MainPage from "./MainPage";

const Index = () => {
  const [showSplash, setShowSplash] = useState(true);

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  return (
    <Layout>
      <MainPage />
    </Layout>
  );
};

export default Index;
