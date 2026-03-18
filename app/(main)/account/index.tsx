import { borderRadius, colors, fontSize, spacing } from "@/constants/theme";
import { useAuth } from "@/src/context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, ActivityIndicator } from "react-native";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "@/src/utils/supabase";

export default function AccountScreen() {
    const router = useRouter();
    const { signOut, session } = useAuth();

    const userEmail = session?.user?.email ?? "user@example.com";
    const userName = session?.user?.user_metadata?.full_name ?? "User";
    const [credits, setCredits] = useState<number | null>(null);
    const [loadingCredits, setLoadingCredits] = useState(true);

    useEffect(() => {
        const fetchCredits = async () => {
            if (!session?.user?.id) return;
            
            try {
                const { data, error } = await supabase
                    .from('user_credits')
                    .select('credit')
                    .eq('user_id', session.user.id)
                    .single();
                    
                if (error) throw error;
                if (data) setCredits(data.credit);
            } catch (error) {
                console.error('Error fetching credits:', error);
            } finally {
                setLoadingCredits(false);
            }
        };

        fetchCredits();
    }, [session?.user?.id]);

    const handleLogout = async () => {
        const { error } = await signOut();
        if (error) {
            Alert.alert("Error", error);
        }
    };

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
                <Text style={styles.profileName}>{userName}</Text>
                <Text style={styles.profileEmail}>{userEmail}</Text>
                <View style={styles.creditsContainer}>
                    <Ionicons name="diamond" size={16} color={colors.primary} />
                    {loadingCredits ? (
                        <ActivityIndicator size="small" color={colors.primary} style={{ marginLeft: spacing.xs }} />
                    ) : (
                        <Text style={styles.creditsText}>{credits ?? 0} Credits</Text>
                    )}
                </View>
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
                    onPress={handleLogout}
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
    creditsContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "rgba(168, 85, 247, 0.1)",
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.xs,
        borderRadius: borderRadius.full,
        marginTop: spacing.sm,
    },
    creditsText: {
        fontSize: fontSize.md,
        fontWeight: "600",
        color: colors.primary,
        marginLeft: spacing.xs,
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
