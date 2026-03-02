import { useAuth } from "@/context/AuthContext";
import { useRouter } from "expo-router";
import { Button, StyleSheet, Text, View } from "react-native";

export default function LoginScreen() {
    const router = useRouter();
    const { login } = useAuth();

    return (
        <View style={styles.container}>
            <Text>Login / Register Screen</Text>
            <Button title="Login" onPress={login} />
            <Button title="Back" onPress={() => router.back()} />
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
