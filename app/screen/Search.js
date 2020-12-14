import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  ActivityIndicator,
} from "react-native";
import { SearchBar, ListItem, Icon, Avatar } from "react-native-elements";
import { FireSQL } from "firesql";
import firebase from "firebase/app";
import { size } from "lodash";

const fireSQL = new FireSQL(firebase.firestore(), { includeId: "id" });

export default function Search(props) {
  const { navigation } = props;
  const [search, setSearch] = useState("");
  const [restaurants, setRestaurants] = useState([]);
  const [timer, setTimer] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (search) {
      if (timer) clearTimeout(timer);
      setTimer(
        setTimeout(() => {
          setLoading(true);
          fireSQL
            .query(
              `SELECT * FROM restaurant WHERE seeker LIKE '${search.toLowerCase()}%'`
            )
            .then((response) => {
              setLoading(false);
              setRestaurants(response);
            });
        }, 1000)
      );
    }
  }, [search]);

  return (
    <View>
      <SearchBar
        placeholder="Buscar restaurant..."
        onChangeText={(e) => setSearch(e)}
        containerStyle={styles.searchBarContainer}
        inputStyle={{ color: "#000" }}
        lightTheme
        searchIcon={loading && <ActivityIndicator color="#000" />}
        round
        value={search}
      />
      {size(restaurants) === 0 ? (
        <NotFoundRestaurant />
      ) : (
        <FlatList
          data={restaurants}
          renderItem={(restaurant) => (
            <Restaurant restaurant={restaurant} navigation={navigation} />
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      )}
    </View>
  );
}

function NotFoundRestaurant() {
  return (
    <View style={{ flex: 1, alignItems: "center" }}>
      <Image
        source={require("../../assets/img/no-result-found.png")}
        resizeMode="cover"
        style={{ width: 200, height: 200 }}
      />
    </View>
  );
}

function Restaurant({ restaurant, navigation }) {
  const { name, id, images, description } = restaurant.item;
  return (
    <ListItem
      bottomDivider
      onPress={() =>
        navigation.navigate("restaurant", {
          screen: "detail-restaurant",
          params: { id: id, name: name },
        })
      }
    >
      <Avatar
        size="medium"
        source={
          images[0]
            ? { uri: images[0] }
            : require("../../assets/img/no-image.png")
        }
      />
      <ListItem.Content>
        <ListItem.Title>{name}</ListItem.Title>
      </ListItem.Content>
      <ListItem.Chevron />
    </ListItem>
  );
}

const styles = StyleSheet.create({
  searchBarContainer: {
    marginBottom: 20,
    backgroundColor: "transparent",
    borderBottomColor: "transparent",
  },
});
