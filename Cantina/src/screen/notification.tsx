import { Text, View } from "react-native";
import AvatarBar from "../components/avatarBar";
import * as React from "react";

export default function Notification() {
  return (
    <View className="bg-laranja-100 flex-1">
      <View className="bg-laranja-100">
        <AvatarBar />
      </View>
      <Text className="bg-white mt-4 h-9 text-center align-middle text-laranja-100 font-bold text-xl">
        AVISOS
      </Text>
    </View>
  );
}
