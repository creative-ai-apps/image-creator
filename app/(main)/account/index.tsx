import { useAuth } from "@/context/AuthContext";
import { colors, borderRadius, fontSize, spacing } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AccountScreen() {
    const router = useRouter();
    const { logout } = useAuth();

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Account</Text>
            </View>

            {/* Profile Section */}
            <View style={styles.profileSection}>
                <View style={styles.avatar}>
                    <Ionicons name="person" size={40} color={colors.primaryLight} />
                </View>
                <Text style={styles.profileName}>User</Text>
                <Text style={styles.profileEmail}>user@example.com</Text>
            </View>

            {/* Menu Items */}
            <View style={styles.menuSection}>
                <Pressable
                    style={({ pressed }) => [
                        styles.menuItem,
                        pressed && styles.menuItemPressed,
                    ]}
                    onPress={() => router.push("/(main)/account/buy-credits")}
                >
                    <View style={styles.menuItemLeft}>
                        <View style={[styles.menuIcon, { backgroundColor: "rgba(168, 85, 247, 0.15)" }]}>
                            <Ionicons name="diamond-outline" size={22} color={colors.primary} />
                        </View>
                        <Text style={styles.menuItemText}>Buy Credits</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
                </Pressable>

                <Pressable
                    style={({ pressed }) => [
                        styles.menuItem,
                        pressed && styles.menuItemPressed,
                    ]}
                    onPress={logout}
                >
                    <View style={styles.menuItemLeft}>
                        <View style={[styles.menuIcon, { backgroundColor: "rgba(239, 68, 68, 0.15)" }]}>
                            <Ionicons name="log-out-outline" size={22} color={colors.danger} />
                        </View>
                        <Text style={[styles.menuItemText, { color: colors.danger }]}>Logout</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
                </Pressable>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        alignItems: "center",
        paddingVertical: spacing.md,
    },
    headerTitle: {
        fontSize: fontSize.xl,
        fontWeight: "700",
        color: colors.text,
    },
    profileSection: {
        alignItems: "center",
        paddingVertical: spacing.xl,
        gap: spacing.sm,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: borderRadius.full,
        backgroundColor: colors.surface,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 2,
        borderColor: colors.primary,
        marginBottom: spacing.sm,
    },
    profileName: {
        fontSize: fontSize.xl,
        fontWeight: "700",
        color: colors.text,
    },
    profileEmail: {
        fontSize: fontSize.sm,
        color: colors.textSecondary,
    },
    menuSection: {
        paddingHorizontal: spacing.lg,
        gap: spacing.sm,
    },
    menuItem: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: colors.surface,
        borderRadius: borderRadius.md,
        padding: spacing.md,
        borderWidth: 1,
        borderColor: colors.border,
    },
    menuItemPressed: {
        opacity: 0.7,
    },
    menuItemLeft: {
        flexDirection: "row",
        alignItems: "center",
        gap: spacing.md,
    },
    menuIcon: {
        width: 40,
        height: 40,
        borderRadius: borderRadius.sm,
        alignItems: "center",
        justifyContent: "center",
    },
    menuItemText: {
        fontSize: fontSize.md,
        fontWeight: "600",
        color: colors.text,
    },
});
