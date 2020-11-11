import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Search from "../screen/Search";

const Stack = createStackNavigator();

export default function SearchStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        component={Search}
        name="search"
        options={{ title: "Buscar" }}
      />
    </Stack.Navigator>
  );
}
