import * as React from 'react';
import { Text, View, StyleSheet, Button } from 'react-native';
import { Audio } from 'expo-av';

export default function RecordScreen() {
  const [recording, setRecording] = React.useState((null));

  //녹음 시작
  async function startRecording() {
    try {
      console.log('Requesting permissions..');
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      console.log('Starting recording..');
      const { recording } = await Audio.Recording.createAsync( Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
      console.log('Recording started');
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  }

  //녹음 종료
  async function stopRecording() {
    console.log('Stopping recording..');
    // setRecording(undefined);
    await recording.stopAndUnloadAsync();
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
    });
    const uri = recording.getURI();
    console.log('Recording stopped and stored at', uri);
  }

  const playAudio = async () => {
    if(recording){
      const sound = new Audio.Sound();
      await sound.loadAsync({ uri:  recording.getURI()});
      console.log('Playing Sound');
      await sound.replayAsync();

    }
}
  return (
    <View style={styles.container}>
      <Button
        title={recording ? 'Stop Recording' : 'Start Recording'}
        onPress={recording ? stopRecording : startRecording}

      />
      {(
        <Button onPress={playAudio} title={recording ? 'play' : ''}></Button>
      )}
    </View>
  );
}

const styles = StyleSheet.create({  })