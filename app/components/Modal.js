import { auth } from "firebase";
import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { Overlay } from "react-native-elements";

export default function Modal(props) {
  const { isVisible, setIsVisible, children } = props;
  const closeModal = () => setIsVisible(false);

  return (
    <View>
      <Overlay
        isVisible={isVisible}
        backdropStyle={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        overlayStyle={styles.overlay}
        onBackdropPress={closeModal}
      >
        {children}
      </Overlay>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    height: "auto",
    width: "90%",
    backgroundColor: "white",
  },
});
