import { colors, fontSize, spacing, borderRadius } from "@/constants/theme";
import { requestImageGeneration } from "@/src/utils/runware";
import { supabase } from "@/src/utils/supabase";
import { useAuth } from "@/src/context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useState, useCallback } from "react";
import {
    ActivityIndicator,
    Alert,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
    Switch,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const DIMENSIONS = [
    { label: "1:1", width: 1024, height: 1024 },
    { label: "3:4", width: 768, height: 1024 },
    { label: "4:3", width: 1024, height: 768 },
    { label: "9:16", width: 576, height: 1024 },
    { label: "16:9", width: 1024, height: 576 },
];

const STEPS_MIN = 1;
const STEPS_MAX = 50;
const CFG_MIN = 1;
const CFG_MAX = 20;

export default function GenerateScreen() {
    const { session } = useAuth();
    const userId = session?.user?.id;
    const [prompt, setPrompt] = useState("");
    const [negativePrompt, setNegativePrompt] = useState("");
    const [showNegativePrompt, setShowNegativePrompt] = useState(false);
    const [selectedDimIndex, setSelectedDimIndex] = useState(0);
    const [steps, setSteps] = useState(30);
    const [cfgScale, setCfgScale] = useState(7);
    const [isPublic, setIsPublic] = useState(false);
    const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);

    const selectedDim = DIMENSIONS[selectedDimIndex];

    const handleGenerate = useCallback(async () => {
        const trimmed = prompt.trim();
        if (!trimmed) {
            Alert.alert("Prompt Required", "Please enter a prompt to generate an image.");
            return;
        }
        
        if (!userId) {
            Alert.alert("Authentication Required", "Please log in to generate images.");
            return;
        }

        setIsGenerating(true);
        setGeneratedImageUrl(null);

        // 1. Check user credits
        try {
            const { data: creditData, error: creditError } = await supabase
                .from('user_credits')
                .select('credit')
                .eq('user_id', userId)
                .single();

            if (creditError) {
                console.error("Credit fetch error:", creditError);
                throw new Error("Could not verify user credits.");
            }

            const currentCredits = creditData?.credit || 0;
            const COST = 10;

            if (currentCredits < COST) {
                Alert.alert("Insufficient Credits", "You do not have enough credits to generate an image.");
                setIsGenerating(false);
                return;
            }
        } catch (error: any) {
            Alert.alert("Error", error.message || "Failed to check credits.");
            setIsGenerating(false);
            return;
        }

        try {
            const images = await requestImageGeneration({
                positivePrompt: trimmed,
                ...(negativePrompt.trim() ? { negativePrompt: negativePrompt.trim() } : {}),
                model: "runware:101@1",
                width: selectedDim.width,
                height: selectedDim.height,
                steps,
                CFGScale: cfgScale,
                numberResults: 1,
            });

            if (images && images.length > 0 && images[0].imageURL) {
                const runwareUrl = images[0].imageURL;
                
                try {
                    // Fetch the generated image
                    const response = await fetch(runwareUrl);
                    const arrayBuffer = await response.arrayBuffer();
                    
                    const fileName = `${Date.now()}_generated.jpg`;
                    
                    // Upload to Storage without complex metadata (since React Native sometimes drops these headers)
                    const { data: uploadData, error: uploadError } = await supabase.storage
                        .from('generateimagesb')
                        .upload(fileName, arrayBuffer, {
                            contentType: 'image/jpeg',
                            cacheControl: '3600',
                            upsert: false,
                        });
                        
                    if (uploadError) {
                        console.error('Upload Error:', uploadError);
                        setGeneratedImageUrl(runwareUrl);
                    } else {
                        // Insert the metadata directly into the database
                        const { error: dbError } = await supabase
                            .from('generateimagest')
                            .insert({
                                user_id: userId,
                                image_path: fileName,
                                cost: 10,
                                aspect_ratio: selectedDim.label,
                                resolution: `${selectedDim.width}x${selectedDim.height}`,
                                model: "StableDiffusion",
                                publicstate: isPublic,
                                prompt: trimmed
                            });

                        if (dbError) {
                            console.error('DB Insert Error:', dbError);
                        }

                        if (isPublic) {
                            const { data: publicUrlData } = supabase.storage
                                .from('generateimagesb')
                                .getPublicUrl(fileName);
                            setGeneratedImageUrl(publicUrlData.publicUrl);
                        } else {
                            const { data: signedData, error: signedError } = await supabase.storage
                                .from('generateimagesb')
                                .createSignedUrl(fileName, 3600);
                            
                            if (signedData?.signedUrl) {
                                setGeneratedImageUrl(signedData.signedUrl);
                            } else {
                                setGeneratedImageUrl(runwareUrl);
                            }
                        }
                    }
                } catch (storageError) {
                    console.error('Storage operation failed:', storageError);
                    setGeneratedImageUrl(runwareUrl);
                }
            }
        } catch (error: any) {
            Alert.alert(
                "Generation Failed",
                error?.message || "Something went wrong. Please try again."
            );
        } finally {
            setIsGenerating(false);
        }
    }, [prompt, negativePrompt, selectedDim, steps, cfgScale, isPublic, userId]);

    const adjustValue = (
        current: number,
        delta: number,
        min: number,
        max: number,
        setter: (v: number) => void
    ) => {
        const next = current + delta;
        if (next >= min && next <= max) setter(next);
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Generate</Text>
            </View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                {/* Prompt Input */}
                <View style={styles.section}>
                    <Text style={styles.sectionLabel}>Prompt</Text>
                    <TextInput
                        style={styles.promptInput}
                        placeholder="Describe the image you want to create..."
                        placeholderTextColor={colors.textMuted}
                        value={prompt}
                        onChangeText={setPrompt}
                        multiline
                        numberOfLines={4}
                        maxLength={3000}
                        textAlignVertical="top"
                    />
                    <Text style={styles.charCount}>{prompt.length}/3000</Text>
                </View>

                {/* Negative Prompt Toggle */}
                <Pressable
                    style={styles.negativeToggle}
                    onPress={() => setShowNegativePrompt(!showNegativePrompt)}
                >
                    <Ionicons
                        name={showNegativePrompt ? "chevron-up" : "chevron-down"}
                        size={18}
                        color={colors.textSecondary}
                    />
                    <Text style={styles.negativeToggleText}>Negative Prompt</Text>
                </Pressable>

                {showNegativePrompt && (
                    <View style={styles.section}>
                        <TextInput
                            style={styles.negativeInput}
                            placeholder="What to avoid in the image..."
                            placeholderTextColor={colors.textMuted}
                            value={negativePrompt}
                            onChangeText={setNegativePrompt}
                            maxLength={3000}
                        />
                    </View>
                )}

                {/* Dimension Picker */}
                <View style={styles.section}>
                    <Text style={styles.sectionLabel}>Aspect Ratio</Text>
                    <View style={styles.dimensionRow}>
                        {DIMENSIONS.map((dim, i) => (
                            <Pressable
                                key={dim.label}
                                style={[
                                    styles.dimensionChip,
                                    selectedDimIndex === i && styles.dimensionChipActive,
                                ]}
                                onPress={() => setSelectedDimIndex(i)}
                            >
                                <Text
                                    style={[
                                        styles.dimensionLabel,
                                        selectedDimIndex === i && styles.dimensionLabelActive,
                                    ]}
                                >
                                    {dim.label}
                                </Text>
                                <Text
                                    style={[
                                        styles.dimensionSize,
                                        selectedDimIndex === i && styles.dimensionSizeActive,
                                    ]}
                                >
                                    {dim.width}×{dim.height}
                                </Text>
                            </Pressable>
                        ))}
                    </View>
                </View>

                {/* Steps Control */}
                <View style={styles.section}>
                    <View style={styles.sliderHeader}>
                        <Text style={styles.sectionLabel}>Steps</Text>
                        <Text style={styles.sliderValue}>{steps}</Text>
                    </View>
                    <View style={styles.stepperRow}>
                        <Pressable
                            style={styles.stepperBtn}
                            onPress={() => adjustValue(steps, -5, STEPS_MIN, STEPS_MAX, setSteps)}
                        >
                            <Ionicons name="remove" size={20} color={colors.text} />
                        </Pressable>
                        <View style={styles.stepperTrack}>
                            <View
                                style={[
                                    styles.stepperFill,
                                    { width: `${((steps - STEPS_MIN) / (STEPS_MAX - STEPS_MIN)) * 100}%` },
                                ]}
                            />
                        </View>
                        <Pressable
                            style={styles.stepperBtn}
                            onPress={() => adjustValue(steps, 5, STEPS_MIN, STEPS_MAX, setSteps)}
                        >
                            <Ionicons name="add" size={20} color={colors.text} />
                        </Pressable>
                    </View>
                    <View style={styles.sliderLabels}>
                        <Text style={styles.sliderLabelText}>Faster</Text>
                        <Text style={styles.sliderLabelText}>Higher Quality</Text>
                    </View>
                </View>

                {/* Public Toggle */}
                <View style={[styles.section, styles.switchRow]}>
                    <View>
                        <Text style={styles.sectionLabel}>Public</Text>
                        <Text style={styles.sliderLabelText}>Allow others to see this image</Text>
                    </View>
                    <Switch
                        value={isPublic}
                        onValueChange={setIsPublic}
                        trackColor={{ false: colors.surface, true: colors.primary }}
                        thumbColor={colors.text}
                    />
                </View>

                {/* CFG Scale Control */}
                <View style={styles.section}>
                    <View style={styles.sliderHeader}>
                        <Text style={styles.sectionLabel}>CFG Scale</Text>
                        <Text style={styles.sliderValue}>{cfgScale}</Text>
                    </View>
                    <View style={styles.stepperRow}>
                        <Pressable
                            style={styles.stepperBtn}
                            onPress={() => adjustValue(cfgScale, -1, CFG_MIN, CFG_MAX, setCfgScale)}
                        >
                            <Ionicons name="remove" size={20} color={colors.text} />
                        </Pressable>
                        <View style={styles.stepperTrack}>
                            <View
                                style={[
                                    styles.stepperFill,
                                    { width: `${((cfgScale - CFG_MIN) / (CFG_MAX - CFG_MIN)) * 100}%` },
                                ]}
                            />
                        </View>
                        <Pressable
                            style={styles.stepperBtn}
                            onPress={() => adjustValue(cfgScale, 1, CFG_MIN, CFG_MAX, setCfgScale)}
                        >
                            <Ionicons name="add" size={20} color={colors.text} />
                        </Pressable>
                    </View>
                    <View style={styles.sliderLabels}>
                        <Text style={styles.sliderLabelText}>Creative</Text>
                        <Text style={styles.sliderLabelText}>Prompt Strict</Text>
                    </View>
                </View>

                {/* Generate Button */}
                <Pressable
                    onPress={handleGenerate}
                    disabled={isGenerating}
                    style={({ pressed }) => [
                        styles.generateBtn,
                        pressed && { opacity: 0.85 },
                        isGenerating && { opacity: 0.6 },
                    ]}
                >
                    <LinearGradient
                        colors={[colors.gradientStart, colors.gradientEnd]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.generateGradient}
                    >
                        {isGenerating ? (
                            <ActivityIndicator color={colors.text} size="small" />
                        ) : (
                            <Ionicons name="sparkles" size={22} color={colors.text} />
                        )}
                        <Text style={styles.generateText}>
                            {isGenerating ? "Generating..." : "Generate"}
                        </Text>
                    </LinearGradient>
                </Pressable>

                {/* Result Area */}
                {isGenerating && !generatedImageUrl && (
                    <View style={styles.resultPlaceholder}>
                        <ActivityIndicator size="large" color={colors.primary} />
                        <Text style={styles.resultPlaceholderText}>
                            Creating your image...
                        </Text>
                    </View>
                )}

                {generatedImageUrl && (
                    <View style={styles.resultContainer}>
                        <Text style={styles.sectionLabel}>Result</Text>
                        <View style={styles.imageWrapper}>
                            <Image
                                source={{ uri: generatedImageUrl }}
                                style={[
                                    styles.generatedImage,
                                    {
                                        aspectRatio: selectedDim.width / selectedDim.height,
                                    },
                                ]}
                                contentFit="contain"
                                transition={300}
                            />
                        </View>
                    </View>
                )}

                {/* Bottom spacer */}
                <View style={{ height: spacing.xxl }} />
            </ScrollView>
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
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: spacing.lg,
    },

    /* Sections */
    section: {
        marginBottom: spacing.lg,
    },
    sectionLabel: {
        fontSize: fontSize.sm,
        fontWeight: "600",
        color: colors.textSecondary,
        marginBottom: spacing.sm,
        textTransform: "uppercase",
        letterSpacing: 0.8,
    },

    /* Prompt */
    promptInput: {
        backgroundColor: colors.inputBackground,
        borderRadius: borderRadius.md,
        borderWidth: 1,
        borderColor: colors.border,
        color: colors.text,
        fontSize: fontSize.md,
        padding: spacing.md,
        minHeight: 120,
        lineHeight: 22,
    },
    charCount: {
        fontSize: fontSize.xs,
        color: colors.textMuted,
        textAlign: "right",
        marginTop: spacing.xs,
    },

    /* Negative Prompt */
    negativeToggle: {
        flexDirection: "row",
        alignItems: "center",
        gap: spacing.xs,
        marginBottom: spacing.md,
    },
    negativeToggleText: {
        fontSize: fontSize.sm,
        color: colors.textSecondary,
    },
    negativeInput: {
        backgroundColor: colors.inputBackground,
        borderRadius: borderRadius.md,
        borderWidth: 1,
        borderColor: colors.border,
        color: colors.text,
        fontSize: fontSize.md,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm + 2,
        height: 48,
    },

    /* Dimensions */
    dimensionRow: {
        flexDirection: "row",
        gap: spacing.sm,
    },
    dimensionChip: {
        flex: 1,
        alignItems: "center",
        paddingVertical: spacing.sm + 2,
        borderRadius: borderRadius.md,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.inputBackground,
    },
    dimensionChipActive: {
        borderColor: colors.primary,
        backgroundColor: colors.primary + "1A",
    },
    dimensionLabel: {
        fontSize: fontSize.sm,
        fontWeight: "700",
        color: colors.textMuted,
    },
    dimensionLabelActive: {
        color: colors.primaryLight,
    },
    dimensionSize: {
        fontSize: 9,
        color: colors.textMuted,
        marginTop: 2,
    },
    dimensionSizeActive: {
        color: colors.primaryLight,
    },

    /* Stepper controls */
    sliderHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    sliderValue: {
        fontSize: fontSize.md,
        fontWeight: "700",
        color: colors.primaryLight,
    },
    stepperRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: spacing.sm,
    },
    stepperBtn: {
        width: 40,
        height: 40,
        borderRadius: borderRadius.sm,
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        justifyContent: "center",
        alignItems: "center",
    },
    stepperTrack: {
        flex: 1,
        height: 6,
        borderRadius: 3,
        backgroundColor: colors.surface,
        overflow: "hidden",
    },
    stepperFill: {
        height: "100%",
        borderRadius: 3,
        backgroundColor: colors.primary,
    },
    sliderLabels: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: spacing.xs,
    },
    sliderLabelText: {
        fontSize: fontSize.xs,
        color: colors.textMuted,
    },
    switchRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    /* Generate Button */
    generateBtn: {
        borderRadius: borderRadius.lg,
        overflow: "hidden",
        marginBottom: spacing.lg,
    },
    generateGradient: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: spacing.sm,
        paddingVertical: spacing.md,
    },
    generateText: {
        fontSize: fontSize.lg,
        fontWeight: "700",
        color: colors.text,
    },

    /* Result */
    resultPlaceholder: {
        alignItems: "center",
        gap: spacing.md,
        paddingVertical: spacing.xxl,
    },
    resultPlaceholderText: {
        fontSize: fontSize.md,
        color: colors.textSecondary,
    },
    resultContainer: {
        marginBottom: spacing.lg,
    },
    imageWrapper: {
        borderRadius: borderRadius.lg,
        overflow: "hidden",
        borderWidth: 1,
        borderColor: colors.border,
    },
    generatedImage: {
        width: "100%",
        borderRadius: borderRadius.lg,
    },
});
