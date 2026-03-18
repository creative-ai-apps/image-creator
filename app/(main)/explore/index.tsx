import { colors, fontSize, spacing, borderRadius } from "@/constants/theme";
import { supabase } from "@/src/utils/supabase";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
    ActivityIndicator,
    Dimensions,
    FlatList,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");
// 3 images per row, subtract paddings
const horizontalPadding = spacing.lg * 2;
const gap = spacing.xs;
const imageSize = (width - horizontalPadding - gap * 2) / 3;

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

export default function ExploreScreen() {
    const router = useRouter();
    const [images, setImages] = useState<GeneratedImage[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchImages = useCallback(async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from("generateimagest")
                .select("*")
                .eq("publicstate", true)
                .order("created_at", { ascending: false });

            if (error) throw error;

            if (data) {
                // Since they are public, we can just use getPublicUrl immediately
                const imagesWithUrls = data.map((item) => {
                    let url = null;
                    if (item.image_path) {
                        const { data: publicData } = supabase.storage
                            .from("generateimagesb")
                            .getPublicUrl(item.image_path);
                        url = publicData.publicUrl;
                    }
                    return {
                        ...item,
                        url,
                    };
                });

                setImages(imagesWithUrls);
            }
        } catch (error) {
            console.error("Error fetching explore images:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchImages();
    }, [fetchImages]);

    const renderEmptyState = () => (
        <View style={styles.emptyState}>
            <Ionicons name="compass-outline" size={64} color={colors.textMuted} />
            <Text style={styles.emptyTitle}>Explore Gallery</Text>
            <Text style={styles.emptySubtitle}>
                Discover and get inspired by AI-generated artwork from the community
            </Text>
        </View>
    );

    const renderItem = ({ item }: { item: GeneratedImage }) => (
        <Pressable
            style={styles.imageContainer}
            onPress={() => router.push(`/(main)/explore/image-detail/${item.id}`)}
        >
            {item.url ? (
                <Image
                    source={{ uri: item.url }}
                    style={styles.image}
                    contentFit="cover"
                    transition={200}
                />
            ) : (
                <View style={[styles.image, styles.imagePlaceholder]}>
                    <Ionicons name="image-outline" size={24} color={colors.textMuted} />
                </View>
            )}
        </Pressable>
    );

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Explore</Text>
            </View>

            {/* Content */}
            <View style={styles.content}>
                {loading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color={colors.primary} />
                    </View>
                ) : (
                    <FlatList
                        data={images}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={renderItem}
                        numColumns={3}
                        contentContainerStyle={
                            images.length === 0 ? styles.emptyListContent : styles.listContent
                        }
                        ListEmptyComponent={renderEmptyState}
                        showsVerticalScrollIndicator={false}
                        columnWrapperStyle={images.length > 0 ? styles.columnWrapper : undefined}
                    />
                )}
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
    content: {
        flex: 1,
        paddingHorizontal: spacing.lg,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    listContent: {
        paddingBottom: spacing.xxl,
    },
    emptyListContent: {
        flex: 1,
        justifyContent: "center",
    },
    columnWrapper: {
        gap: spacing.xs,
        marginBottom: spacing.xs,
    },
    imageContainer: {
        width: imageSize,
        height: imageSize,
        borderRadius: borderRadius.md,
        overflow: "hidden",
    },
    image: {
        width: "100%",
        height: "100%",
        backgroundColor: colors.surface,
    },
    imagePlaceholder: {
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: colors.border,
    },
    emptyState: {
        alignItems: "center",
        gap: spacing.md,
    },
    emptyTitle: {
        fontSize: fontSize.xl,
        fontWeight: "700",
        color: colors.text,
    },
    emptySubtitle: {
        fontSize: fontSize.md,
        color: colors.textSecondary,
        textAlign: "center",
        lineHeight: 22,
        paddingHorizontal: spacing.xl,
    },
});
