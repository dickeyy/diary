import { Redirect, Stack } from "expo-router";
import React from "react";

import { useColorScheme } from "@/hooks/useColorScheme";
import { useAuth } from "@clerk/clerk-expo";

export default function TabLayout() {
    const colorScheme = useColorScheme();
    const { isSignedIn } = useAuth();

    if (isSignedIn) {
        return <Redirect href={"/"} />;
    }

    return (
        <Stack
            screenOptions={{
                headerShown: false
            }}
        >
            <Stack.Screen name="index" options={{ title: "Home" }} />
        </Stack>
    );
}
