import { StatusBar } from "expo-status-bar";
import React from "react";
import { LogBox } from "react-native";
import { firebaseApp } from "./utils/firebase";
import Navigations from "./app/navigations/Navigations";

LogBox.ignoreLogs(["Setting a timer", "Animated: `useNativeDriver`"]);

export default function App() {
  return <Navigations></Navigations>;
}
