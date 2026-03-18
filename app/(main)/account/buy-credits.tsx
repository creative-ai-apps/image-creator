import { colors, borderRadius, fontSize, spacing } from "@/constants/theme";
import { useAuth } from "@/src/context/AuthContext";
import { supabase } from "@/src/utils/supabase";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { 
    ActivityIndicator, 
    Alert, 
    Modal, 
    Pressable, 
    StyleSheet, 
    Text, 
    View 
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface CreditPlanProps {
    id: string;
    icon: keyof typeof Ionicons.glyphMap;
    title: string;
    creditsStr: string;
    creditsNum: number;
    price: string;
    highlighted?: boolean;
}

const PLANS: CreditPlanProps[] = [
    {
        id: "starter",
        icon: "flash-outline",
        title: "Starter",
        creditsStr: "1000 Credits",
        creditsNum: 1000,
        price: "10 TL",
    },
    {
        id: "popular",
        icon: "rocket-outline",
        title: "Popular",
        creditsStr: "5000 Credits",
        creditsNum: 5000,
        price: "50 TL",
        highlighted: true,
    },
    {
        id: "pro",
        icon: "infinite-outline",
        title: "Pro",
        creditsStr: "10000 Credits",
        creditsNum: 10000,
        price: "100 TL",
    },
];

export default function BuyCreditsScreen() {
    const router = useRouter();
    const { session } = useAuth();
    
    const [credits, setCredits] = useState<number>(0);
    const [loadingCredits, setLoadingCredits] = useState(true);
    
    const [selectedPlan, setSelectedPlan] = useState<CreditPlanProps | null>(null);
    const [isPurchasing, setIsPurchasing] = useState(false);

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
                console.error('Error fetching credits in buy-credits:', error);
            } finally {
                setLoadingCredits(false);
            }
        };

        fetchCredits();
    }, [session?.user?.id]);

    const handlePurchase = async () => {
        if (!session?.user?.id || !selectedPlan) return;
        
        try {
            setIsPurchasing(true);
            
            const newCreditTotal = credits + selectedPlan.creditsNum;
            
            const { error } = await supabase
                .from('user_credits')
                .update({ credit: newCreditTotal })
                .eq('user_id', session.user.id);
                
            if (error) throw error;
            
            setCredits(newCreditTotal);
            setSelectedPlan(null);
            
            Alert.alert(
                "Purchase Successful",
                `You have successfully purchased ${selectedPlan.creditsStr} for ${selectedPlan.price}.`
            );
        } catch (error: any) {
            console.error("Error purchasing credits:", error);
            Alert.alert("Purchase Failed", "Could not complete your purchase. Please try again.");
        } finally {
            setIsPurchasing(false);
        }
    };

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
                {loadingCredits ? (
                    <ActivityIndicator size="large" color={colors.primary} style={{ marginVertical: 8 }} />
                ) : (
                    <Text style={styles.creditsAmount}>{credits}</Text>
                )}
                <Text style={styles.creditsSubtitle}>Purchase credits to generate images</Text>
            </View>

            {/* Plans */}
            <View style={styles.plansSection}>
                {PLANS.map((plan) => (
                    <CreditPlan
                        key={plan.id}
                        {...plan}
                        onPress={() => setSelectedPlan(plan)}
                    />
                ))}
            </View>

            {/* Purchase Confirmation Modal */}
            <Modal
                visible={!!selectedPlan}
                transparent
                animationType="fade"
                onRequestClose={() => !isPurchasing && setSelectedPlan(null)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalIconContainer}>
                            <Ionicons name="cart-outline" size={36} color={colors.primary} />
                        </View>
                        <Text style={styles.modalTitle}>Confirm Purchase</Text>
                        
                        {selectedPlan && (
                            <View style={styles.modalDetails}>
                                <Text style={styles.modalDetailText}>
                                    You are about to purchase <Text style={styles.boldText}>{selectedPlan.creditsStr}</Text>.
                                </Text>
                                <Text style={styles.modalDetailText}>
                                    Total Price: <Text style={styles.boldText}>{selectedPlan.price}</Text>
                                </Text>
                            </View>
                        )}

                        <View style={styles.modalActions}>
                            <Pressable 
                                style={[styles.modalButton, styles.modalButtonCancel]}
                                onPress={() => setSelectedPlan(null)}
                                disabled={isPurchasing}
                            >
                                <Text style={styles.modalButtonCancelText}>Cancel</Text>
                            </Pressable>
                            
                            <Pressable 
                                style={[styles.modalButton, styles.modalButtonConfirm]}
                                onPress={handlePurchase}
                                disabled={isPurchasing}
                            >
                                {isPurchasing ? (
                                    <ActivityIndicator size="small" color={colors.background} />
                                ) : (
                                    <Text style={styles.modalButtonConfirmText}>Buy Now</Text>
                                )}
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

function CreditPlan({
    icon,
    title,
    creditsStr,
    price,
    highlighted,
    onPress,
}: CreditPlanProps & { onPress: () => void }) {
    return (
        <Pressable
            style={({ pressed }) => [
                styles.planCard,
                highlighted && styles.planCardHighlighted,
                pressed && { opacity: 0.8 },
            ]}
            onPress={onPress}
        >
            <View style={styles.planLeft}>
                <View style={[styles.planIcon, highlighted && styles.planIconHighlighted]}>
                    <Ionicons name={icon} size={22} color={highlighted ? colors.text : colors.primary} />
                </View>
                <View>
                    <Text style={styles.planTitle}>{title}</Text>
                    <Text style={styles.planCredits}>{creditsStr}</Text>
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
    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: spacing.xl,
    },
    modalContent: {
        width: '100%',
        backgroundColor: colors.surface,
        borderRadius: borderRadius.lg,
        padding: spacing.xl,
        alignItems: 'center',
    },
    modalIconContainer: {
        width: 72,
        height: 72,
        borderRadius: 36,
        backgroundColor: 'rgba(168, 85, 247, 0.15)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.md,
    },
    modalTitle: {
        fontSize: fontSize.xl,
        fontWeight: '700',
        color: colors.text,
        marginBottom: spacing.lg,
    },
    modalDetails: {
        backgroundColor: colors.background,
        padding: spacing.md,
        borderRadius: borderRadius.md,
        width: '100%',
        gap: spacing.sm,
        marginBottom: spacing.xl,
    },
    modalDetailText: {
        fontSize: fontSize.md,
        color: colors.textSecondary,
        textAlign: 'center',
        lineHeight: 22,
    },
    boldText: {
        fontWeight: '700',
        color: colors.text,
    },
    modalActions: {
        flexDirection: 'row',
        gap: spacing.md,
        width: '100%',
    },
    modalButton: {
        flex: 1,
        paddingVertical: spacing.md,
        borderRadius: borderRadius.full,
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalButtonCancel: {
        backgroundColor: colors.background,
        borderWidth: 1,
        borderColor: colors.border,
    },
    modalButtonCancelText: {
        color: colors.text,
        fontSize: fontSize.md,
        fontWeight: '600',
    },
    modalButtonConfirm: {
        backgroundColor: colors.primary,
    },
    modalButtonConfirmText: {
        color: colors.background,
        fontSize: fontSize.md,
        fontWeight: '600',
    },
});
