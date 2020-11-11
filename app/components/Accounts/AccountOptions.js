import React, { useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import { ListItem, Icon } from "react-native-elements";
import { map } from "lodash";
import Modal from "../../components/Modal";
import ChangeNameForm from "./ChangeNameForm";
import ChangeMailForm from "./ChangeMailForm";
import ChangePasswordForm from "./ChangePasswordForm";

export default function AccountOptions(props) {
  const { user, toastRef, setReloadUserInfo } = props;
  const [isVisible, setIsVisible] = useState(false);
  const [renderComponent, setRenderComponent] = useState(null);

  const selectComponent = (key) => {
    switch (key) {
      case "name":
        setRenderComponent(
          <ChangeNameForm
            name={user.displayName}
            setIsVisible={setIsVisible}
            toastRef={toastRef}
            setReloadUserInfo={setReloadUserInfo}
          />
        );
        setIsVisible(true);
        break;
      case "email":
        setRenderComponent(
          <ChangeMailForm
            email={user.email}
            setIsVisible={setIsVisible}
            toastRef={toastRef}
            setReloadUserInfo={setReloadUserInfo}
          />
        );
        setIsVisible(true);
        break;
      case "password":
        setRenderComponent(
          <ChangePasswordForm setIsVisible={setIsVisible} toastRef={toastRef} />
        );
        setIsVisible(true);
        break;

      default:
        setRenderComponent(null);
        setIsVisible(false);
        break;
    }
  };

  const accountOptions = generateOptions(selectComponent);
  return (
    <View>
      {map(accountOptions, (menu, index) => (
        <ListItem key={index} bottomDivider onPress={menu.onPress}>
          <Icon name={menu.icon} type={menu.iconType} color={menu.iconColor} />
          <ListItem.Content>
            <ListItem.Title>{menu.title}</ListItem.Title>
          </ListItem.Content>
          <ListItem.Chevron />
        </ListItem>
      ))}
      {renderComponent && (
        <Modal isVisible={isVisible} setIsVisible={setIsVisible}>
          {renderComponent}
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({});

function generateOptions(selectComponent) {
  return [
    {
      title: "Cambiar nombre y apellido",
      icon: "account-circle",
      iconType: "material-community",
      iconColor: "#ccc",
      onPress: () => selectComponent("name"),
    },
    {
      title: "Cambiar email",
      icon: "at",
      iconType: "material-community",
      iconColor: "#ccc",
      onPress: () => selectComponent("email"),
    },
    {
      title: "Cambiar contraseña",
      icon: "lock-reset",
      iconType: "material-community",
      iconColor: "#ccc",
      onPress: () => selectComponent("password"),
    },
  ];
}
