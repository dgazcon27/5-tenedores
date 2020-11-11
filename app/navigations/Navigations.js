import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { Icon } from "react-native-elements";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import RestaurantsStack from "./RestaurantsStack";
import FavoritesStack from "./FavoritesStack";
import SearchStack from "./SearchStack";
import TopRestaurantsStack from "./TopRestaurantsStack";
import AccountsStack from "./AccountsStack";

const Tab = createBottomTabNavigator();

export default function Navigation() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="accounts"
        tabBarOptions={{
          inactiveTintColor: "#646464",
          activeTintColor: "#00a680",
        }}
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color }) => screenOptions(route, color),
        })}
      >
        <Tab.Screen
          name="restaurant"
          component={RestaurantsStack}
          options={{ title: "Restaurante" }}
        ></Tab.Screen>
        <Tab.Screen
          name="favorites"
          component={FavoritesStack}
          options={{ title: "Favoritos" }}
        ></Tab.Screen>
        <Tab.Screen
          name="top-restaurant"
          component={TopRestaurantsStack}
          options={{ title: "Top 5" }}
        ></Tab.Screen>
        <Tab.Screen
          name="search"
          component={SearchStack}
          options={{ title: "Buscar" }}
        ></Tab.Screen>
        <Tab.Screen
          name="accounts"
          component={AccountsStack}
          options={{ title: "Perfil" }}
        ></Tab.Screen>
      </Tab.Navigator>
    </NavigationContainer>
  );
}

function screenOptions(route, color) {
  let iconName;
  switch (route.name) {
    case "restaurant":
      iconName = "compass-outline";
      break;
    case "favorites":
      iconName = "heart-outline";
      break;
    case "top-restaurant":
      iconName = "star-outline";
      break;
    case "search":
      iconName = "magnify";
      break;
    case "accounts":
      iconName = "home-outline";
      break;

    default:
      break;
  }

  return (
    <Icon type="material-community" name={iconName} color={color} size={22} />
  );
}
