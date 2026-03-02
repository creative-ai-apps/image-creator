import { Stack, Tabs } from "expo-router";

// Account tab uses a nested Stack so Buy Credits can be pushed on top
function AccountStack() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="buy-credits" />
        </Stack>
    );
}

export default function MainLayout() {
    return (
        <Tabs screenOptions={{ headerShown: false }}>
            <Tabs.Screen
                name="generate"
                options={{ title: "Generate" }}
            />
            <Tabs.Screen
                name="library"
                options={{ title: "Library" }}
            />
            <Tabs.Screen
                name="explore"
                options={{ title: "Explore" }}
            />
            <Tabs.Screen
                name="account"
                options={{ title: "Account" }}
            />
        </Tabs>
    );
}
