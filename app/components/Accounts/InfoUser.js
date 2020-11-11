import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { Avatar, Accessory } from "react-native-elements";
import * as firebase from "firebase";
import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker";
import { Loading } from "../Loading";

export default function InfoUser(props) {
  const {
    user: { uid, photoURL, displayName, email },
    toastRef,
    setLoading,
    setLoadingText,
  } = props;

  const updatePhotoUrl = () => {
    firebase
      .storage()
      .ref(`avatar/${uid}`)
      .getDownloadURL()
      .then(async (response) => {
        const update = {
          photoURL: response,
        };
        await firebase.auth().currentUser.updateProfile(update);
        setLoading(false);
      })
      .catch((e) => {
        toastRef.current.show("Ups! algo ha salido mal");
      });
  };

  const uploadImage = async (uri) => {
    setLoadingText("Actualizando avatar");
    setLoading(true);
    const response = await fetch(uri);
    const blob = await response.blob();
    const ref = firebase.storage().ref().child(`avatar/${uid}`);
    return ref.put(blob);
  };

  const changeAvatar = async () => {
    const resultPermissions = await Permissions.askAsync(
      Permissions.CAMERA_ROLL
    );
    const resultPermissionsCamera =
      resultPermissions.permissions.cameraRoll.status;
    if (resultPermissionsCamera === "denied") {
      toastRef.current.show("Es necesario acceptar los permisos de la galería");
    } else {
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [4, 3],
      });

      if (result.cancelled) {
        toastRef.current.show("Has cerrado la seleccion de imagen");
      } else {
        uploadImage(result.uri)
          .then((r) => {
            updatePhotoUrl();
          })
          .catch((e) => {
            toastRef.current.show("Ups! algo ha salido mal");
          });
      }
    }
  };

  return (
    <View style={styles.viewContainer}>
      <Avatar
        size="large"
        rounded
        containerStyle={styles.userAvatar}
        overlayContainerStyle={styles.userAvatarContainer}
        source={
          photoURL
            ? { uri: photoURL }
            : require("../../../assets/img/avatar-default.jpg")
        }
        onPress={changeAvatar}
      >
        <Accessory size={20} />
      </Avatar>
      <View style={styles.containerText}>
        <Text style={styles.userText}>
          {displayName ? displayName : "Anonimo"}
        </Text>
        <Text> {email ? email : "Anonimo"}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  viewContainer: {
    alignItems: "center",
    justifyContent: "flex-start",
    flexDirection: "row",
    backgroundColor: "#f2f2f2",
    paddingTop: 30,
    paddingBottom: 30,
    paddingLeft: 10,
  },
  userAvatarContainer: {
    backgroundColor: "#c2c2c2",
  },
  userAvatar: {
    marginRight: 20,
  },
  userText: {
    fontWeight: "bold",
    paddingBottom: 10,
  },
  avatarAccesory: {
    width: "100%",
    height: "100%",
  },
  containerText: {
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
});
