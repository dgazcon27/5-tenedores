import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Favorites from "../screen/Favorites";

const Stack = createStackNavigator();

export default function FavoritesStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        component={Favorites}
        name="favorites"
        options={{ title: "Favoritos" }}
      />
    </Stack.Navigator>
  );
}
