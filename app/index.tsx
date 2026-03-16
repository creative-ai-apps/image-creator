import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
    Image,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, borderRadius, fontSize, spacing } from "@/constants/theme";

export default function WelcomeScreen() {
    const router = useRouter();

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="light" />

            {/* Header */}
            <View style={styles.header}>
                <Ionicons name="sparkles" size={28} color={colors.primary} />
                <Text style={styles.headerTitle}>AI Visionary</Text>
            </View>

            {/* Hero Image */}
            <View style={styles.heroContainer}>
                <Image
                    source={require("@/assets/images/welcome-hero.png")}
                    style={styles.heroImage}
                    resizeMode="cover"
                />
            </View>

            {/* Title */}
            <View style={styles.titleContainer}>
                <Text style={styles.titleWhite}>Create Magic</Text>
                <Text style={styles.titlePurple}>with Artificial</Text>
                <Text style={styles.titlePurple}>Intelligence</Text>
            </View>

            {/* Description */}
            <Text style={styles.description}>
                Turn your wildest imaginations into stunning visual art in seconds. The only limit is your prompt.
            </Text>

            {/* Buttons */}
            <View style={styles.buttonsContainer}>
                <Pressable
                    style={({ pressed }) => [
                        styles.buttonPrimary,
                        pressed && styles.buttonPressed,
                    ]}
                    onPress={() => router.push("/(main)")}
                >
                    <Text style={styles.buttonPrimaryText}>Let's Create</Text>
                </Pressable>

                <Pressable
                    style={({ pressed }) => [
                        styles.buttonOutline,
                        pressed && styles.buttonPressed,
                    ]}
                    onPress={() => router.push("/(guest)")}
                >
                    <Text style={styles.buttonOutlineText}>Explore as Guest</Text>
                </Pressable>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        paddingHorizontal: spacing.lg,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: spacing.sm,
        paddingVertical: spacing.md,
    },
    headerTitle: {
        fontSize: fontSize.lg,
        fontWeight: "700",
        color: colors.text,
        letterSpacing: 0.5,
    },
    heroContainer: {
        borderRadius: borderRadius.lg,
        overflow: "hidden",
        marginTop: spacing.sm,
    },
    heroImage: {
        width: "100%",
        height: 280,
        borderRadius: borderRadius.lg,
    },
    titleContainer: {
        alignItems: "center",
        marginTop: spacing.xl,
    },
    titleWhite: {
        fontSize: fontSize.hero,
        fontWeight: "800",
        color: colors.text,
        textAlign: "center",
        lineHeight: 44,
    },
    titlePurple: {
        fontSize: fontSize.hero,
        fontWeight: "800",
        color: colors.primary,
        textAlign: "center",
        lineHeight: 44,
    },
    description: {
        fontSize: fontSize.md,
        color: colors.textSecondary,
        textAlign: "center",
        lineHeight: 24,
        marginTop: spacing.lg,
        paddingHorizontal: spacing.md,
    },
    buttonsContainer: {
        marginTop: "auto",
        gap: spacing.md,
        paddingBottom: spacing.lg,
    },
    buttonPrimary: {
        backgroundColor: colors.primary,
        paddingVertical: spacing.md + 2,
        borderRadius: borderRadius.md,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 12,
        elevation: 8,
    },
    buttonPrimaryText: {
        fontSize: fontSize.lg,
        fontWeight: "700",
        color: colors.text,
    },
    buttonOutline: {
        borderWidth: 1.5,
        borderColor: colors.primary,
        backgroundColor: "rgba(168, 85, 247, 0.08)",
        paddingVertical: spacing.md + 2,
        borderRadius: borderRadius.md,
        alignItems: "center",
        justifyContent: "center",
    },
    buttonOutlineText: {
        fontSize: fontSize.lg,
        fontWeight: "700",
        color: colors.primaryLight,
    },
    buttonPressed: {
        opacity: 0.8,
        transform: [{ scale: 0.98 }],
    },
});
