import { AuthProvider, useAuth } from "@/context/AuthContext";
import { Slot, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";

function RootGuard() {
  const { isLoggedIn } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const inAuthGroup = segments[0] === "(auth)";
    const inMainGroup = segments[0] === "(main)";

    if (isLoggedIn && inAuthGroup) {
      // Logged in but on auth screens → redirect to main app
      router.replace("/(main)");
    } else if (!isLoggedIn && inMainGroup) {
      // Not logged in but on main screens → redirect to sign in
      router.replace("/(auth)");
    }
  }, [isLoggedIn, segments]);

  return <Slot />;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootGuard />
    </AuthProvider>
  );
}
