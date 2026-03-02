import { useAuth } from "@/context/AuthContext";
import { useRouter } from "expo-router";
import { Button, StyleSheet, Text, View } from "react-native";

export default function AccountScreen() {
    const router = useRouter();
    const { logout } = useAuth();

    return (
        <View style={styles.container}>
            <Text>Account Screen</Text>
            <Button title="Buy Credits" onPress={() => router.push("/(main)/account/buy-credits")} />
            <Button title="Logout" onPress={logout} />
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
