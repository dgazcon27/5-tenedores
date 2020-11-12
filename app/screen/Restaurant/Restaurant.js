import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text } from "react-native";
import { Icon } from "react-native-elements";
import { firebaseApp } from "../../../utils/firebase";
import firebase from "firebase/app";

export default function Restaurant(props) {
  const { navigation } = props;
  const [user, setUser] = useState({});
  useEffect(() => {
    firebase.auth().onAuthStateChanged((userInfo) => {
      setUser(userInfo);
    });
  }, []);

  return (
    <View style={styles.viewContainer}>
      <Text>Restaurant</Text>
      {user && (
        <Icon
          type="material-community"
          name="plus"
          color="#00a680"
          reverse={true}
          containerStyle={styles.btnContainer}
          onPress={() => navigation.navigate("add-restaurant")}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  viewContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  btnContainer: {
    position: "absolute",
    bottom: 15,
    right: 10,
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.5,
  },
});
