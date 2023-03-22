import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Audio } from "expo-av";
import { MaterialIcons } from "@expo/vector-icons";

export default function AudioScreen() {
  const [recording, setRecording] = React.useState();
  const [recordings, setRecordings] = React.useState([]);
  const [message, setMessage] = React.useState("");
  const [PlayIcon, setPlayIcon] = React.useState(true);
  
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

    let updatedRecordings = [recordings];
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
    return recordings.map((recordingLine,index) => {
      return (
        <View key={index} style={styles.row}>
          <Text style={styles.fill}>
            Recording {index} - {recordingLine.duration}
          </Text>
          <TouchableOpacity 
            style={styles.button}
            onPress={() => {
              setPlayIcon(!PlayIcon);
              if(PlayIcon){
                recordingLine.sound.playAsync();
                
              }
              else{
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
            <Text style={styles.btnText}>Detect</Text>
          </TouchableOpacity>
        </View>
      );
    }
);
  }

  return (
    <View style={{flex:1,}}>
    <View style={styles.container}>
      <Text>{message}</Text>
      <TouchableOpacity
        style={styles.VoiceIcon2}
      >
       <Text style={styles.btnText1}>Select File</Text>
       <MaterialIcons name="attach-file" size={34} color="white" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.button1}>
            <Text style={styles.btnText}>Detect</Text>
          </TouchableOpacity>

      
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
  },
  fill: {
    flex: 1,
    margin: 16,
  },
  button: {
    margin: 10,
    
  },
  button1: {
    padding:10,
    margin: 10,
    backgroundColor:'blue',
    borderRadius:8,
  },
  btnText1:{color:'white', alignSelf:'center', fontWeight:'bold', fontSize:26, marginRight:12},
  btnText:{color:'white', alignSelf:'center', fontWeight:'bold', fontSize:16,},
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
    width:200,
    backgroundColor:'green',
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center',
  },
});
