import React from "react";
import { StatusBar } from "expo-status-bar";
import { MyStack } from "../routes";

export default function App() {
  return (
    <>
      <StatusBar style="light" />
      <MyStack />
    </>
  );
}
