import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Button, Avatar, Rating } from "react-native-elements";
import { map } from "lodash";
import { firebaseApp } from "../../../utils/firebase";
import firebase from "firebase/app";
import "firebase/firestore";

const db = firebase.firestore(firebaseApp);

export default function ListReviews(props) {
  const { navigation, idRestaurant } = props;

  const [userLogged, setUserLogged] = useState(false);
  const [reviews, setReviews] = useState(null);

  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      user ? setUserLogged(true) : setUserLogged(false);
    });
  }, []);

  useEffect(() => {
    const resultReview = [];
    db.collection("reviews")
      .where("idRestaurant", "==", idRestaurant)
      .get()
      .then((response) => {
        response.forEach((doc) => {
          const data = doc.data();
          data.id = doc.id;
          resultReview.push(data);
        });
        setReviews(resultReview);
      });
  }, []);

  function Review(props) {
    console.log(props);
    const { title, comment, rating, createdAt, avatarUser } = props.review;
    const createdReview = new Date(createdAt.seconds * 1000);
    const date = `${createdReview.getDate()}/${
      createdReview.getMonth() + 1
    }/${createdReview.getFullYear()}`;
    const hour = `${createdReview.getHours()}:${
      createdReview.getMinutes() < 10 ? "0" : ""
    }${createdReview.getMinutes()}`;
    return (
      <View style={styles.viewReviewContainer}>
        <View style={styles.viewImageAvatar}>
          <Avatar
            size="large"
            rounded
            containerStyle={styles.imageAvatarUser}
            source={
              avatarUser
                ? { uri: avatarUser }
                : require("../../../assets/img/no-image.png")
            }
          />
        </View>
        <View style={styles.viewInfo}>
          <Text style={styles.reviewTitle}>{title}</Text>
          <Text style={styles.reviewContent}>{comment}</Text>
          <Rating imageSize={15} startingValue={rating} readonly />
          <Text style={styles.reviewDate}>
            {date} {hour}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View>
      {userLogged ? (
        <Button
          title="Comenta tu experiencia"
          buttonStyle={styles.btnStyleReview}
          titleStyle={styles.btnStyleTitle}
          onPress={() =>
            navigation.navigate("add-review-restaurant", {
              idRestaurant,
            })
          }
          icon={{
            type: "material-community",
            name: "square-edit-outline",
            color: "#00a680",
          }}
        />
      ) : (
        <Text
          onPress={() => navigation.navigate("login")}
          style={{
            textAlign: "center",
            color: "#00a680",
            padding: 20,
          }}
        >
          Para comentar necesitas estar loggeado{"\n"}
          <Text style={{ fontWeight: "bold" }}>
            Pulsa aqui para iniciar sesion
          </Text>
        </Text>
      )}
      {map(reviews, (item, index) => (
        <Review review={item} key={index} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  btnStyleReview: {
    backgroundColor: "transparent",
  },
  btnStyleTitle: {
    color: "#00a680",
  },
  viewReviewContainer: {
    flexDirection: "row",
    padding: 10,
    paddingBottom: 20,
    borderBottomColor: "#e3e3e3",
    borderBottomWidth: 1,
  },
  viewImageAvatar: {
    marginRight: 15,
  },
  imageAvatarUser: {
    width: 50,
    height: 50,
  },
  viewInfo: {
    flex: 1,
    alignItems: "flex-start",
  },
  reviewTitle: {
    fontWeight: "bold",
  },
  reviewContent: {
    paddingTop: 2,
    color: "grey",
    marginBottom: 5,
  },
  reviewDate: {
    marginTop: 5,
    color: "grey",
    fontSize: 10,
    position: "absolute",
    right: 0,
    bottom: 0,
  },
});
