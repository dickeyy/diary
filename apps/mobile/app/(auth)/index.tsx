import { Text, TouchableOpacity, View } from "@/components/Styled";
import { useNavigation } from "expo-router";

export default function AuthScreen() {
    const navigation = useNavigation();
    return (
        <View className="flex h-screen items-center justify-center bg-background px-4">
            <View className="flex w-full flex-1 flex-col items-center justify-center">
                <View className="mb-8 rounded-[99px] border-[1px] border-dashed border-green-500 bg-green-500/20 px-4 py-1">
                    <Text className="text-xs text-green-500">Beta</Text>
                </View>
                <View className="flex flex-row items-end justify-center">
                    <Text className="font-serif text-5xl font-bold text-white">Diary</Text>
                    <Text className="font-serif-bold-italic text-2xl font-bold text-white/20">
                        .kyle.so
                    </Text>
                </View>
                <Text className="mt-4 text-center text-sm text-white/60">
                    A private place to keep track of your thoughts.
                </Text>
            </View>
            <View className="mb-32 flex w-full flex-col items-center justify-center gap-4">
                <TouchableOpacity
                    className="w-full rounded-md bg-[#fff] px-4 py-2"
                    onPress={() => {
                        navigation.navigate("sign-up");
                    }}
                >
                    <Text className="text-center text-lg text-black">Get Started</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    className="w-full rounded-md border-[1px] border-white/10 px-4 py-2"
                    onPress={() => {
                        navigation.navigate("sign-in");
                    }}
                >
                    <Text className="text-center text-lg text-white">Sign in</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
