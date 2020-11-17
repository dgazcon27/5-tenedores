import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, ScrollView, Dimensions } from "react-native";
import { Rating, ListItem, Icon } from "react-native-elements";

import { firebaseApp } from "../../../utils/firebase";
import firebase from "firebase/app";
import "firebase/storage";
import "firebase/firestore";

import Loading from "../../components/Loading";
import CarouselImage from "../../components/Carousel";
import Map from "../../components/Map";
import { map } from "lodash";

const db = firebase.firestore(firebaseApp);
const widthScreen = Dimensions.get("window").width;

export default function RestaurantDetail(props) {
  const { navigation, route } = props;
  const { id, name } = route.params;
  const [restaurant, setRestaurant] = useState(null);

  useEffect(() => {
    navigation.setOptions({ title: name });
  }, []);

  useEffect(() => {
    let isCancelled = false;
    const getRestaurant = () => {
      db.collection("restaurant")
        .doc(id)
        .get()
        .then((response) => {
          const data = response.data();
          data.id = response.id;
          if (!isCancelled) {
            setRestaurant(data);
          }
        })
        .catch((er) => {
          console.log(er);
        });
    };

    getRestaurant();

    return () => {
      isCancelled = true;
    };
  }, []);

  function TitleRestaurant({ name, description, rating }) {
    console.log(rating);
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

  if (!restaurant) {
    return <Loading isVisible={true} text="Cargando..." />;
  } else {
    return (
      <ScrollView vertical style={styles.viewBody}>
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
});
