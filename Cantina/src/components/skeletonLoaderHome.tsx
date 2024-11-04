import React from "react";
import { View, StyleSheet } from "react-native";

const SkeletonLoaderHome = () => {
  return (
    <View style={styles.skeletonContainer}>
      <View style={styles.imageSkeleton} />
      <View style={styles.textContainer}>
        <View style={styles.textSkeleton} />
        <View style={styles.textSkeleton} />
        <View style={styles.priceSkeleton} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  skeletonContainer: {
    width: "45%",
    height: 200,
    backgroundColor: "#e0e0e0",
    borderRadius: 25,
    marginBottom: 20,
    marginTop: 50,
    justifyContent: "flex-end",
    padding: 10,
  },
  imageSkeleton: {
    width: 150,
    height: 150,
    backgroundColor: "#ccc",
    borderRadius: 75,
    position: "absolute",
    bottom: 100,
    alignSelf: "center",
  },
  textContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  textSkeleton: {
    width: "60%",
    height: 20,
    backgroundColor: "#ccc",
    marginBottom: 10,
  },
  priceSkeleton: {
    width: "40%",
    height: 20,
    backgroundColor: "#ccc",
  },
});

export default SkeletonLoaderHome;
