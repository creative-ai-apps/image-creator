import { useAuth } from "@/context/AuthContext";
import { useRouter } from "expo-router";
import { Button, StyleSheet, Text, View } from "react-native";

export default function SignInScreen() {
    const router = useRouter();
    const { login } = useAuth();

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Sign In</Text>
            <Button title="Sign In" onPress={login} />
            <Button title="Sign Up" onPress={() => router.push("/(auth)/sign-up")} />
            <Button title="Reset Password" onPress={() => router.push("/(auth)/reset-password")} />
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
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
    },
});
