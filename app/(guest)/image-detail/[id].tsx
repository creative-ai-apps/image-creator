import { colors, borderRadius, fontSize, spacing } from "@/constants/theme";
import { supabase } from "@/src/utils/supabase";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface GeneratedImage {
    id: string;
    user_id: string;
    image_path: string;
    cost: number;
    aspect_ratio: string;
    resolution: string;
    model: string;
    publicstate: boolean;
    prompt: string;
    created_at: string;
    url?: string;
}

export default function GuestImageDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();

    const [imageRecord, setImageRecord] = useState<GeneratedImage | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchImageDetails = async () => {
            if (!id) return;
            
            try {
                setLoading(true);
                const { data, error } = await supabase
                    .from("generateimagest")
                    .select("*")
                    .eq("id", id)
                    .single();

                if (error) throw error;
                
                if (data) {
                    let finalUrl = null;
                    if (data.image_path) {
                        const { data: publicData } = supabase.storage
                            .from("generateimagesb")
                            .getPublicUrl(data.image_path);
                        finalUrl = publicData.publicUrl;
                    }
                    
                    setImageRecord({
                        ...data,
                        url: finalUrl
                    });
                }
            } catch (error: any) {
                console.error("Error fetching guest explore image detail:", error);
                Alert.alert("Error", "Could not load image details.");
                router.back();
            } finally {
                setLoading(false);
            }
        };

        fetchImageDetails();
    }, [id, router]);

    if (loading) {
        return (
            <SafeAreaView style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.primary} />
            </SafeAreaView>
        );
    }

    if (!imageRecord) {
        return (
            <SafeAreaView style={styles.loadingContainer}>
                <Text style={styles.errorText}>Image not found</Text>
                <Pressable style={styles.actionButtonCenter} onPress={() => router.back()}>
                    <Text style={styles.actionButtonText}>Go Back</Text>
                </Pressable>
            </SafeAreaView>
        );
    }

    let aspectRatioNum = 1;
    if (imageRecord.resolution) {
        const [w, h] = imageRecord.resolution.split('x').map(Number);
        if (w && h) aspectRatioNum = w / h;
    }

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
                <Text style={styles.headerTitle}>Artwork Details</Text>
                <View style={styles.backButton} />
            </View>

            <ScrollView 
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Image Display */}
                <View style={styles.imageWrapper}>
                    {imageRecord.url ? (
                        <Image
                            source={{ uri: imageRecord.url }}
                            style={[
                                styles.mainImage,
                                { aspectRatio: aspectRatioNum }
                            ]}
                            contentFit="contain"
                            transition={300}
                        />
                    ) : (
                        <View style={[styles.mainImage, styles.imagePlaceholder, { aspectRatio: aspectRatioNum }]}>
                            <Ionicons name="image-outline" size={48} color={colors.textMuted} />
                        </View>
                    )}
                </View>

                {/* Details Section */}
                <View style={styles.detailsContainer}>
                    {/* Prompt */}
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Prompt Focus</Text>
                        <Text style={styles.promptText}>{imageRecord.prompt || "No prompt provided"}</Text>
                    </View>

                    {/* Metadata Grid */}
                    <View style={styles.metaGrid}>
                        <View style={styles.metaItem}>
                            <Ionicons name="resize" size={18} color={colors.primaryLight} style={styles.metaIcon} />
                            <Text style={styles.metaLabel}>Resolution</Text>
                            <Text style={styles.metaValue}>{imageRecord.resolution}</Text>
                        </View>
                        
                        <View style={styles.metaItem}>
                            <Ionicons name="crop" size={18} color={colors.primaryLight} style={styles.metaIcon} />
                            <Text style={styles.metaLabel}>Aspect Ratio</Text>
                            <Text style={styles.metaValue}>{imageRecord.aspect_ratio}</Text>
                        </View>

                        <View style={styles.metaItem}>
                            <Ionicons name="hardware-chip-outline" size={18} color={colors.primaryLight} style={styles.metaIcon} />
                            <Text style={styles.metaLabel}>Model</Text>
                            <Text style={styles.metaValue}>{imageRecord.model}</Text>
                        </View>
                        
                        <View style={styles.metaItem}>
                            <Ionicons name="calendar-outline" size={18} color={colors.primaryLight} style={styles.metaIcon} />
                            <Text style={styles.metaLabel}>Date Created</Text>
                            <Text style={styles.metaValue}>
                                {new Date(imageRecord.created_at).toLocaleDateString()}
                            </Text>
                        </View>
                    </View>

                    {/* Login Call to Action */}
                    <View style={styles.ctaCard}>
                        <Text style={styles.ctaTitle}>Want to create your own?</Text>
                        <Text style={styles.ctaSubtitle}>Sign up or log in to start generating amazing AI art like this.</Text>
                        <Pressable 
                            style={styles.ctaButton}
                            onPress={() => router.push("/(auth)/signIn")}
                        >
                            <Text style={styles.ctaButtonText}>Log In to Create</Text>
                            <Ionicons name="arrow-forward" size={18} color={colors.background} />
                        </Pressable>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    loadingContainer: {
        flex: 1,
        backgroundColor: colors.background,
        justifyContent: "center",
        alignItems: "center",
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
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: spacing.xxl,
    },
    imageWrapper: {
        width: "100%",
        paddingHorizontal: spacing.lg,
        marginBottom: spacing.xl,
    },
    mainImage: {
        width: "100%",
        borderRadius: borderRadius.lg,
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
    },
    imagePlaceholder: {
        justifyContent: "center",
        alignItems: "center",
        minHeight: 300,
    },
    detailsContainer: {
        paddingHorizontal: spacing.lg,
        gap: spacing.lg,
    },
    detailRow: {
        backgroundColor: colors.surface,
        padding: spacing.md,
        borderRadius: borderRadius.md,
        borderWidth: 1,
        borderColor: colors.border,
    },
    detailLabel: {
        fontSize: fontSize.sm,
        fontWeight: "600",
        color: colors.textSecondary,
        marginBottom: spacing.sm,
        textTransform: "uppercase",
        letterSpacing: 0.5,
    },
    promptText: {
        fontSize: fontSize.md,
        color: colors.text,
        lineHeight: 24,
    },
    metaGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        gap: spacing.sm,
    },
    metaItem: {
        width: "48%",
        backgroundColor: colors.surface,
        padding: spacing.md,
        borderRadius: borderRadius.md,
        borderWidth: 1,
        borderColor: colors.border,
    },
    metaIcon: {
        marginBottom: spacing.xs,
    },
    metaLabel: {
        fontSize: fontSize.xs,
        color: colors.textSecondary,
        marginBottom: 2,
    },
    metaValue: {
        fontSize: fontSize.sm,
        fontWeight: "600",
        color: colors.text,
    },
    ctaCard: {
        backgroundColor: colors.primary + '1A', // Light primary background
        padding: spacing.lg,
        borderRadius: borderRadius.lg,
        borderWidth: 1,
        borderColor: colors.primary + '4D',
        marginTop: spacing.sm,
        alignItems: "center",
    },
    ctaTitle: {
        fontSize: fontSize.lg,
        fontWeight: "700",
        color: colors.primaryLight,
        marginBottom: spacing.xs,
    },
    ctaSubtitle: {
        fontSize: fontSize.sm,
        color: colors.textSecondary,
        textAlign: "center",
        marginBottom: spacing.md,
        lineHeight: 20,
    },
    ctaButton: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: colors.primary,
        paddingHorizontal: spacing.xl,
        paddingVertical: spacing.md,
        borderRadius: borderRadius.full,
        gap: spacing.sm,
    },
    ctaButtonText: {
        color: colors.background,
        fontSize: fontSize.md,
        fontWeight: "700",
    },
    errorText: {
        fontSize: fontSize.lg,
        color: colors.text,
        marginBottom: spacing.md,
    },
    actionButtonCenter: {
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.lg,
        backgroundColor: colors.surface,
        borderRadius: borderRadius.md,
        borderWidth: 1,
        borderColor: colors.border,
    },
    actionButtonText: {
        color: colors.text,
        fontSize: fontSize.md,
        fontWeight: "600",
    },
});
