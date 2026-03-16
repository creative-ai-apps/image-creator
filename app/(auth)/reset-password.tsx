import { colors, borderRadius, fontSize, spacing } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ResetPasswordScreen() {
    const router = useRouter();

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.flex}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Back Button */}
                    <Pressable
                        style={styles.backButton}
                        onPress={() => router.back()}
                    >
                        <Ionicons name="arrow-back" size={24} color={colors.text} />
                    </Pressable>

                    {/* Header */}
                    <View style={styles.headerSection}>
                        <Ionicons name="key-outline" size={40} color={colors.primary} />
                        <Text style={styles.title}>Reset Password</Text>
                        <Text style={styles.subtitle}>
                            Enter your email and we'll send you a link to reset your password
                        </Text>
                    </View>

                    {/* Form */}
                    <View style={styles.form}>
                        <View style={styles.inputContainer}>
                            <Ionicons name="mail-outline" size={20} color={colors.textMuted} style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Email"
                                placeholderTextColor={colors.textMuted}
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                        </View>

                        <Pressable
                            style={({ pressed }) => [
                                styles.buttonPrimary,
                                pressed && styles.buttonPressed,
                            ]}
                        >
                            <Text style={styles.buttonPrimaryText}>Send Reset Link</Text>
                        </Pressable>
                    </View>

                    {/* Footer */}
                    <View style={styles.footer}>
                        <Text style={styles.footerText}>Remember your password?</Text>
                        <Pressable onPress={() => router.back()}>
                            <Text style={styles.footerLink}> Sign In</Text>
                        </Pressable>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    flex: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: spacing.lg,
    },
    backButton: {
        width: 44,
        height: 44,
        borderRadius: borderRadius.full,
        backgroundColor: colors.surface,
        alignItems: "center",
        justifyContent: "center",
        marginTop: spacing.sm,
    },
    headerSection: {
        alignItems: "center",
        marginTop: spacing.xxl,
        gap: spacing.sm,
    },
    title: {
        fontSize: fontSize.xxl,
        fontWeight: "800",
        color: colors.text,
        marginTop: spacing.md,
    },
    subtitle: {
        fontSize: fontSize.md,
        color: colors.textSecondary,
        textAlign: "center",
        lineHeight: 22,
        paddingHorizontal: spacing.md,
    },
    form: {
        marginTop: spacing.xxl,
        gap: spacing.md,
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: colors.inputBackground,
        borderRadius: borderRadius.md,
        borderWidth: 1,
        borderColor: colors.border,
        paddingHorizontal: spacing.md,
    },
    inputIcon: {
        marginRight: spacing.sm,
    },
    input: {
        flex: 1,
        paddingVertical: spacing.md,
        fontSize: fontSize.md,
        color: colors.text,
    },
    buttonPrimary: {
        backgroundColor: colors.primary,
        paddingVertical: spacing.md + 2,
        borderRadius: borderRadius.md,
        alignItems: "center",
        justifyContent: "center",
        marginTop: spacing.sm,
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
    buttonPressed: {
        opacity: 0.8,
        transform: [{ scale: 0.98 }],
    },
    footer: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: "auto",
        paddingBottom: spacing.xl,
        paddingTop: spacing.xl,
    },
    footerText: {
        fontSize: fontSize.md,
        color: colors.textSecondary,
    },
    footerLink: {
        fontSize: fontSize.md,
        color: colors.primary,
        fontWeight: "700",
    },
});
