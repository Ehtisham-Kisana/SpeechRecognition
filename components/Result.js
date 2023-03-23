import { StyleSheet, Text, View } from "react-native";
import React from "react";

const Result = () => {
  return (
    <View style={styles.container}>
      <Text style={{ fontWeight: "bold", fontSize: 23 }}>Result:</Text>
      <View style={styles.container2}></View>
    </View>
  );
};

export default Result;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container2: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "grey",
    height: 400,
    width: 300,
    margin: 10,
    borderRadius: 23,
  },
});
