import { useRouter } from "expo-router";
import { Button, StyleSheet, Text, View } from "react-native";

export default function WelcomeScreen() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <Text>Welcome Screen</Text>
            <Button title="Login" onPress={() => router.push("/(auth)/login")} />
            <Button title="Explore as Guest" onPress={() => router.push("/(auth)/guest-explore")} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        gap: 12,
    },
});
