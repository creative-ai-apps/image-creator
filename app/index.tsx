import { Redirect } from "expo-router";

// Root index redirects to the auth group entry point.
// The RootGuard in _layout.tsx will handle further redirection
// based on authentication state (auth → welcome, logged in → main tabs).
export default function RootIndex() {
  return <Redirect href="/(auth)" />;
}
