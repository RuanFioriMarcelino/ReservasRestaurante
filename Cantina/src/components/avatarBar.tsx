import { View, Text, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { colors } from "../styles/colors";

export default function AvatarBar(){
    return (
        <View className="w-full bg-laranja-100 h-32 rounded-b-3xl p-6 pt-12 justify-center">
            <View className="flex-row items-center gap-4">
                <View className="w-16 h-16 rounded-full bg-white "/>
                <Text className="text-white font-bold text-lg">Olá Ruan</Text>
                <View className="w-full flex-1 items-end" >
                    <TouchableOpacity activeOpacity={0.5}>
                    <MaterialIcons name="notifications-none" size={30} color={colors.white}/>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}