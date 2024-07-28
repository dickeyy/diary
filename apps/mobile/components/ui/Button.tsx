import { Text, TouchableOpacity } from "react-native";

interface ButtonProps {
    children: React.ReactNode;
    onPress: () => void;
}

export function Button({ onPress, children }: ButtonProps) {
    return (
        <TouchableOpacity
            onPress={onPress}
            // className="flex items-center justify-center rounded-full"
        >
            <Text className="font-bold text-white">fart town usa</Text>
        </TouchableOpacity>
    );
}
