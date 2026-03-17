import { AuthProvider, useAuth } from "@/src/context/AuthContext";
import { Slot, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";

function RootGuard() {
  const { isLoggedIn, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === "(auth)";
    const inMainGroup = segments[0] === "(main)";

    if (isLoggedIn && inAuthGroup) {
      // Logged in but on auth screens → redirect to main app
      router.replace("/(main)");
    } else if (!isLoggedIn && inMainGroup) {
      // Not logged in but on main screens → redirect to sign in
      router.replace("/(auth)");
    }
  }, [isLoggedIn, isLoading, segments]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#0A0A0F" }}>
        <ActivityIndicator size="large" color="#A855F7" />
      </View>
    );
  }

  return <Slot />;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <StatusBar style="light" />
      <RootGuard />
    </AuthProvider>
  );
}
