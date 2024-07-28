// Need this file for now because i dont like the errors being thrown in the editor

import { styled } from "nativewind";
import {
    Button as B,
    Text as T,
    TextInput as TI,
    TouchableOpacity as TO,
    View as V
} from "react-native";

// just exports the styled base components
export const Text = styled(T);
export const View = styled(V);
export const TouchableOpacity = styled(TO);
export const Button = styled(B);
export const TextInput = styled(TI);
