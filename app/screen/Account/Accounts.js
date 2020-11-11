import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import * as firebase from "firebase";
import UserGuests from "./UserGuests";
import UserLogged from "./UserLogged";
import Loading from "../../components/Loading";

export default function Accounts() {
  const [login, setLogin] = useState(null);

  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      !user ? setLogin(false) : setLogin(true);
    });
  }, []);

  if (login === null) return <Loading isVisible={true} text="Cargando" />;

  return login ? <UserLogged /> : <UserGuests />;
}
