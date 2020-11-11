import React, { useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import { Button, Input } from "react-native-elements";
import { isEmpty, map, size } from "lodash";
import { reauthentication } from "../../../utils/api";
import * as firebase from "firebase";

export default function ChangePasswordForm(props) {
  const { setIsVisible, toastRef } = props;

  const [showPass, setShowPass] = useState(true);
  const [showPassNew, setShowPassNew] = useState(true);
  const [showPassNewConfirm, setShowPassNewConfirm] = useState(true);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState(initialState());
  const [error, setError] = useState({});
  const [showForm, setShowForm] = useState(true);
  const onSubmit = () => {
    setError({});
    if (!form.password) setError({ password: "Este campo es obligatorio" });
    else if (size(form.password) < 6)
      setError({ password: "La contraseña debe tener mas de 5 caracteres" });
    else if (!form.passwordNew)
      setError({ passwordNew: "Este campo es obligatorio" });
    else if (size(form.passwordNew) < 6)
      setError({ passwordNew: "La contraseña debe tener mas de 5 caracteres" });
    else if (!form.passwordNew)
      setError({ passwordNew: "Este campo es obligatorio" });
    else if (!form.passwordCheck)
      setError({ passwordCheck: "Este campo es obligatorio" });
    else if (size(form.passwordCheck) < 6)
      setError({
        passwordCheck: "La contraseña debe tener mas de 5 caracteres",
      });
    else if (form.passwordNew !== form.passwordCheck) {
      setError({
        passwordNew: "Las contraseñas deben coincidir",
        passwordCheck: "Las contraseñas deben coincidir",
      });
    } else {
      setLoading(true);
      reauthentication(form.password)
        .then((response) => {
          setLoading(false);
          firebase
            .auth()
            .currentUser.updatePassword(form.passwordNew)
            .then((res) => {
              setLoading(false);
              setIsVisible(false);
              toastRef.current.show(
                "Contraseña actualizada correctamente",
                2000,
                () => {
                  toastRef.current.show(
                    "En breve se cerrará su sesión",
                    2000,
                    () => {
                      firebase.auth().signOut();
                    }
                  );
                }
              );
            })
            .catch((e) => {
              setLoading(false);
              setError({
                passwordNew: "Las contraseñas no se ha podido actualizar",
              });
            });
        })
        .catch((e) => {
          setLoading(false);
          setError({
            password: "Contraseña incorrecta",
          });
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
        placeholder="Contraseña actual"
        style={styles.input}
        password={true}
        secureTextEntry={showPass}
        errorMessage={error.password}
        rightIcon={{
          type: "material-community",
          name: showPass ? "eye-outline" : "eye-off-outline",
          color: "#c2c2c2",
          onPress: () => setShowPass(!showPass),
        }}
        onChange={(e) => onChange(e, "password")}
      />
      <Input
        placeholder="Contraseña nueva"
        style={styles.input}
        password={true}
        errorMessage={error.passwordNew}
        secureTextEntry={showPassNew}
        rightIcon={{
          type: "material-community",
          name: showPassNew ? "eye-outline" : "eye-off-outline",
          color: "#c2c2c2",
          onPress: () => setShowPassNew(!showPassNew),
        }}
        onChange={(e) => onChange(e, "passwordNew")}
      />
      <Input
        placeholder="Repetir contraseña"
        style={styles.input}
        errorMessage={error.passwordCheck}
        password={true}
        secureTextEntry={showPassNewConfirm}
        rightIcon={{
          type: "material-community",
          name: showPassNewConfirm ? "eye-outline" : "eye-off-outline",
          color: "#c2c2c2",
          onPress: () => setShowPassNewConfirm(!showPassNewConfirm),
        }}
        onChange={(e) => onChange(e, "passwordCheck")}
      />
      <Button
        title="Cambiar contraseña"
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
    password: "",
    passwordNew: "",
    passwordCheck: "",
  };
}

function validateFillForm(form) {
  let check = Object.entries(form).map((item, key) => {
    if (isEmpty(item[1])) return { [item[0]]: "Este campo es requerido" };
    return {};
  });

  console.log(check);
}

const styles = StyleSheet.create({
  viewContainer: {
    alignItems: "center",
    paddingTop: 10,
    paddingBottom: 10,
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
