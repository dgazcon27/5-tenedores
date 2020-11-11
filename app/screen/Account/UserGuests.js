import React from "react";
import { StyleSheet, View, ScrollView, Text, Image } from "react-native";
import { Button } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";

export default function UserGuests() {
  const navigation = useNavigation();

  return (
    <ScrollView centerContent={true} style={styles.viewBody}>
      <Image
        source={require("../../../assets/img/user-guest.jpg")}
        resizeMode="contain"
        style={styles.image}
      />
      <Text style={styles.title}>Consulta tu perfil</Text>
      <Text style={styles.description}>
        ¿Como describirías tu mejor tienda? Busca las mejores tiendas de una
        forma sencilla, vota cual te ha gustado más y comenta como ha sido tu
        experiencia.
      </Text>
      <View style={styles.viewButton}>
        <Button
          title="Ver tu perfil"
          buttonStyle={styles.button}
          containerStyle={styles.containerButton}
          onPress={() => navigation.navigate("login")}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  viewBody: {
    marginLeft: 30,
    marginRight: 30,
    marginBottom: 40,
  },
  image: {
    height: 300,
    width: "100%",
    marginBottom: 40,
  },
  title: {
    fontWeight: "bold",
    fontSize: 19,
    marginBottom: 10,
    textAlign: "center",
  },
  description: {
    textAlign: "center",
    marginBottom: 20,
  },
  viewButton: {
    flex: 1,
    alignItems: "center",
  },
  button: {
    backgroundColor: "#00a680",
  },
  containerButton: {
    width: "70%",
  },
});
