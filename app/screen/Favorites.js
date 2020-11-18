import React, { useCallback, useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Button, Icon, Image } from "react-native-elements";
import { useFocusEffect } from "@react-navigation/native";

import { firebaseApp } from "../../utils/firebase";
import firebase from "firebase/app";
import "firebase/firestore";
import Toast from "react-native-easy-toast";
import Loading from "../components/Loading";

const db = firebase.firestore(firebaseApp);

export default function Favorites(props) {
  const { navigation } = props;
  const [restaurants, setRestaurants] = useState(null);
  const [isLogged, setIsLogged] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [reloadPage, setReloadPage] = useState(false);

  const toastRef = useRef();
  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      user ? setIsLogged(true) : setIsLogged(false);
    });
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (isLogged) {
        const idUser = firebase.auth().currentUser.uid;
        const listRestaurant = [];
        db.collection("favorites")
          .where("idUser", "==", idUser)
          .get()
          .then((response) => {
            response.forEach((doc) => {
              listRestaurant.push(doc.data().idRestaurant);
            });
            getDataRestaurant(listRestaurant).then((response) => {
              const restaurantData = [];
              response.forEach((doc) => {
                const data = doc.data();
                data.id = doc.id;
                restaurantData.push(data);
              });
              setRestaurants(restaurantData);
            });
          });
      }
      setReloadPage(false);
    }, [isLogged, reloadPage])
  );

  const getDataRestaurant = (listRestaurant) => {
    const promisesRestaurant = [];
    listRestaurant.forEach((restaurant) => {
      const result = db.collection("restaurant").doc(restaurant).get();
      promisesRestaurant.push(result);
    });
    return Promise.all(promisesRestaurant);
  };

  function NotFoundRestaurant() {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Icon type="material-community" name="alert-outline" size={50} />
        <Text style={styles.infoText}>No tienes restaurantes agregados</Text>
      </View>
    );
  }

  function NotLoggedUser() {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Icon type="material-community" name="alert-outline" size={50} />
        <Text style={styles.infoText}>
          Necesitas estar logeado para ver esta sección
        </Text>
        <Button
          title="Logearme"
          containerStyle={{ marginTop: 20, width: "80%" }}
          buttonStyle={{ backgroundColor: "#00a680" }}
          onPress={() => navigation.navigate("accounts", { screen: "login" })}
        />
      </View>
    );
  }

  function Restaurant(props) {
    const {
      restaurant,
      setIsVisible,
      toastRef,
      setReloadPage,
      navigation,
    } = props;
    const { name, images, id } = restaurant.item;

    const confirmRemove = () => {
      Alert.alert(
        "Eliminar Restaurant",
        "¿Deseas eliminar este restaurant de tus favoritos?",
        [
          {
            text: "Cancelar",
            style: "cancel",
          },
          {
            text: "Eliminar",
            onPress: removeFavorite,
          },
        ],
        { cancelable: false }
      );
    };

    const removeFavorite = () => {
      setIsVisible(true);
      db.collection("favorites")
        .where("idRestaurant", "==", id)
        .where("idUser", "==", firebase.auth().currentUser.uid)
        .get()
        .then((response) => {
          response.forEach((doc) => {
            const id = doc.id;
            db.collection("favorites")
              .doc(id)
              .delete()
              .then((response) => {
                setReloadPage(true);
                setIsVisible(false);
                toastRef.current.show("Restaurante eliminado", 1500);
              })
              .catch((er) => {
                setIsVisible(false);
                toastRef.current.show(
                  "Lo sentimos, ha ocurrido algo inesperado",
                  1500
                );
              });
          });
        });
    };

    return (
      <View style={styles.viewRestaurant}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("restaurant", {
              screen: "detail-restaurant",
              params: { id: id, name: name },
            })
          }
        >
          <Image
            resizeMode="cover"
            style={styles.image}
            PlaceholderContent={<ActivityIndicator color="#00a680" />}
            source={
              images[0]
                ? { uri: images[0] }
                : require("../../assets/img/no-image.png")
            }
          />
          <View style={styles.restaurantInfo}>
            <Text style={styles.restaurantName}>{name}</Text>
            <Icon
              name="heart"
              type="material-community"
              color="red"
              containerStyle={styles.favorites}
              onPress={confirmRemove}
              underlayColor="transparent"
            />
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  if (!isLogged) {
    return <NotLoggedUser navigation={navigation} />;
  }

  if (restaurants?.length === 0) {
    return <NotFoundRestaurant />;
  }

  return (
    <View style={styles.viewContainer}>
      {restaurants ? (
        <FlatList
          data={restaurants}
          renderItem={(restaurant) => (
            <Restaurant
              restaurant={restaurant}
              toastRef={toastRef}
              setIsVisible={setIsVisible}
              setReloadPage={setReloadPage}
              navigation={navigation}
            />
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      ) : (
        <View style={styles.loaderRestaurant}>
          <ActivityIndicator size="large" />
          <Text style={{ textAlign: "center", fontSize: 20 }}>
            Cargando Restaurantes
          </Text>
        </View>
      )}
      <Toast ref={toastRef} position="center" opacity={0.8} />
      <Loading text="Eliminando restaurant" isVisible={isVisible} />
    </View>
  );
}

const styles = StyleSheet.create({
  infoText: { fontSize: 20, fontWeight: "bold", textAlign: "center" },
  viewContainer: {
    flex: 1,
    backgroundColor: "#f2f2f2",
  },
  loaderRestaurant: {
    marginTop: 10,
    marginBottom: 10,
  },
  viewRestaurant: {
    margin: 10,
  },
  image: {
    width: "100%",
    height: 180,
  },
  restaurantInfo: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 10,
    paddingBottom: 10,
    marginTop: -30,
    backgroundColor: "#fff",
  },
  restaurantName: {
    fontWeight: "bold",
    fontSize: 30,
  },
  favorites: {
    marginTop: -35,
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 100,
  },
});
