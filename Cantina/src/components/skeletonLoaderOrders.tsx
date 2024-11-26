import { View, Text, Image, StyleSheet } from 'react-native';
import React from 'react';

const SkeletonLoader = () => {
  return (
    <View style={styles.skeletonContainer}>

      
      {/* Pedido */}
      <View style={styles.skeletonText} />
      
      {/* Itens do pedido */}
      <View style={styles.skeletonItem}>
        <View style={styles.skeletonImage} />
        <View className="w-full border-b mt-4 border-gray-300"/>
        <View style={styles.skeletonText} />
     
      </View>

      <View style={styles.skeletonText} />
      <View style={styles.skeletonText} />
      <View style={styles.skeletonText} />
    </View>
  );
};

const styles = StyleSheet.create({
  skeletonContainer: {
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 8,
    shadowColor: '#000',    
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,             
    shadowRadius: 1,               
    elevation: 2,    
  },

  skeletonText: {
    height: 20,
    backgroundColor: '#e0e0e0',
marginBottom:8,
    borderRadius: 4,
  },
  skeletonItem: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  skeletonImage: {
    width: 80,
    height: 80,
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
    marginRight: 10,
  },
});

export default SkeletonLoader;
