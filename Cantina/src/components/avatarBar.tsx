import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { colors } from "../styles/colors";
import { FlatList } from "react-native-gesture-handler";

import { useGetUser } from "../components/getUser";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Loading } from "./loading";

export default function AvatarBar() {
  const user = useGetUser();
  const navigation = useNavigation(); // Use the hook here
  const route = useRoute();
  const imgUrl = user.map((item) => item.image).toString();

  return (
    <View className="w-full bg-laranja-100 h-24 rounded-b-3xl p-6 justify-center">
      <View className="flex-row items-center gap-4">
        <View className="items-center">
          {imgUrl ? (
            <Image
              source={{ uri: imgUrl }}
              className="w-[65px] h-[65px] rounded-full border-white border"
            />
          ) : (
            <View className="w-[65px] h-[65px] bg-gray-400 rounded-full justify-center  border-white border">
              <Loading />
            </View>
          )}
        </View>
        <FlatList
          data={user}
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
