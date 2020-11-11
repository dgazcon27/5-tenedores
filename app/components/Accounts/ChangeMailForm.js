import { initial } from "lodash";
import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Input, Button } from "react-native-elements";
import * as firebase from "firebase";

import { validateEmail } from "../../../utils/validations";
import { reauthentication } from "../../../utils/api";

export default function ChangeMailForm(props) {
  const { email, setIsVisible, toastRef, setReloadUserInfo } = props;
  const [form, setForm] = useState(initialState());
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState({});

  const onSubmit = (params) => {
    setError({});

    if (!form.emailNew || form.emailNew === email)
      setError({ emailNew: "El correo debe ser diferente del actual" });
    else if (!validateEmail(form.emailNew))
      setError({ emailNew: "El correo es invalido" });
    else if (!form.password)
      setError({ password: "La contraseña es requerido" });
    else {
      setLoading(true);
      reauthentication(form.password)
        .then((response) => {
          firebase
            .auth()
            .currentUser.updateEmail(form.emailNew)
            .then(() => {
              setLoading(false);
              setReloadUserInfo(true);
              toastRef.current.show("Email actualizado correctamente");
              setIsVisible(false);
            })
            .catch((e) => {
              setLoading(false);
              setError("Error al actualizar el correo");
            });
        })
        .catch((error) => {
          setLoading(false);
          setError({ password: "La contraseña es incorrecta" });
        });
    }
  };

  const onChange = (e, type) => {
    let value = e.nativeEvent.text;
    setForm({ ...form, [type]: value });
  };

  return (
    <View style={styles.viewContainer}>
      <Input
        placeholder="Correo electrónico actual"
        defaultValue={email}
        style={styles.input}
        rightIcon={{
          type: "material-community",
          name: "at",
          color: "#c2c2c2",
        }}
        onChange={(e) => onChange(e, "email")}
        errorMessage={error.email}
        disabled={true}
      />
      <Input
        placeholder="Correo electrónico nuevo"
        style={styles.input}
        rightIcon={{
          type: "material-community",
          name: "at",
          color: "#c2c2c2",
        }}
        onChange={(e) => onChange(e, "emailNew")}
        errorMessage={error.emailNew}
      />
      <Input
        placeholder="Contraseña"
        style={styles.input}
        password={true}
        secureTextEntry={true}
        secureTextEntry={showPass ? false : true}
        rightIcon={{
          type: "material-community",
          name: showPass ? "eye-off-outline" : "eye-outline",
          color: "#c2c2c2",
          onPress: () => setShowPass(!showPass),
        }}
        onChange={(e) => onChange(e, "password")}
        errorMessage={error.password}
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
function initialState() {
  return {
    email: "",
    emailNew: "",
    password: "",
  };
}

const styles = StyleSheet.create({
  viewContainer: {
    alignItems: "center",
    paddingBottom: 10,
    paddingTop: 10,
  },
  input: {
    marginBottom: 10,
  },
  btnContainer: {
    marginTop: 20,
    width: "95%",
  },
  btn: {
    backgroundColor: "#00a680",
  },
});
