import React, { useEffect, useState } from "react";
import { StyleSheet, View, ScrollView, Dimensions, Alert } from "react-native";
import { Icon, Avatar, Image, Button, Input } from "react-native-elements";
import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker";
import { map, size, filter } from "lodash";
import * as Location from "expo-location";
import MapView from "react-native-maps";
import uuid from "random-uuid-v4";
import Modal from "../Modal";

import { firebaseApp } from "../../../utils/firebase";
import firebase from "firebase/app";
import "firebase/storage";
import "firebase/firestore";

const db = firebase.firestore(firebaseApp);
const widthScreen = Dimensions.get("window").width;

export default function CreateRestaurantForm(props) {
  const { toastRef, setLoading, navigation, setTextLoader } = props;
  const [form, setForm] = useState(initialData());
  const [imageList, setImageList] = useState([]);
  const [restaurantLocation, setRestaurantLocation] = useState(initLocation());
  const [isVisibleMap, setisVisibleMap] = useState(false);

  const onChange = (e, type) => {
    let value = e.nativeEvent.text;
    setForm({ ...form, [type]: value });
  };

  const storageImages = async () => {
    const imageBlob = [];
    await Promise.all(
      map(imageList, async (images) => {
        const response = await fetch(images);
        const blob = await response.blob();
        const ref = firebase.storage().ref("restaurants").child(uuid());
        await ref.put(blob).then(async (result) => {
          await firebase
            .storage()
            .ref(`restaurants/${result.metadata.name}`)
            .getDownloadURL()
            .then((photoUrl) => {
              imageBlob.push(photoUrl);
            });
        });
      })
    );
    return imageBlob;
  };

  const onSubmit = () => {
    if (!form.name) {
      toastRef.current.show("El restaurant debe poseer un nombre");
    } else if (!form.address) {
      toastRef.current.show("El restaurant debe poseer un direccion");
    } else if (!form.description) {
      toastRef.current.show("El restaurant debe poseer una descripción");
    } else if (size(imageList) === 0) {
      toastRef.current.show("El restaurant debe tener al menos una imagen");
    } else {
      setLoading(true);
      setTextLoader("Cargando Imágenes");
      storageImages()
        .then((response) => {
          setTextLoader("Guardando Datos");
          db.collection("restaurant")
            .add({
              name: form.name,
              address: form.address,
              location: restaurantLocation,
              description: form.description,
              images: response,
              rating: 0,
              ratingTotal: 0,
              quantityVoting: 0,
              createAt: new Date(),
              createBy: firebase.auth().currentUser.uid,
              seeker: form.name.toLowerCase(),
            })
            .then((response) => {
              setLoading(false);
              toastRef.current.show(
                "Restaurant creado exitosamente",
                1500,
                () => {
                  navigation.navigate("restaurant");
                }
              );
            })
            .catch((e) => {
              setLoading(false);
              toastRef.current.show(
                "Error al crear el restaurant, intentelo mas tarde"
              );
              console.log(e);
            });
        })
        .catch((e) => {
          setLoading(false);
          toastRef.current.show("Error al cargar la imagen");
        });
    }
  };

  return (
    <ScrollView style={styles.scrollView}>
      <ImageRestaurant imageRestaurant={imageList[0]} />
      <FormAdd
        onChange={onChange}
        setisVisibleMap={setisVisibleMap}
        restaurantLocation={restaurantLocation}
      />
      <UploadImage
        toastRef={toastRef}
        setImageList={setImageList}
        imageList={imageList}
      />
      <Button
        title="Crear Restaurant"
        onPress={onSubmit}
        buttonStyle={styles.btnContainer}
      />
      <Map
        isVisibleMap={isVisibleMap}
        setisVisibleMap={setisVisibleMap}
        setRestaurantLocation={setRestaurantLocation}
        toastRef={toastRef}
      />
    </ScrollView>
  );
}

function Map(props) {
  const {
    isVisibleMap,
    setisVisibleMap,
    setRestaurantLocation,
    toastRef,
  } = props;
  const [location, setLocation] = useState(null);

  const configLocation = (params) => {
    setRestaurantLocation(location);
    toastRef.current.show("Localización guardada correctamente");
    setisVisibleMap(false);
  };

  useEffect(() => {
    (async () => {
      const resultPermissions = await Permissions.askAsync(
        Permissions.LOCATION
      );
      const statusPermission = resultPermissions.permissions.location.status;
      if (statusPermission !== "granted") {
        toastRef.current.show(
          "Es necesario aceptar los permisos de localizacion para crear un restaurant",
          3000
        );
      } else {
        const locat = await Location.getCurrentPositionAsync({});
        setLocation({
          latitude: locat.coords.latitude,
          longitude: locat.coords.longitude,
          latitudeDelta: 0.001,
          longitudeDelta: 0.001,
        });
      }
    })();
  }, []);
  return (
    <Modal isVisible={isVisibleMap} setIsVisible={setisVisibleMap}>
      <View>
        {location && (
          <MapView
            style={styles.mapStyles}
            initialRegion={location}
            showsUserLocation={true}
            onRegionChange={(region) => setLocation(region)}
          >
            <MapView.Marker
              coordinate={{
                latitude: location.latitude,
                longitude: location.longitude,
              }}
              draggable
            />
          </MapView>
        )}
        <View style={styles.viewBtnMap}>
          <Button
            title="Guardar ubicación"
            containerStyle={styles.viewBtnMapSaveContainer}
            buttonStyle={styles.viewBtnMapSave}
            onPress={configLocation}
          />
          <Button
            title="Cancelar ubicación"
            containerStyle={styles.viewBtnMapCancelContainer}
            buttonStyle={styles.viewBtnMapCancel}
            onPress={() => setisVisibleMap(false)}
          />
        </View>
      </View>
    </Modal>
  );
}

function FormAdd(props) {
  const { onChange, setisVisibleMap, restaurantLocation } = props;
  return (
    <View style={styles.viewFormAdd}>
      <Input
        placeholder="Nombre del restaurant"
        style={styles.inputForm}
        onChange={(e) => onChange(e, "name")}
      />
      <Input
        placeholder="Dirección"
        style={styles.inputForm}
        onChange={(e) => onChange(e, "address")}
        rightIcon={{
          type: "material-community",
          name: "google-maps",
          color: restaurantLocation ? "#00a680" : "#c2c2c2",
          onPress: () => setisVisibleMap(true),
        }}
      />
      <Input
        placeholder="Descripción"
        multiline={true}
        style={styles.inputTextArea}
        onChange={(e) => onChange(e, "description")}
      />
    </View>
  );
}

function UploadImage(props) {
  const { toastRef, setImageList, imageList } = props;
  const selectImage = async (params) => {
    const resultPermissions = await Permissions.askAsync(
      Permissions.CAMERA_ROLL
    );
    if (resultPermissions === "denied") {
      toastRef.current.show(
        "Es necesario aceptar los permisos de la galeria, si lo has rechazado debes ir a configuracion y cambiarlos manualmente",
        3000
      );
    } else {
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [4, 3],
      });
      if (result.cancelled) {
        toastRef.current.show("Seleccion de imagen cancelada");
      } else {
        setImageList([...imageList, result.uri]);
      }
    }
  };

  const removeImage = (image) => {
    Alert.alert(
      "Eliminar Imagen",
      "¿Deseas remover esta imagen?",
      [
        {
          text: "Cancel",
          styles: "cancel",
        },
        {
          text: "Eliminar",
          onPress: () => {
            const imagesFiltered = filter(
              imageList,
              (imagen) => imagen !== image
            );
            setImageList(imagesFiltered);
          },
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <View style={styles.containerImage}>
      {size(imageList) < 4 && (
        <Icon
          type="material-community"
          name="camera"
          color="#7a7a7a"
          containerStyle={styles.iconUpload}
          onPress={selectImage}
        />
      )}
      {map(imageList, (imagen, index) => (
        <Avatar
          key={index}
          style={styles.miniatureImagen}
          source={{ uri: imagen }}
          onPress={() => removeImage(imagen)}
        />
      ))}
    </View>
  );
}

function ImageRestaurant(props) {
  const { imageRestaurant } = props;
  return (
    <View style={styles.containerImagenRestaurant}>
      <Image
        source={
          imageRestaurant
            ? { uri: imageRestaurant }
            : require("../../../assets/img/no-image.png")
        }
        style={{ width: widthScreen, height: 200 }}
      />
    </View>
  );
}

function initialData() {
  return {
    name: "",
    address: "",
    description: "",
  };
}

function initLocation() {
  return {
    latitude: 0,
    longitude: 0,
    longitudeDelta: 0,
    latitudeDelta: 0,
  };
}

const styles = StyleSheet.create({
  scrollView: {
    height: "100%",
  },
  viewFormAdd: {
    marginLeft: 10,
    marginRight: 10,
  },
  inputForm: {
    marginBottom: 10,
  },
  inputTextArea: {
    height: 100,
    width: "100%",
    padding: 0,
    margin: 0,
  },
  btnContainer: {
    backgroundColor: "#00a680",
    margin: 20,
  },
  containerImage: {
    flexDirection: "row",
    marginLeft: 20,
    marginRight: 20,
    marginTop: 30,
  },
  iconUpload: {
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
    height: 70,
    width: 70,
    backgroundColor: "#e3e3e3",
  },
  miniatureImagen: {
    width: 70,
    height: 70,
    marginRight: 10,
  },
  containerImagenRestaurant: {
    alignItems: "center",
    height: 200,
    marginBottom: 20,
  },
  mapStyles: {
    width: "100%",
    height: 400,
  },
  viewBtnMap: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  viewBtnMapCancelContainer: {
    paddingLeft: 5,
  },
  viewBtnMapCancel: {
    backgroundColor: "#a60d0d",
  },
  viewBtnMapSaveContainer: {
    paddingRight: 5,
  },
  viewBtnMapSave: {
    backgroundColor: "#00a680",
  },
});
