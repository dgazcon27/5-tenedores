import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Input, Icon, Button } from "react-native-elements";
import { isEmpty, size } from "lodash";
import * as firebase from "firebase";
import { useNavigation } from "@react-navigation/native";
import Loading from "../Loading";
import { validateEmail } from "../../../utils/validations";

export default function LoginForm(props) {
  const { toastRef } = props;

  const [showPass, setShowPass] = useState(false);
  const [form, setForm] = useState(initializeData());
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const onChange = (e, type) => {
    let value = e.nativeEvent.text;
    setForm({ ...form, [type]: value });
  };

  const onSubmit = () => {
    if (isEmpty(form.email) || isEmpty(form.password)) {
      toastRef.current.show("Todos los campos son obligatorios");
    } else if (!validateEmail(form.email)) {
      toastRef.current.show("El email es invalido");
    } else {
      setLoading(true);
      firebase
        .auth()
        .signInWithEmailAndPassword(form.email, form.password)
        .then((response) => {
          setLoading(false);
          navigation.navigate("accounts");
        })
        .catch((e) => {
          setLoading(false);
          toastRef.current.show("Email o contraseña incorrecta");
        });
    }
  };

  return (
    <View style={styles.formContainer}>
      <Input
        onChange={(e) => onChange(e, "email")}
        placeholder="Correo electrónico"
        containerStyle={styles.inputForm}
        rightIcon={
          <Icon
            type="material-community"
            name="at"
            iconStyle={styles.iconRight}
          />
        }
      />
      <Input
        onChange={(e) => onChange(e, "password")}
        placeholder="Contraseña"
        containerStyle={styles.inputForm}
        password={true}
        secureTextEntry={showPass ? false : true}
        rightIcon={
          <Icon
            type="material-community"
            name={showPass ? "eye-off-outline" : "eye-outline"}
            iconStyle={styles.iconRight}
            onPress={() => setShowPass(!showPass)}
          />
        }
      />
      <Button
        title="Iniciar sesión"
        containerStyle={styles.btnContainer}
        buttonStyle={styles.btn}
        onPress={onSubmit}
      />
      <Loading isVisible={loading} text="Iniciando sesión" />
    </View>
  );
}

const styles = StyleSheet.create({
  formContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
  },
  inputForm: {
    width: "100%",
    marginTop: 20,
  },
  btnContainer: {
    marginTop: 20,
    width: "95%",
  },
  btn: {
    backgroundColor: "#00a680",
  },
  iconRight: {
    color: "#c1c1c1",
  },
});

function initializeData() {
  return {
    email: "",
    password: "",
  };
}
