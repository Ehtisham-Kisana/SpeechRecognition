import { StatusBar } from "expo-status-bar";
import React from "react";
import { Button, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Audio } from "expo-av";
import * as Sharing from "expo-sharing";
import { MaterialIcons } from "@expo/vector-icons";

export default function App() {
  const [recording, setRecording] = React.useState();
  const [recordings, setRecordings] = React.useState([]);
  const [message, setMessage] = React.useState("");

  async function startRecording() {
    try {
      const permission = await Audio.requestPermissionsAsync();

      if (permission.status === "granted") {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });

        const { recording } = await Audio.Recording.createAsync(
          Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
        );

        setRecording(recording);
      } else {
        setMessage("Please grant permission to app to access microphone");
      }
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  }

  async function stopRecording() {
    setRecording(undefined);
    await recording.stopAndUnloadAsync();

    let updatedRecordings = [...recordings];
    const { sound, status } = await recording.createNewLoadedSoundAsync();
    updatedRecordings.push({
      sound: sound,
      duration: getDurationFormatted(status.durationMillis),
      file: recording.getURI(),
    });

    setRecordings(updatedRecordings);
  }

  function getDurationFormatted(millis) {
    const minutes = millis / 1000 / 60;
    const minutesDisplay = Math.floor(minutes);
    const seconds = Math.round((minutes - minutesDisplay) * 60);
    const secondsDisplay = seconds < 10 ? `0${seconds}` : seconds;
    return `${minutesDisplay}:${secondsDisplay}`;
  }

  function getRecordingLines() {
    return recordings.map((recordingLine, index) => {
      return (
        <View key={index} style={styles.row}>
          <Text style={styles.fill}>
            Recording {index + 1} - {recordingLine.duration}
          </Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => recordingLine.sound.replayAsync()}
          
          >
            <MaterialIcons
              name={recording ? "pause" : "play-arrow"}
              size={34}
              color={recording ? "black" : "black"}
              
            />
          </TouchableOpacity>
          <Button
            style={styles.button}
            onPress={() => recordingLine.sound.replayAsync()}
            title="Play"
          ></Button>
          <Button
            style={styles.button}
            onPress={() => Sharing.shareAsync(recordingLine.file)}
            title="Share"
          ></Button>
        </View>
      );
    });
  }

  return (
    <View style={styles.container}>
      <Text>{message}</Text>
      <TouchableOpacity
        style={styles.VoiceIcon}
        onPress={recording ? stopRecording : startRecording}
      >
        <MaterialIcons
          name={recording ? "record-voice-over" : "keyboard-voice"}
          size={recording ? 75 : 44}
          color={recording ? "black" : "black"}
        />
      </TouchableOpacity>

      {getRecordingLines()}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  fill: {
    flex: 1,
    margin: 16,
  },
  button: {
    margin: 16,
  },
  VoiceIcon: {
    margin: 16,
    borderColor: "black",
    borderWidth: 3,
    borderRadius: 60,
    padding: 10,
  },
});
