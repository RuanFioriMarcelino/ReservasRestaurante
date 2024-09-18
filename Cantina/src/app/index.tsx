import React from "react";
import { StatusBar } from "expo-status-bar";
import { MyStack } from "../routes";
import { SafeAreaView } from "react-native";

export default function App() {
  return (
    <>
      <StatusBar style="light" />
      <SafeAreaView className="flex-1 bg-laranja-100 pt-8">
        <MyStack />
      </SafeAreaView>
    </>
  );
}
