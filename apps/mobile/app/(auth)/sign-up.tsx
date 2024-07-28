import { Button, Text, TextInput, View } from "@/components/Styled";
import { useSignUp } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import * as React from "react";

export default function SignUpScreen() {
    const { isLoaded, signUp, setActive } = useSignUp();
    const router = useRouter();

    const [emailAddress, setEmailAddress] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [pendingVerification, setPendingVerification] = React.useState(false);
    const [code, setCode] = React.useState("");

    const onSignUpPress = async () => {
        if (!isLoaded) {
            return;
        }

        try {
            await signUp.create({
                emailAddress,
                password
            });

            await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

            setPendingVerification(true);
        } catch (err: any) {
            // See https://clerk.com/docs/custom-flows/error-handling
            // for more info on error handling
            console.error(JSON.stringify(err, null, 2));
        }
    };

    const onPressVerify = async () => {
        if (!isLoaded) {
            return;
        }

        try {
            const completeSignUp = await signUp.attemptEmailAddressVerification({
                code
            });

            if (completeSignUp.status === "complete") {
                await setActive({ session: completeSignUp.createdSessionId });
                router.replace("/");
            } else {
                console.error(JSON.stringify(completeSignUp, null, 2));
            }
        } catch (err: any) {
            // See https://clerk.com/docs/custom-flows/error-handling
            // for more info on error handling
            console.error(JSON.stringify(err, null, 2));
        }
    };

    return (
        <View className="flex h-screen items-center justify-center bg-background px-4">
            <View className="absolute top-24 flex w-full">
                <Text className="font-serif-bold text-2xl text-white">Sign Up</Text>
            </View>
            {!pendingVerification && (
                <>
                    <TextInput
                        autoCapitalize="none"
                        value={emailAddress}
                        placeholder="Email..."
                        onChangeText={(email) => setEmailAddress(email)}
                    />
                    <TextInput
                        value={password}
                        placeholder="Password..."
                        secureTextEntry={true}
                        onChangeText={(password) => setPassword(password)}
                    />
                    <Button title="Sign Up" onPress={onSignUpPress} />
                </>
            )}
            {pendingVerification && (
                <>
                    <TextInput
                        value={code}
                        placeholder="Code..."
                        onChangeText={(code) => setCode(code)}
                    />
                    <Button title="Verify Email" onPress={onPressVerify} />
                </>
            )}
        </View>
    );
}
