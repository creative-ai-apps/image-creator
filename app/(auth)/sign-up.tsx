import { colors, borderRadius, fontSize, spacing } from "@/constants/theme";
import { useAuth } from "@/src/context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
    ActivityIndicator,
    Alert,
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

export default function SignUpScreen() {
    const router = useRouter();
    const { signUp } = useAuth();

    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSignUp = async () => {
        if (!fullName || !email || !password || !confirmPassword) {
            Alert.alert("Error", "Please fill in all fields.");
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert("Error", "Passwords do not match.");
            return;
        }

        if (password.length < 6) {
            Alert.alert("Error", "Password must be at least 6 characters.");
            return;
        }

        setLoading(true);
        const { error } = await signUp(email, password, fullName);
        setLoading(false);

        if (error) {
            Alert.alert("Sign Up Failed", error);
        } else {
            Alert.alert(
                "Account Created",
                "Please check your email to verify your account, then sign in.",
                [{ text: "OK", onPress: () => router.back() }]
            );
        }
    };

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
                        <Ionicons name="person-add" size={40} color={colors.primary} />
                        <Text style={styles.title}>Create Account</Text>
                        <Text style={styles.subtitle}>Start your creative journey</Text>
                    </View>

                    {/* Form */}
                    <View style={styles.form}>
                        <View style={styles.inputContainer}>
                            <Ionicons name="person-outline" size={20} color={colors.textMuted} style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Full Name"
                                placeholderTextColor={colors.textMuted}
                                autoCapitalize="words"
                                value={fullName}
                                onChangeText={setFullName}
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <Ionicons name="mail-outline" size={20} color={colors.textMuted} style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Email"
                                placeholderTextColor={colors.textMuted}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                value={email}
                                onChangeText={setEmail}
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <Ionicons name="lock-closed-outline" size={20} color={colors.textMuted} style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Password"
                                placeholderTextColor={colors.textMuted}
                                secureTextEntry
                                value={password}
                                onChangeText={setPassword}
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <Ionicons name="lock-closed-outline" size={20} color={colors.textMuted} style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Confirm Password"
                                placeholderTextColor={colors.textMuted}
                                secureTextEntry
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                            />
                        </View>

                        <Pressable
                            style={({ pressed }) => [
                                styles.buttonPrimary,
                                pressed && styles.buttonPressed,
                            ]}
                            onPress={handleSignUp}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color={colors.text} />
                            ) : (
                                <Text style={styles.buttonPrimaryText}>Sign Up</Text>
                            )}
                        </Pressable>
                    </View>

                    {/* Footer */}
                    <View style={styles.footer}>
                        <Text style={styles.footerText}>Already have an account?</Text>
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
    },
    form: {
        marginTop: spacing.xl,
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
