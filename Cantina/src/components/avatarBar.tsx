import { View, Text, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { colors } from "../styles/colors";
import { FlatList } from "react-native-gesture-handler";

import { useGetUser } from "../components/getUser";
import { useNavigation, useRoute } from "@react-navigation/native";

export default function AvatarBar() {
  const usuario = useGetUser();
  const navigation = useNavigation();
  const route = useRoute();

  return (
    <View className="w-full bg-laranja-100 h-24 rounded-b-3xl p-6 justify-center">
      <View className="flex-row items-center gap-4">
        <View className="w-16 h-16 rounded-full bg-white" />
        <FlatList
          data={usuario}
          keyExtractor={(item) => item.toString()}
          renderItem={({ item }) => (
            <View>
              <Text className="font-regular text-xl text-white">
                Olá, {item.name}
              </Text>
            </View>
          )}
        />
        {route.name != "Notification" ? (
          <View className="w-full flex-1 items-end">
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={() => navigation.navigate("Notification")}
            >
              <MaterialIcons
                name="notifications-none"
                size={30}
                color={colors.white}
              />
            </TouchableOpacity>
          </View>
        ) : null}
      </View>
    </View>
  );
}
