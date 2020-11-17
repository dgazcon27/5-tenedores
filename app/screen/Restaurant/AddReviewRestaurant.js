import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Rating, AirbnbRating, Button, Input } from "react-native-elements";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Toast from "react-native-easy-toast";
import Loading from "../../components/Loading";

import { firebaseApp } from "../../../utils/firebase";
import firebase from "firebase/app";
import "firebase/firestore";

const db = firebase.firestore(firebaseApp);

export default function AddReviewRestaurant(props) {
  const { route, navigation } = props;
  const { idRestaurant } = route.params;
  const toastRef = useRef();
  const [rating, setRating] = useState(0);
  const [form, setForm] = useState({ title: "", comment: "", rating: "" });
  const [isLoading, setIsLoading] = useState(false);

  const onChange = (e, type) => {
    let value = e.nativeEvent.text;
    setForm({ ...form, [type]: value });
  };

  const onRating = (rating, type) => {
    setForm({ ...form, [type]: rating });
  };

  const updateRestaurant = async () => {
    const restaurantRef = db.collection("restaurant").doc(idRestaurant);

    await restaurantRef.get().then((response) => {
      const data = response.data();
      const ratingTotal = data.ratingTotal + form.rating;
      const quantityVoting = data.quantityVoting + 1;
      const ratingResult = ratingTotal / quantityVoting;

      restaurantRef
        .update({
          rating: ratingResult,
          ratingTotal,
          quantityVoting,
        })
        .then((response) => {
          setIsLoading(false);
          toastRef.current.show(
            "Comentario guardado exitosamente.",
            1500,
            () => {
              navigation.goBack();
            }
          );
        })
        .catch((er) => {
          setIsLoading(false);
          toastRef.current.show("Error al enviar comentario", 2000);
        });
    });
  };

  const onSubmit = () => {
    if (!form.rating) {
      toastRef.current.show("Debes seleccionar una calificación.");
    } else if (!form.title) {
      toastRef.current.show("Debes agregar un título.");
    } else if (!form.comment) {
      toastRef.current.show("Debes agregar un comentario.");
    } else {
      setIsLoading(true);
      const user = firebase.auth().currentUser;
      const payload = {
        ...form,
        idUser: user.uid,
        avatarUser: user.photoURL,
        idRestaurant: idRestaurant,
        createAt: new Date(),
      };
      db.collection("reviews")
        .add(payload)
        .then((response) => {
          updateRestaurant();
        })
        .catch((er) => {
          setIsLoading(false);
          toastRef.current.show("Error al enviar comentario");
        });
    }
  };

  return (
    <KeyboardAwareScrollView>
      <View style={styles.viewBody}>
        <View style={styles.viewRating}>
          <AirbnbRating
            count={5}
            reviews={["Terrible", "Malo", "Regular", "Bueno", "Excelente"]}
            defaultRating={0}
            size={35}
            onFinishRating={(e) => onRating(e, "rating")}
          />
        </View>
        <View style={styles.formReview}>
          <Input
            placeholder="Título"
            containerStyle={styles.inputStyles}
            onChange={(e) => onChange(e, "title")}
          />
          <Input
            multiline
            placeholder="Comentario"
            containerStyle={styles.textAreaInput}
            onChange={(e) => onChange(e, "comment")}
          />
        </View>
        <Button
          title="Enviar Comentario"
          containerStyle={styles.btnContainer}
          buttonStyle={styles.btn}
          onPress={onSubmit}
        />
      </View>
      <Toast ref={toastRef} position="center" opacity={0.9} />
      <Loading isVisible={isLoading} text="Guardando Comentario" />
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  viewBody: {
    flex: 1,
  },
  viewRating: {
    height: 110,
    backgroundColor: "#f2f2f2",
  },
  formReview: {
    flex: 1,
    alignItems: "center",
    margin: 10,
    marginTop: 20,
  },
  inputStyles: {
    marginBottom: 10,
  },
  textAreaInput: {
    height: 150,
    width: "100%",
    padding: 0,
    margin: 0,
  },
  btnContainer: {
    flex: 1,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 10,
    width: "100%",
  },
  btn: {
    backgroundColor: "#00a680",
  },
});
