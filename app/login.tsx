import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Image } from "react-native";
import { getApiBaseUrl } from "@/constants/oauth";
import { Platform } from "react-native";

export default function LoginScreen() {
  const handleGoogleLogin = () => {
    const clientId = "118571189751-862jnamko7fpo9eam4g4ruj80gr44a3k.apps.googleusercontent.com";
    const redirectUri = `${getApiBaseUrl()}/api/oauth/callback`;
    const scope = "https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email";
    const state = "google_" + Math.random().toString(36).substring(7);
    
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${encodeURIComponent(scope)}&state=${state}`;
    
    if (Platform.OS === "web") {
      window.location.href = authUrl;
    } else {
      // モバイルの場合はブラウザを開くなどの処理が必要ですが、今回はWebメインで進めます
      console.log("Mobile login not implemented yet");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>危険機械検査アプリ</Text>
        <Text style={styles.subtitle}>学習データを同期するためにログインしてください</Text>
        
        <TouchableOpacity style={styles.googleButton} onPress={handleGoogleLogin}>
          <Text style={styles.buttonText}>Googleでログイン</Text>
        </TouchableOpacity>
        
        <Text style={styles.footer}>
          ログインすることで、どの端末からでも学習履歴やランキングを確認できるようになります。
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 40,
    textAlign: "center",
  },
  googleButton: {
    backgroundColor: "#4285F4",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    width: "100%",
    maxWidth: 300,
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  footer: {
    marginTop: 40,
    fontSize: 12,
    color: "#999",
    textAlign: "center",
    lineHeight: 18,
  },
});
