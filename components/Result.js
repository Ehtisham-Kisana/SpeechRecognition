import { StyleSheet, Text, View } from "react-native";
import React from "react";

const Result = () => {
  return (
    <View style={styles.container}>
      <Text style={{ fontWeight: "bold", fontSize: 33,color:'white' }}>Emotion:</Text>
      <View style={styles.container2}>
        <Text style={{color:'white', fontWeight:'bold', fontSize:40}}>Happy</Text>
      </View>
    </View>
  );
};

export default Result;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "darkcyan",
  },
  container2: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#663399",
    height: 300,
    width: 300,
    margin: 10,
    borderRadius: 23,
    borderWidth:3,
    borderColor:'white',
  },
});
