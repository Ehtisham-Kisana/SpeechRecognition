import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Text, View, TouchableOpacity, Button } from "react-native";
import { Audio } from "expo-av";
import { MaterialIcons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";

export default function AudioScreen({ navigation }) {
  const [recording, setRecording] = React.useState();
  const [recordings, setRecordings] = React.useState([]);
  const [message, setMessage] = React.useState("");
  const [PlayIcon, setPlayIcon] = React.useState(true);
  const [audio, setAudio] = React.useState(null);
  const [selected, setSelected] = React.useState(false);

  const pickAudio = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "audio/*",
      });

      if (result.type === "success") {
        const { uri } = result;

        const { sound } = await Audio.Sound.createAsync({ uri });
        setAudio(sound);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const playAudio = async () => {
    try {
      await audio.playAsync();
    } catch (err) {
      console.log(err);
    }
  };
  const StopAudio = async () => {
    try {
      await audio.pauseAsync();
    } catch (err) {
      console.log(err);
    }
  };

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

    let updatedRecordings = [];
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
          <View style={{ flexDirection: "column", padding: 3 }}>
            <Text style={{ fontWeight: "bold", fontSize: 18, width: "63%" }}>
              Recording {index}.00 - {recordingLine.duration}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              setPlayIcon(!PlayIcon);
              if (PlayIcon) {
                recordingLine.sound.replayAsync();
              } else {
                recordingLine.sound.pauseAsync();
              }
            }}
          >
            <MaterialIcons
              name={PlayIcon ? "play-arrow" : "pause"}
              size={34}
              color={PlayIcon ? "black" : "black"}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button1}>
            <Text
              style={styles.btnText}
              onPress={() => {
                navigation.navigate("Result");
              }}
            >
              Detect
            </Text>
          </TouchableOpacity>
        </View>
      );
    });
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text>{message}</Text>
        <TouchableOpacity
          style={[
            styles.VoiceIcon2,
            { backgroundColor: audio ? "#5f9ea0" : "green" },
          ]}
          onPress={pickAudio}
        >
          {audio ? (
            <Text style={styles.btnText1}>Selected</Text>
          ) : (
            <Text style={styles.btnText1}>Select Audio </Text>
          )}

          <MaterialIcons name="attach-file" size={34} color="white" />
        </TouchableOpacity>
        {audio && (
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              borderColor: "grey",
              borderRadius: 9,
              borderWidth: 3,
            }}
          >
            <Text style={{ fontWeight: "bold", fontSize: 20, width: "53%",padding:10 }}>
              Audio
            </Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                setSelected(!selected);
                if (selected) {
                  playAudio();
                } else {
                  StopAudio();
                }
              }}
            >
              <MaterialIcons
                name={selected ? "play-arrow" : "pause"}
                size={34}
                color="black"
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button1}
              onPress={() => {
                navigation.navigate("Result");
                setAudio(null);
              }}
            >
              <Text style={styles.btnText}>Detect</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

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
    borderColor: "grey",
    borderRadius: 9,
    borderWidth: 3,
  },
  fill: {
    flex: 1,
    margin: 16,
  },
  button: {
    margin: 10,
  },
  button1: {
    padding: 10,
    margin: 10,
    backgroundColor: "blue",
    borderRadius: 8,
  },
  btnText1: {
    color: "white",
    alignSelf: "center",
    fontWeight: "bold",
    fontSize: 26,
    marginRight: 12,
  },
  btnText: {
    color: "white",
    alignSelf: "center",
    fontWeight: "bold",
    fontSize: 16,
  },
  VoiceIcon: {
    margin: 16,
    borderColor: "black",
    borderWidth: 3,
    borderRadius: 60,
    padding: 10,
  },
  VoiceIcon2: {
    margin: 16,
    borderRadius: 10,
    padding: 15,
    width: 220,
    backgroundColor: "green",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
});
