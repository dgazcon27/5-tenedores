import React, { useState, useEffect, useCallback, useRef } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { StyleSheet, View, Text } from "react-native";
import { Icon } from "react-native-elements";
import Toast from "react-native-easy-toast";
import { firebaseApp } from "../../../utils/firebase";
import firebase from "firebase/app";
import "firebase/firestore";
import ListRestaurants from "../../components/Restaurant/ListRestaurants";

const db = firebase.firestore(firebaseApp);

export default function Restaurant(props) {
  const { navigation } = props;
  const toastRef = useRef();
  const limitRestaurant = 10;

  const [user, setUser] = useState({});
  const [restaurants, setRestaurants] = useState([]);
  const [totalRestaurants, setTotalRestaurants] = useState(0);
  const [startRestaurant, setStartRestaurant] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    firebase.auth().onAuthStateChanged((userInfo) => {
      setUser(userInfo);
    });
  }, []);

  useFocusEffect(
    useCallback(() => {
      db.collection("restaurant")
        .get()
        .then((response) => {
          setTotalRestaurants(response.size);
        });

      const resultRestaurant = [];
      db.collection("restaurant")
        .orderBy("name", "asc")
        .limit(limitRestaurant)
        .get()
        .then((response) => {
          setTotalRestaurants(response.size);
          setStartRestaurant(response.docs[response.docs.length - 1]);

          response.forEach((item) => {
            const restaurantData = item.data();
            restaurantData.id = item.id;
            resultRestaurant.push(restaurantData);
          });
          setRestaurants(resultRestaurant);
        })
        .catch((er) => {
          toastRef.current.show("Lo sentimos, error de conexión");
        });
    }, [])
  );
  const handledLoadMore = () => {
    const resultRestaurant = [];

    restaurants.length < totalRestaurants && setIsLoading(true);

    db.collection("restaurant")
      .orderBy("name", "asc")
      .startAfter(startRestaurant.data().name)
      .limit(limitRestaurant)
      .get()
      .then((response) => {
        if (response.docs.length > 0) {
          setStartRestaurant(response.docs[response.docs.length - 1]);
        } else {
          setIsLoading(false);
        }

        response.forEach((item) => {
          const restaurantData = item.data();
          restaurantData.id = item.id;
          resultRestaurant.push(restaurantData);
        });
        setRestaurants([...restaurants, ...resultRestaurant]);
      })
      .catch((er) => {
        toastRef.current.show("Lo sentimos, error de conexión");
      });
  };

  return (
    <View style={styles.viewContainer}>
      <ListRestaurants
        restaurants={restaurants}
        handledLoadMore={handledLoadMore}
        isLoading={isLoading}
      />
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
      <Toast ref={toastRef} position="center" opacity={0.9} />
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
