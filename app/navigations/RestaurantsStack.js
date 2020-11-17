import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Restaurant from "../screen/Restaurant/Restaurant";
import AddRestaurant from "../screen/Restaurant/AddRestaurant";
import RestaurantDetail from "../screen/Restaurant/RestaurantDetail";

const Stack = createStackNavigator();

export default function RestaurantsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        component={Restaurant}
        name="restaurant"
        options={{ title: "Restaurante" }}
      />
      <Stack.Screen
        component={AddRestaurant}
        name="add-restaurant"
        options={{ title: "Agregar Restaurante" }}
      />
      <Stack.Screen component={RestaurantDetail} name="detail-restaurant" />
    </Stack.Navigator>
  );
}
