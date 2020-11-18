import React, { useEffect, useState, useCallback, useRef } from "react";
import { StyleSheet, Text, View, ScrollView, Dimensions } from "react-native";
import { Rating, ListItem, Icon } from "react-native-elements";

import { firebaseApp } from "../../../utils/firebase";
import firebase from "firebase/app";
import "firebase/storage";
import "firebase/firestore";
import { map } from "lodash";
import { useFocusEffect } from "@react-navigation/native";
import Toast from "react-native-easy-toast";

import Loading from "../../components/Loading";
import CarouselImage from "../../components/Carousel";
import Map from "../../components/Map";
import ListReviews from "../../components/Restaurant/ListReviews";

const db = firebase.firestore(firebaseApp);
const widthScreen = Dimensions.get("window").width;

export default function RestaurantDetail(props) {
  const { navigation, route } = props;
  const { id, name } = route.params;
  const toastRef = useRef();

  const [restaurant, setRestaurant] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLogged, setIsLogged] = useState(false);

  useEffect(() => {
    navigation.setOptions({ title: name });
    firebase.auth().onAuthStateChanged((user) => {
      user ? setIsLogged(true) : setIsLogged(false);
    });
  }, []);

  useFocusEffect(
    useCallback(() => {
      db.collection("restaurant")
        .doc(id)
        .get()
        .then((response) => {
          const data = response.data();
          data.id = response.id;
          setRestaurant(data);
        })
        .catch((er) => {
          console.log(er);
        });
    }, [])
  );

  useEffect(() => {
    if (isLogged && restaurant) {
      db.collection("favorites")
        .where("idRestaurant", "==", restaurant.id)
        .where("idUser", "==", firebase.auth().currentUser.uid)
        .get()
        .then((response) => {
          if (response.docs.length === 1) {
            setIsFavorite(true);
          }
        })
        .catch((er) => {
          toastRef.current.show("ha ocurrido un error inesperado");
        });
    }
  }, [isLogged, restaurant]);

  function TitleRestaurant({ name, description, rating }) {
    return (
      <View style={styles.viewTitle}>
        <View style={{ flexDirection: "row" }}>
          <Text style={styles.nameRestaurant}>{name}</Text>
        </View>
        <Text style={styles.descriptionRestaurant}>{description}</Text>
        <Rating
          style={styles.rating}
          imageSize={17}
          readonly
          startingValue={rating}
        />
      </View>
    );
  }

  function RestaurantInfo({ location, name, address }) {
    const listInfo = [
      {
        text: address,
        iconName: "map-marker",
        iconType: "material-community",
        action: null,
      },
    ];

    return (
      <View style={styles.viewRestaurantInfo}>
        <Text style={styles.infoTitle}>Informacion sobre el restaurant</Text>
        <Map location={location} name={name} height={100} />
        {map(listInfo, (item, index) => {
          return (
            <ListItem key={index}>
              <Icon name={item.iconName} type={item.iconType} color="#00a680" />
              <ListItem.Content>
                <ListItem.Title>{item.text}</ListItem.Title>
              </ListItem.Content>
            </ListItem>
          );
        })}
      </View>
    );
  }

  const addToFavorite = () => {
    if (!isLogged) {
      toastRef.current.show(
        "Para agregar a favoritos necesitas estar loggeado",
        1500
      );
    } else {
      const payload = {
        idUser: firebase.auth().currentUser.uid,
        idRestaurant: restaurant.id,
      };
      db.collection("favorites")
        .add(payload)
        .then((response) => {
          setIsFavorite(true);
          toastRef.current.show("Restaurant agregado a tus favoritos", 1500);
        })
        .catch((er) => {
          toastRef.current.show("Error al agregar a tus favoritos", 1500);
        });
    }
  };

  const removeToFavorite = () => {
    db.collection("favorites")
      .where("idRestaurant", "==", restaurant.id)
      .where("idUser", "==", firebase.auth().currentUser.uid)
      .get()
      .then((response) => {
        response.forEach((doc) => {
          const idFavorite = doc.id;
          db.collection("favorites")
            .doc(idFavorite)
            .delete()
            .then((response) => {
              setIsFavorite(false);
              toastRef.current.show(
                "Restaurante eliminado de tus favoritos",
                1500
              );
            })
            .catch((er) => {
              toastRef.current.show("Error al remover de tus favoritos", 1500);
            });
        });
      })
      .catch((er) => {
        toastRef.current.show("ha ocurrido un error inesperado");
      });
  };

  if (!restaurant) {
    return <Loading isVisible={true} text="Cargando..." />;
  } else {
    return (
      <ScrollView vertical style={styles.viewBody}>
        <View style={styles.viewFavorites}>
          <Icon
            type="material-community"
            name={isFavorite ? "heart" : "heart-outline"}
            onPress={isFavorite ? removeToFavorite : addToFavorite}
            color={isFavorite ? "red" : "black"}
            size={25}
            underlayColor="transparent"
          />
        </View>
        <CarouselImage
          arrayImages={restaurant.images}
          height={200}
          width={widthScreen}
        />
        <TitleRestaurant
          name={restaurant.name}
          description={restaurant.description}
          rating={parseFloat(restaurant.rating)}
        />
        <RestaurantInfo
          location={restaurant.location}
          name={restaurant.name}
          address={restaurant.address}
        />
        <ListReviews navigation={navigation} idRestaurant={restaurant.id} />
        <Toast ref={toastRef} position="center" opacity={0.9} />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  viewBody: {
    flex: 1,
    backgroundColor: "white",
  },
  viewTitle: {
    padding: 15,
    marginTop: 10,
  },
  nameRestaurant: {
    fontSize: 20,
    fontWeight: "bold",
  },
  descriptionRestaurant: {
    marginTop: 5,
    color: "grey",
  },
  rating: {
    position: "absolute",
    left: 14,
    marginTop: 0,
    marginRight: 10,
  },
  viewRestaurantInfo: {
    margin: 15,
    marginTop: 25,
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  containerListItem: {
    borderBottomColor: "#d8d8d8",
    borderBottomWidth: 1,
  },
  viewFavorites: {
    position: "absolute",
    top: 0,
    right: 0,
    zIndex: 2,
    backgroundColor: "white",
    borderBottomLeftRadius: 100,
    padding: 5,
    paddingLeft: 15,
  },
});
