import React, { useState, useRef } from "react";
import { View, StyleSheet } from "react-native";
import Toast from "react-native-easy-toast";
import Loading from "../../components/Loading";
import CreateRestaurantForm from "../../components/Restaurant/CreateRestaurantForm";

export default function AddRestaurant(props) {
  const { navigation } = props;
  const toastRef = useRef();
  const [loading, setLoading] = useState(false);
  const [textLoader, setTextLoader] = useState("");

  return (
    <View>
      <CreateRestaurantForm
        toastRef={toastRef}
        setLoading={setLoading}
        navigation={navigation}
        setTextLoader={setTextLoader}
      />
      <Toast ref={toastRef} position="center" opacity={0.9} />
      <Loading isVisible={loading} text={textLoader} />
    </View>
  );
}

const styles = StyleSheet.create({});
