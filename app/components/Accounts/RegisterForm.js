import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Input, Icon, Button } from "react-native-elements";
import { size, isEmpty } from "lodash";
import * as firebase from "firebase";
import { useNavigation } from "@react-navigation/native";

import { validateEmail } from "../../../utils/validations";
import Loading from "../Loading";

export default function RegisterForm(props) {
  const { toastRef } = props;

  const [showPass, setShowPass] = useState(false);
  const [checkPass, setCheckPass] = useState(false);
  const [form, setForm] = useState(defaultValues());
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();

  const onSubmit = () => {
    if (
      isEmpty(form.email) ||
      isEmpty(form.password) ||
      isEmpty(form.checkPass)
    ) {
      toastRef.current.show("Todos los campos son obligatorios");
    } else if (!validateEmail(form.email)) {
      toastRef.current.show("El email es invalido");
    } else if (form.password !== form.checkPass) {
      toastRef.current.show("Las contraseñas deben coincidir");
    } else if (size(form.password) < 6) {
      toastRef.current.show("Las contraseña deben tener al menos 6 caracteres");
    } else {
      setLoading(true);
      firebase
        .auth()
        .createUserWithEmailAndPassword(form.email, form.password)
        .then((response) => {
          setLoading(false);
          navigation.navigate("accounts");
        })
        .catch((er) => {
          setLoading(false);
          toastRef.current.show("El email ya ha sido registrado");
        });
    }
  };

  const onChange = (e, type) => {
    let value = e.nativeEvent.text;
    setForm({ ...form, [type]: value });
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
      <Input
        onChange={(e) => onChange(e, "checkPass")}
        placeholder="Repetir contraseña"
        containerStyle={styles.inputForm}
        password={true}
        secureTextEntry={checkPass ? false : true}
        rightIcon={
          <Icon
            type="material-community"
            name={checkPass ? "eye-off-outline" : "eye-outline"}
            iconStyle={styles.iconRight}
            onPress={() => setCheckPass(!checkPass)}
          />
        }
      />
      <Button
        title="Unirse"
        containerStyle={styles.btnContainer}
        buttonStyle={styles.btn}
        onPress={onSubmit}
      />
      <Loading isVisible={loading} text="Creando cuenta" />
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
    width: "90%",
    marginTop: 20,
  },
  btn: {
    backgroundColor: "#00a680",
  },
  iconRight: {
    color: "#c1c1c1",
  },
});

function defaultValues() {
  return {
    email: "",
    password: "",
    checkPass: "",
  };
}
