import { Stack } from "expo-router";

export default function ExploreLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="image-detail/[id]" />
        </Stack>
    );
}
