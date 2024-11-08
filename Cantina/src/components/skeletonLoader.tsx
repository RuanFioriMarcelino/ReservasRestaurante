import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors } from "../styles/colors";

const SkeletonLoader = () => {
  return (
    <View style={styles.skeletonContainer}>
      <View style={styles.skeletonItem}>
        <View style={styles.skeletonImage} />
        <View style={styles.skeletonTextContainer}>
          <View style={styles.skeletonText} />
          <View style={styles.skeletonText} />
          <View style={styles.skeletonText} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  skeletonContainer: {
    padding: 10,
  },
  skeletonItem: {
    flexDirection: "row",
    marginBottom: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    overflow: "hidden",
  },
  skeletonImage: {
    width: 80,
    height: 80,
    backgroundColor: "#e0e0e0",
    borderRadius: 10,
  },
  skeletonTextContainer: {
    flex: 1,
    justifyContent: "center",
    padding: 10,
  },
  skeletonText: {
    height: 10,
    backgroundColor: "#e0e0e0",
    marginBottom: 5,
    borderRadius: 5,
  },
});

export default SkeletonLoader;
