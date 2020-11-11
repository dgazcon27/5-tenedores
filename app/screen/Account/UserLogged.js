import React, { useRef, useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Button } from "react-native-elements";
import * as firebase from "firebase";
import Toast from "react-native-easy-toast";

import Loading from "../../components/Loading";
import InfoUser from "../../components/Accounts/InfoUser";
import AccountOptions from "../../components/Accounts/AccountOptions";

export default function UserLogged() {
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("");
  const [userCurrent, setUserCurrent] = useState(null);
  const [reloadUserInfo, setReloadUserInfo] = useState(false);
  const toastRef = useRef();

  useEffect(() => {
    (async () => {
      const user = await firebase.auth().currentUser;
      setUserCurrent(user);
    })();
    setReloadUserInfo(false);
  }, [reloadUserInfo]);

  return (
    <View style={styles.viewUserInfo}>
      {userCurrent && (
        <InfoUser
          user={userCurrent}
          toastRef={toastRef}
          setLoading={setLoading}
          setLoadingText={setLoadingText}
        />
      )}
      <AccountOptions
        user={userCurrent}
        toastRef={toastRef}
        setReloadUserInfo={setReloadUserInfo}
      />
      <Button
        title="Cerrar sesión"
        buttonStyle={styles.closeSesion}
        titleStyle={styles.btnTitle}
        onPress={() => firebase.auth().signOut()}
      />
      <Toast position="center" opacity={0.9} ref={toastRef} />
      <Loading text={loadingText} isVisible={loading} />
    </View>
  );
}

const styles = StyleSheet.create({
  viewUserInfo: {
    minHeight: "100%",
    backgroundColor: "#f2f2f2",
  },
  closeSesion: {
    marginTop: 30,
    borderRadius: 0,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e3e3e3",
    borderBottomWidth: 1,
    borderBottomColor: "#e3e3e3",
    paddingTop: 10,
    paddingBottom: 10,
  },
  btnTitle: {
    color: "#00a680",
  },
});
