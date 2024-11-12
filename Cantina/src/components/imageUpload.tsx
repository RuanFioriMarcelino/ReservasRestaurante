import React from "react";
import { View, Button, Alert } from "react-native";
import { launchImageLibrary } from "react-native-image-picker";
import storage from "@react-native-firebase/storage";

export default function ImageUploader() {
  const handleImageUpload = () => {
    launchImageLibrary({ mediaType: "photo" }, (response) => {
      if (response.didCancel) {
        Alert.alert("Upload Cancelled");
      } else if (response.errorMessage) {
        Alert.alert("Error:", response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        const imageUri = response.assets[0].uri;

        if (imageUri) {
          const fileName = response.assets[0].fileName || "default.jpg";
          const reference = storage().ref(`users/${fileName}`);
          reference
            .putFile(imageUri)
            .then(() => {
              Alert.alert("Image uploaded successfully!");
            })
            .catch((error) => {
              Alert.alert("Error uploading image:", error.message);
            });
        } else {
          Alert.alert("No image URI found");
        }
      } else {
        Alert.alert("No image selected");
      }
    });
  };
  return (
    <View>
      <Button title="Upload Image" onPress={handleImageUpload} />
    </View>
  );
}
