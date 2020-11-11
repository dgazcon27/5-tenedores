import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Button, Input } from "react-native-elements";
import * as firebase from "firebase";

export default function ChangeNameForm(props) {
  const { name, setIsVisible, toastRef, setReloadUserInfo } = props;
  const [newName, setNewName] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = () => {
    setError(null);
    if (!newName) {
      setError("El nombre no puede estar vacio");
    } else if (newName === name) {
      setError("El nombre no puede ser igual al actual");
    } else {
      setLoading(true);
      firebase
        .auth()
        .currentUser.updateProfile({
          displayName: newName,
        })
        .then((r) => {
          setLoading(false);
          setReloadUserInfo(true);
          setIsVisible(false);
        })
        .catch((e) => {
          setLoading(false);
          setIsVisible(false);
        });
    }
  };

  return (
    <View style={styles.viewContainer}>
      <Input
        placeholder="Nombre y Apellido"
        containerStyle={styles.input}
        rightIcon={{
          type: "material-community",
          name: "account-circle-outline",
          color: "#c2c2c2",
        }}
        onChange={(e) => setNewName(e.nativeEvent.text)}
        defaultValue={name || ""}
        errorMessage={error}
      />
      <Button
        title="Cambiar nombre"
        containerStyle={styles.btnContainer}
        buttonStyle={styles.btn}
        onPress={onSubmit}
        loading={loading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  viewContainer: {
    alignItems: "center",
    paddingTop: 10,
    paddingBottom: 10,
  },
  btnContainer: {
    marginTop: 20,
    width: "95%",
  },
  btn: {
    backgroundColor: "#00a680",
  },
});
