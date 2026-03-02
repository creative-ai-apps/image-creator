import { useRouter } from "expo-router";
import { Button, StyleSheet, Text, View } from "react-native";

export default function GuestExploreScreen() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <Text>Guest Explore Screen</Text>
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
