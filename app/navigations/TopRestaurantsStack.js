import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import TopRestaurant from "../screen/TopRestaurant";

const Stack = createStackNavigator();

export default function TopRestaurantsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        component={TopRestaurant}
        name="top-restaurant"
        options={{ title: "Top 5 Restaurantes" }}
      />
    </Stack.Navigator>
  );
}
