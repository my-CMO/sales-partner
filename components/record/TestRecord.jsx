import { Text, TouchableOpacity, View, Button, StyleSheet, Alert} from 'react-native';
import React, { useState, useEffect } from 'react';
import { Audio } from 'expo-av';
import { FontAwesome } from '@expo/vector-icons';
import { uploadRecording } from '../../services/privateAPI';

export default function TestRecord() {
  // States
  const [recording, setRecording] = useState(null);
  const [participantNum, setParticipantNum] = useState(1)
  const [recordingStatus, setRecordingStatus] = useState('none');
  const [audioPermission, setAudioPermission] = useState(null);
  // Test Audio Sample
  const testURI = '/Users/imgyuseong/Downloads/sales-partner-sample-meeting-data.mp4'
  // 최초 렌더링 시에 마이크 권한 요청
  useEffect(() => {
    const getPermission = async() => {
      await Audio.requestPermissionsAsync().then((permission) => {
        console.log('Permission Granted: ' + permission.granted);
        setAudioPermission(permission.granted)
      }).catch(error => {
        console.log(error);
      });
    }
    // 마이크 권한 요청 호출
    getPermission()
    // Cleanup
    return () => {
      if (recording){ stopRecording();}
    };
  }, []);

  // Alert
  const SubmitAlert = () => 
    Alert.alert(
      '녹음 파일을 업로드', 
      '파일 업로드를 진행하시겠습니까?', 
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        { 
          text: 'OK', 
          onPress: () => handleUpload(testURI, participantNum) 
        },
      ]
    );

    const successAlert = () => 
      Alert.alert(
        '파일을 업로드', 
        '파일 업로드를 성공했습니다', 
        [
          { text: 'OK' },
        ]
      );
    
    const failAlert = () => 
      Alert.alert(
        '파일을 업로드', 
        '파일 업로드를 실패했습니다', 
        [
          { text: 'OK' },
        ]
      );

  const handleUpload = async (fileURI, participantNum) =>{
    const filetype = fileURI.split(".").pop();
    const filename = fileURI.split("/").pop();
    
    const fd = new FormData();
    fd.append("audio_file", {
      uri: fileURI,
      type: filetype,
      name: filename
    });
    fd.append("participant_count", participantNum)
    
    try {
      const res = await uploadRecording(fd);
      if (res) {
        successAlert();
      } else {
        failAlert();
      }
    } catch (error) {
      console.error('Upload failed', error);
      failAlert();
    }
  }

  const startRecording = async() => {
    try {
      // needed for IoS
      if (audioPermission) {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true
        })
      }
      
      const newRecording = new Audio.Recording();
      console.log('Starting Recording')
      await newRecording.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
      await newRecording.startAsync();
      setRecording(newRecording);
      setRecordingStatus('recording');

    } catch (error) {
      console.error('Failed to start recording', error);
    }
  }

  const stopRecording = async() =>{
    try {
      if (recordingStatus === 'recording') {
        console.log('Stopping Recording')
        await recording.stopAndUnloadAsync();
        
        setRecording(null);
        setRecordingStatus('stopped');
      }
    } catch (error) {
      console.error('Failed to stop recording', error);
    }
  }
  
  const handleRecordButtonPress = async() => {
    if (recording) {
      const audioUri = await stopRecording(recording);
      if (audioUri) {
        console.log('Saved audio file to', savedUri);
      }
    } else {
      await startRecording();
    }
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={handleRecordButtonPress}>
        <FontAwesome name={recording ? 'stop-circle' : 'circle'} size={64} color="white" />
      </TouchableOpacity>
      <Text style={styles.recordingStatusText}>{`status: ${recordingStatus}`}</Text>

      <Text style={{marginTop: 12, fontSize: 24, fontWeight: '700'}}>회의 참여자 수</Text>
      <View style={styles.numContainer}>
        <TouchableOpacity onPress={()=>{setParticipantNum(participantNum+1)}}>
          <FontAwesome name='plus' size={12} color="black" />
        </TouchableOpacity>
        <Text>{participantNum}</Text>
        <TouchableOpacity onPress={()=>{setParticipantNum(participantNum-1)}}>
        <FontAwesome name='minus' size={12} color="black" />
        </TouchableOpacity>
      </View>

      <View style={styles.submitContainer}>
      <View style={styles.submitButton}>
        <Button
          color="#fff"
          title="업로드"
          onPress={SubmitAlert}
        />
      </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 128,
    height: 128,
    borderRadius: 64,
    backgroundColor: 'red',
  },
  recordingStatusText: {
    marginTop: 19,
    fontSize: 18,
  },
  numContainer: {
    display:'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  submitContainer: {
    marginTop: 10
  },
  submitButton: {
    paddingHorizontal: 12,
    backgroundColor:'#355fdc',
    borderRadius: 12,
  }
});