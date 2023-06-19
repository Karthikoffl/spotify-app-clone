import { Text, View, SafeAreaView, Pressable } from "react-native";
import React, { useEffect } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { Entypo, MaterialIcons, AntDesign } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import * as WebBrowser from "expo-web-browser";
import {
  makeRedirectUri,
  ResponseType,
  useAuthRequest,
} from "expo-auth-session";

WebBrowser.maybeCompleteAuthSession();

const LoginScreen = () => {
  const navigation = useNavigation();

  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: "1f47cf563e1f4a5c8d08c39abaaf95b1",
      redirectUri: "exp://192.168.0.107:19000/--/spotify-auth-callback",
      scopes: [
        "user-read-email",
        "user-library-read",
        "user-read-recently-played",
        "user-top-read",
        "playlist-read-private",
        "playlist-read-collaborative",
        "playlist-modify-public", // or "playlist-modify-private"
      ],
      responseType: "code",
    },
    { authorizationEndpoint: "https://accounts.spotify.com/authorize" }
  );

  useEffect(() => {
    if (response?.type === "success") {
      const { code } = response.params;
      exchangeCodeForToken(code);
    }
  }, [response]);

  const exchangeCodeForToken = async (code) => {
    const tokenEndpoint = "https://accounts.spotify.com/api/token";
    // const redirectUri = makeRedirectUri({ useProxy: true });

    const params = {
      grant_type: "authorization_code",
      code,
      redirect_uri: "exp://192.168.0.107:19000/--/spotify-auth-callback",
      client_id: "1f47cf563e1f4a5c8d08c39abaaf95b1",
      client_secret: "d7645488462340cf9d91db926fbce8a7",
    };

    try {
      const response = await fetch(tokenEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams(params).toString(),
      });

      const { access_token, expires_in } = await response.json();
      const expirationDate = new Date().getTime();
      console.log("Access Token:", code);
      console.log("Expiration Date:", new Date(expirationDate));
    } catch (error) {
      console.error("Error exchanging code for access token:", error);
    }
  };

  // useEffect(() => {
  //   const checkTokenValidity = async () => {
  //     const code = await AsyncStorage.getItem("token");
  //     const expirationDate = await AsyncStorage.getItem("expirationDate");
  //     console.log("Access token", code);
  //     console.log("Expiration date", expirationDate);

  //     if (code && expirationDate) {
  //       const currentTime = Date.now();
  //       if (currentTime < parseInt(expirationDate)) {
  //         // here the token is still valid
  //         navigation.replace("Main");
  //       } else {
  //         // token would be expired so we need to remove it from async storage
  //         AsyncStorage.removeItem("token");
  //         AsyncStorage.removeItem("expirationDate");
  //       }
  //     }
  //   };
  //   checkTokenValidity();
  // }, []);

  // async function authenticate() {
  //   const config = {
  //     issuer: "https://accounts.spotify.com",
  //     clientId: "1f47cf563e1f4a5c8d08c39abaaf95b1",
  //     scopes: [
  //       "user-read-email",
  //       "user-library-read",
  //       "user-read-recently-played",
  //       "user-top-read",
  //       "playlist-read-private",
  //       "playlist-read-collaborative",
  //       "playlist-modify-public", // or "playlist-modify-private"
  //     ],
  //     redirectUrl: "exp://localhost:19000/--/spotify-auth-callback",
  //   };
  //   const result = await AppAuth.authAsync(config);
  //   console.log(result);
  //   if (result.accessToken) {
  //     const expirationDate = new Date(
  //       result.accessTokenExpirationDate
  //     ).getTime();
  //     AsyncStorage.setItem("token", result.accessToken);
  //     AsyncStorage.setItem("expirationDate", expirationDate.toString());
  //     navigation.navigate("Main");
  //   }
  // }

  return (
    <LinearGradient colors={["#040306", "#131624"]} style={{ flex: 1 }}>
      <SafeAreaView>
        <View style={{ height: 80 }} />
        <Entypo
          name="spotify"
          size={80}
          color="white"
          style={{ textAlign: "center" }}
        />
        <Text
          style={{
            color: "white",
            fontSize: 40,
            fontWeight: "bold",
            textAlign: "center",
            marginTop: 40,
          }}
        >
          Millions of songs free on spotify
        </Text>
        <View style={{ height: 80 }} />
        <Pressable
          onPress={() => promptAsync()}
          style={{
            backgroundColor: "#1DB954",
            padding: 13,
            marginLeft: "auto",
            marginRight: "auto",
            width: 300,
            borderRadius: 25,
            alignItems: "center",
            justifyContent: "center",
            marginVertical: 10,
          }}
          disabled={!request}
        >
          <Text style={{ fontWeight: "bold" }}>Sign in with spotify</Text>
        </Pressable>
        <Pressable
          style={{
            backgroundColor: "#131624",
            padding: 10,
            marginLeft: "auto",
            marginRight: "auto",
            width: 300,
            borderRadius: 25,
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "row",
            marginVertical: 10,
            borderColor: "#C0C0C0",
            borderWidth: 0.8,
          }}
        >
          <MaterialIcons name="phone-android" size={24} color="white" />
          <Text
            style={{
              fontWeight: "400",
              color: "white",
              textAlign: "center",
              flex: 1,
            }}
          >
            Continue with phone number
          </Text>
        </Pressable>
        <Pressable
          style={{
            backgroundColor: "#131624",
            padding: 10,
            marginLeft: "auto",
            marginRight: "auto",
            width: 300,
            borderRadius: 25,
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "row",
            marginVertical: 10,
            borderColor: "#C0C0C0",
            borderWidth: 0.8,
          }}
        >
          <AntDesign name="google" size={24} color="red" />
          <Text
            style={{
              fontWeight: "400",
              color: "white",
              textAlign: "center",
              flex: 1,
            }}
          >
            Continue with Google
          </Text>
        </Pressable>
        <Pressable
          style={{
            backgroundColor: "#131624",
            padding: 10,
            marginLeft: "auto",
            marginRight: "auto",
            width: 300,
            borderRadius: 25,
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "row",
            marginVertical: 10,
            borderColor: "#C0C0C0",
            borderWidth: 0.8,
          }}
        >
          <AntDesign name="facebook-square" size={24} color="blue" />
          <Text
            style={{
              fontWeight: "400",
              color: "white",
              textAlign: "center",
              flex: 1,
            }}
          >
            Sign in with facebook
          </Text>
        </Pressable>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default LoginScreen;
