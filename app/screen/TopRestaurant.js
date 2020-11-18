import React, { useEffect, useState, useRef } from "react";
import { View } from "react-native";
import { firebaseApp } from "../../utils/firebase";
import firebase from "firebase/app";
import "firebase/firestore";
import Toast from "react-native-easy-toast";

import ListTopRestaurant from "../components/TopRestaurant/ListTopRestaurant";

const db = firebase.firestore(firebaseApp);
export default function TopRestaurant(props) {
  const { navigation } = props;
  const [restaurants, setRestaurants] = useState([]);
  const toastRef = useRef();
  console.log(restaurants);
  useEffect(() => {
    db.collection("restaurant")
      .orderBy("rating", "desc")
      .limit(5)
      .get()
      .then((response) => {
        const listData = [];
        response.forEach((doc) => {
          const data = doc.data();
          data.id = doc.id;
          listData.push(data);
        });
        setRestaurants(listData);
      });
  }, []);

  return (
    <View>
      <ListTopRestaurant restaurants={restaurants} navigation={navigation} />
      <Toast ref={toastRef} opacity={0.8} position="center" />
    </View>
  );
}
