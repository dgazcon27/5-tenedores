import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Accounts from "../screen/Account/Accounts";
import Login from "../screen/Account/Login";
import Register from "../screen/Account/Register";

const Stack = createStackNavigator();

export default function AccountsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        component={Accounts}
        name="accounts"
        options={{ title: "Perfil" }}
      />
      <Stack.Screen
        component={Login}
        name="login"
        options={{ title: "Iniciar sesión" }}
      ></Stack.Screen>
      <Stack.Screen
        component={Register}
        name="register"
        options={{ title: "Crear mi cuenta" }}
      ></Stack.Screen>
    </Stack.Navigator>
  );
}
