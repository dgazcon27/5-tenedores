import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Restaurant from "../screen/Restaurant";

const Stack = createStackNavigator();

export default function RestaurantsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        component={Restaurant}
        name="restaurant"
        options={{ title: "Restaurante" }}
      />
    </Stack.Navigator>
  );
}
