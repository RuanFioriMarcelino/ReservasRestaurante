import { View, Text, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { colors } from "../styles/colors";
import { FlatList } from "react-native-gesture-handler";

import { useGetUser } from "../components/getUser";

export default function AvatarBar({navigation}:any){
    const usuario = useGetUser();
    return (
        <View className="w-full bg-laranja-100 h-24 rounded-b-3xl p-6  justify-center">
            <View className="flex-row items-center gap-4">
                <View className="w-16 h-16 rounded-full bg-white "/>
                <Text className="text-white font-bold text-lg">
                    <FlatList
                        data={usuario}
                        renderItem={({ item }) => {
                            return (
                                <View>
                                    <Text className="font-regular text-xl text-white">Olá, {item.name}</Text>
                                </View>
              );
            }}
          /></Text>
                <View className="w-full flex-1 items-end" >
                    <TouchableOpacity activeOpacity={0.5} onPress={()=> navigation.navigate("Notification")}>
                    <MaterialIcons name="notifications-none" size={30} color={colors.white}/>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}