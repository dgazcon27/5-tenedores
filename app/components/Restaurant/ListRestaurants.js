import React from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { Image } from "react-native-elements";
import { size } from "lodash";
import { useNavigation } from "@react-navigation/native";

export default function ListRestaurants(props) {
  const { restaurants, handledLoadMore, isLoading } = props;
  const navigation = useNavigation();
  return (
    <View>
      {size(restaurants) > 0 ? (
        <FlatList
          data={restaurants}
          renderItem={(item) => (
            <RestaurantItem restaurant={item} navigation={navigation} />
          )}
          keyExtractor={(item, index) => index.toString()}
          onEndReachedThreshold={0.5}
          onEndReached={handledLoadMore}
          ListFooterComponent={<FooterList isLoading={isLoading} />}
        />
      ) : (
        <View style={styles.loaderRestaurant}>
          <ActivityIndicator size="large" color="#00a680" />
          <Text>Cargando restaurantes</Text>
        </View>
      )}
    </View>
  );
}

function RestaurantItem(props) {
  const { restaurant } = props;
  const { id, images, name, address, description } = restaurant.item;
  const { navigation } = props;

  const goRestaurant = () => {
    navigation.navigate("detail-restaurant", { id, name });
  };

  return (
    <TouchableOpacity onPress={goRestaurant}>
      <View style={styles.viewContainer}>
        <View style={styles.imageRestaurantContainer}>
          <Image
            resizeMode="cover"
            PlaceholderContent={<ActivityIndicator color="#00a680" />}
            source={
              images[0]
                ? { uri: images[0] }
                : require("../../../assets/img/no-image.png")
            }
            style={styles.imageRestaurant}
          />
        </View>
        <View>
          <Text style={styles.restaurantName}>{name}</Text>
          <Text style={styles.restaurantAddress}>{address}</Text>
          <Text style={styles.restaurantDescription}>
            {description.substr(0, 60)}...
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

function FooterList(props) {
  const { isLoading } = props;
  if (isLoading) {
    return (
      <View style={styles.loaderRestaurant}>
        <ActivityIndicator size="large" color="#00a680" />
      </View>
    );
  } else {
    return (
      <View style={styles.notFoundRestaurant}>
        <Text>No quedan restaurantes por cargar</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  loaderRestaurant: {
    marginBottom: 10,
    marginTop: 10,
    alignItems: "center",
  },
  viewContainer: {
    flexDirection: "row",
    margin: 10,
  },
  imageRestaurantContainer: {
    marginRight: 15,
  },
  imageRestaurant: {
    width: 80,
    height: 80,
  },
  restaurantName: {
    fontWeight: "bold",
  },
  restaurantAddress: {
    paddingTop: 2,
    color: "grey",
  },
  restaurantDescription: {
    color: "grey",
    paddingTop: 2,
    width: 300,
  },
  notFoundRestaurant: {
    marginTop: 10,
    marginBottom: 20,
    alignItems: "center",
  },
});
