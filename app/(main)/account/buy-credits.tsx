import { colors, borderRadius, fontSize, spacing } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function BuyCreditsScreen() {
    const router = useRouter();

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Pressable
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <Ionicons name="arrow-back" size={24} color={colors.text} />
                </Pressable>
                <Text style={styles.headerTitle}>Buy Credits</Text>
                <View style={styles.backButton} />
            </View>

            {/* Credits Info */}
            <View style={styles.creditsCard}>
                <Ionicons name="diamond" size={32} color={colors.primary} />
                <Text style={styles.creditsTitle}>Your Credits</Text>
                <Text style={styles.creditsAmount}>0</Text>
                <Text style={styles.creditsSubtitle}>Purchase credits to generate images</Text>
            </View>

            {/* Plans */}
            <View style={styles.plansSection}>
                <CreditPlan
                    icon="flash-outline"
                    title="Starter"
                    credits="50 Credits"
                    price="$4.99"
                />
                <CreditPlan
                    icon="rocket-outline"
                    title="Popular"
                    credits="200 Credits"
                    price="$14.99"
                    highlighted
                />
                <CreditPlan
                    icon="infinite-outline"
                    title="Pro"
                    credits="500 Credits"
                    price="$29.99"
                />
            </View>
        </SafeAreaView>
    );
}

function CreditPlan({
    icon,
    title,
    credits,
    price,
    highlighted,
}: {
    icon: keyof typeof Ionicons.glyphMap;
    title: string;
    credits: string;
    price: string;
    highlighted?: boolean;
}) {
    return (
        <Pressable
            style={({ pressed }) => [
                styles.planCard,
                highlighted && styles.planCardHighlighted,
                pressed && { opacity: 0.8 },
            ]}
        >
            <View style={styles.planLeft}>
                <View style={[styles.planIcon, highlighted && styles.planIconHighlighted]}>
                    <Ionicons name={icon} size={22} color={highlighted ? colors.text : colors.primary} />
                </View>
                <View>
                    <Text style={styles.planTitle}>{title}</Text>
                    <Text style={styles.planCredits}>{credits}</Text>
                </View>
            </View>
            <Text style={[styles.planPrice, highlighted && styles.planPriceHighlighted]}>{price}</Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
    },
    backButton: {
        width: 44,
        height: 44,
        borderRadius: borderRadius.full,
        backgroundColor: colors.surface,
        alignItems: "center",
        justifyContent: "center",
    },
    headerTitle: {
        fontSize: fontSize.xl,
        fontWeight: "700",
        color: colors.text,
    },
    creditsCard: {
        alignItems: "center",
        backgroundColor: colors.surface,
        marginHorizontal: spacing.lg,
        marginTop: spacing.lg,
        borderRadius: borderRadius.lg,
        paddingVertical: spacing.xl,
        gap: spacing.sm,
        borderWidth: 1,
        borderColor: colors.border,
    },
    creditsTitle: {
        fontSize: fontSize.md,
        color: colors.textSecondary,
    },
    creditsAmount: {
        fontSize: 48,
        fontWeight: "800",
        color: colors.primary,
    },
    creditsSubtitle: {
        fontSize: fontSize.sm,
        color: colors.textMuted,
    },
    plansSection: {
        paddingHorizontal: spacing.lg,
        marginTop: spacing.xl,
        gap: spacing.md,
    },
    planCard: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: colors.surface,
        borderRadius: borderRadius.md,
        padding: spacing.md,
        borderWidth: 1,
        borderColor: colors.border,
    },
    planCardHighlighted: {
        borderColor: colors.primary,
        backgroundColor: "rgba(168, 85, 247, 0.08)",
    },
    planLeft: {
        flexDirection: "row",
        alignItems: "center",
        gap: spacing.md,
    },
    planIcon: {
        width: 44,
        height: 44,
        borderRadius: borderRadius.sm,
        backgroundColor: "rgba(168, 85, 247, 0.15)",
        alignItems: "center",
        justifyContent: "center",
    },
    planIconHighlighted: {
        backgroundColor: colors.primary,
    },
    planTitle: {
        fontSize: fontSize.md,
        fontWeight: "700",
        color: colors.text,
    },
    planCredits: {
        fontSize: fontSize.sm,
        color: colors.textSecondary,
        marginTop: 2,
    },
    planPrice: {
        fontSize: fontSize.lg,
        fontWeight: "800",
        color: colors.text,
    },
    planPriceHighlighted: {
        color: colors.primary,
    },
});
