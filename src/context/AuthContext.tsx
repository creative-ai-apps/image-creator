import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/src/utils/supabase";

interface AuthContextType {
    session: Session | null;
    isLoggedIn: boolean;
    isLoading: boolean;
    signIn: (email: string, password: string) => Promise<{ error: string | null }>;
    signUp: (email: string, password: string, fullName: string) => Promise<{ error: string | null }>;
    signOut: () => Promise<{ error: string | null }>;
    resetPassword: (email: string) => Promise<{ error: string | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [session, setSession] = useState<Session | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Get the initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setIsLoading(false);
        });

        // Listen for auth state changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                setSession(session);
            }
        );

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const signIn = async (email: string, password: string): Promise<{ error: string | null }> => {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) return { error: error.message };
        return { error: null };
    };

    const signUp = async (email: string, password: string, fullName: string): Promise<{ error: string | null }> => {
        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { full_name: fullName },
            },
        });
        if (error) return { error: error.message };
        return { error: null };
    };

    const signOut = async (): Promise<{ error: string | null }> => {
        const { error } = await supabase.auth.signOut();
        if (error) return { error: error.message };
        return { error: null };
    };

    const resetPassword = async (email: string): Promise<{ error: string | null }> => {
        const { error } = await supabase.auth.resetPasswordForEmail(email);
        if (error) return { error: error.message };
        return { error: null };
    };

    return (
        <AuthContext.Provider
            value={{
                session,
                isLoggedIn: !!session?.user,
                isLoading,
                signIn,
                signUp,
                signOut,
                resetPassword,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth(): AuthContextType {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
