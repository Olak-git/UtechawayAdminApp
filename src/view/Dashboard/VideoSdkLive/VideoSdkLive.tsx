import { Clipboard, FlatList, SafeAreaView, StyleSheet, Text, Alert, TextInput, TouchableOpacity, View, Pressable, ScrollView } from 'react-native'
import React, { useEffect, useMemo, useState } from 'react'

import {
    MeetingProvider,
    useMeeting,
    useParticipant,
    MediaStream,
    RTCView,
    Constants,
  } from "@videosdk.live/react-native-sdk";
  import { createMeeting } from "../../../components/ApiVideoSdkLive";
import Video from '../CallScreen/components/Video';

import { useDispatch, useSelector } from 'react-redux';
import { CodeColor } from '../../../assets/style';
import tw from 'twrnc';
import { Icon } from '@rneui/base';
import { SwipeablePanel } from 'rn-swipeable-panel';
import { DashboardHeaderSimple } from '../../../components/DashboardHeaderSimple';
import { fetchUri, toast } from '../../../functions/functions';
import { ModalValidationForm } from '../../../components/ModalValidationForm';
import Base from '../../../components/Base';

import Container from './components/Container';
import JoinScreen from './components/JoinScreen';

const useSwipeablePanel = () => {
    const [panelProps, setPanelProps] = useState({
        fullWidth: true,
        openLarge: true,
        showCloseButton: true,
        onClose: () => closePanel(),
        onPressCloseButton: () => closePanel(),
        // ...or any prop you want
    });
    const [isPanelActive, setIsPanelActive] = useState(true);

    const openPanel = () => {
        setIsPanelActive(true);
    };
    const closePanel = () => {
        setIsPanelActive(false);
    };

    return {panelProps, isPanelActive};
}

// // Common Component which will also be used in Controls Component
// const Button: React.FC<{onPress: any, buttonText: string, backgroundColor: string, btnStyle: any}> = ({ onPress, buttonText, backgroundColor, btnStyle }) => {
//     return (
//         <TouchableOpacity
//             onPress={onPress}
//             style={{
//                 ...btnStyle,
//                 backgroundColor: backgroundColor,
//                 padding: 10,
//                 borderRadius: 8,
//             }}
//         >
//             <Text style={{ color: "white", fontSize: 12 }}>{buttonText}</Text>
//         </TouchableOpacity>
//     );
// };

// const JoinButton: React.FC<{value: any, onPress: any}> = ({ value, onPress }) => {
//     return (
//       <TouchableOpacity
//         style={{
//           backgroundColor: CodeColor.code1,
//           padding: 12,
//           marginVertical: 8,
//           borderRadius: 6,
//         }}
//         onPress={onPress}
//       >
//         <Text style={{ color: "white", alignSelf: "center", fontSize: 18 }}>
//           {value}
//         </Text>
//       </TouchableOpacity>
//     );
// }

// // Responsible for either schedule new meeting or to join existing meeting as a host or as a viewer.
// interface JoinScreenProps {
//     getMeetingAndToken: any, 
//     setMode: any,
//     navigation: any,
//     user: object|null,
//     account: string|null,
// }
// const JoinScreen: React.FC<JoinScreenProps> = ({ getMeetingAndToken, setMode, navigation, user, account }) => {
//     const admin = useSelector((state: any) => state.admin.data)

//     const [meetingVal, setMeetingVal] = useState("");

//     const [visible, setVisible] = useState(false)

//     const meetToken = () => {
//         setVisible(true)
//         console.log('User: ', user)

//         const formData = new FormData()
//         formData.append('js', null)
//         formData.append('meet_token', null);
//         formData.append('token', admin.email)
//         // @ts-ignore
//         formData.append('user_slug', user.slug)
//         formData.append('account', account)

//         fetch(fetchUri, {
//             method: 'POST',
//             body: formData
//         })
//         .then(response => {
//             if(response.ok) {
//                 return response.json()
//             }
//             throw new Error(response.statusText);
//             console.log('Response: ', response)
//         })
//         .then(async json => {
//             if(json.success) {
//                 console.log('Meeting: ', json.meeting)
//                 setMeetingVal(json.meeting.meeting_key)
//             } else {
//                 console.warn(json.errors)
//             }
//             setVisible(false)
//         })
//         .catch(e => {
//             setVisible(false)
//             console.log('Error: ', e)
//         })
//     }

//     useEffect(() => {
//         if(user) {
//             meetToken()
//         }
//     }, [user, account])

//     useEffect(() => {
//         console.log('MeetingVal: ', meetingVal)
//     }, [meetingVal])
    
//     return (
//         <SafeAreaView
//             style={{
//                 flex: 1,
//                 backgroundColor: "black",
//                 // justifyContent: "center",
//                 // paddingHorizontal: 6 * 10,
//             }}
//         >
//             <ModalValidationForm showM={visible} />

//             <DashboardHeaderSimple navigation={navigation} title={''} fontSize={'text-xl'} />

//             <View style={tw`flex-1 justify-center px-10`}>
                
//                 <TextInput
//                     value={meetingVal}
//                     onChangeText={setMeetingVal}
//                     placeholder={"XXXX-XXXX-XXXX"}
//                     placeholderTextColor={"grey"}
//                     style={{
//                         padding: 12,
//                         borderWidth: 1,
//                         borderColor: "white",
//                         borderRadius: 6,
//                         color: "white",
//                         marginBottom: 16,
//                     }}
//                 />
//                 <JoinButton
//                     onPress={() => {
//                         getMeetingAndToken(meetingVal);
//                     }}
//                     value={"Join as Host"}
//                 />
//                 <JoinButton
//                     onPress={() => {
//                         setMode("VIEWER");
//                         getMeetingAndToken(meetingVal);
//                     }}
//                     value={"Join as Viewer"}
//                 />
//                 <Text
//                     style={{
//                         alignSelf: "center",
//                         fontSize: 22,
//                         marginVertical: 16,
//                         fontStyle: "italic",
//                         color: "grey",
//                     }}
//                 >
//                 ---------- OR ----------
//                 </Text>
        
//                 <JoinButton
//                     onPress={() => {
//                         getMeetingAndToken();
//                     }}
//                     value={"Create Studio Room"}
//                 />
//             </View>
//         </SafeAreaView>
//     );
// }
  
// // Responsible for managing participant video stream
// const ParticipantView: React.FC<{participantId: any}> = ({ participantId }) => {
//     const { webcamStream, webcamOn } = useParticipant(participantId);

//     return webcamOn && webcamStream ? (
//         <RTCView
//             streamURL={new MediaStream([webcamStream.track]).toURL()}
//             objectFit={"cover"}
//             style={{
//                 height: 300,
//                 marginVertical: 8,
//                 marginHorizontal: 8,
//             }}
//         />
//     ) : (
//         <View
//             style={{
//                 backgroundColor: "grey",
//                 height: 300,
//                 justifyContent: "center",
//                 alignItems: "center",
//                 marginVertical: 8,
//                 marginHorizontal: 8,
//             }}
//         >
//             <Text style={{ fontSize: 16 }}>NO MEDIA</Text>
//         </View>
//     );
// }
  
//   // Responsible for managing meeting controls such as toggle mic / webcam and leave
// const Controls = () => {
//     const {end, stopRecording, stopVideo, toggleScreenShare, localScreenShareOn, toggleWebcam, changeWebcam, localWebcamOn, toggleMic, localMicOn, startHls, stopHls, hlsState } = useMeeting({});
  
//     const _handleHLS = async () => {
//         if (!hlsState || hlsState === "HLS_STOPPED") {
//             // @ts-ignore
//             startHls({
//                 layout: {
//                     type: "GRID",
//                     priority: "PIN",
//                     gridSize: 4,
//                 },
//                 theme: "DARK",
//                 orientation: "portrait",
//             });
//         } else if (hlsState === "HLS_STARTED" || hlsState === "HLS_PLAYABLE") {
//             stopHls();
//         }
//     };

//     const onHandleShareScreen = async () => {
//         await toggleScreenShare();
//         const lcs = await localScreenShareOn
//         if(lcs) {
//             toast('SUCCESS', 'Partage d\'écran activé')
//         } else {
//             toast('SUCCESS', 'Partage d\'écran désactivé')
//         }
//     }

//     useEffect(() => {
//         stopRecording()
//         // stopHls()
//         stopVideo()
//         console.log('localMicOn: ', localMicOn)
//         console.log('localWebcamOn: ', localWebcamOn)
//         console.log('localScreenShareOn: ', localScreenShareOn)
//         console.log('----------------------------------------------------------------------------------')
//     }, [localMicOn, localWebcamOn, localScreenShareOn])
  
//     return (
//         <View
//             style={{
//                 padding: 24,
//                 flexDirection: "row",
//                 justifyContent: "space-between",
//             }}
//         >
            
//             <Icon 
//                 type='ionicon' 
//                 name='camera-reverse-sharp' 
//                 color={'#FFF'} 
//                 // @ts-ignore
//                 onPress={changeWebcam} 
//                 reverse 
//                 reverseColor={CodeColor.code1} 
//             />
            
//             {/* @ts-ignore */}
//             <Icon 
//                 type='material-icon' 
//                 name={localWebcamOn?'videocam':'videocam-off'} 
//                 color={'#FFF'} 
//                 // @ts-ignore
//                 onPress={toggleWebcam} 
//                 reverse 
//                 reverseColor={CodeColor.code1} 
//             />
            
//             <Icon 
//                 type='font-awesome-5' 
//                 name={localMicOn?'microphone':'microphone-slash'} 
//                 color={'#FFF'} 
//                 // @ts-ignore
//                 onPress={toggleMic} 
//                 reverse 
//                 reverseColor={CodeColor.code1} 
//             />

//             <Icon 
//                 type={localScreenShareOn?'material-icon':'font-awesome-5' }
//                 name={localScreenShareOn?'stop-screen-share':'share-alt'} 
//                 color={'#FFF'} 
//                 // @ts-ignore
//                 onPress={onHandleShareScreen} 
//                 reverse 
//                 reverseColor={CodeColor.code1} 
//             />

//             {hlsState === "HLS_STARTED" ||
//             hlsState === "HLS_STOPPING" ||
//             hlsState === "HLS_STARTING" ||
//             hlsState === "HLS_PLAYABLE" ? (
//                 <Icon 
//                     type='ionicon' 
//                     name={hlsState === "HLS_STARTED" ? 
//                             `pause` : hlsState === "HLS_STOPPING" ? 
//                                 `alert` : hlsState === "HLS_PLAYABLE" ? 
//                                     `stop` : `play`} 
//                     color={'#FFF'} 
//                     // @ts-ignore
//                     onPress={() => {
//                         _handleHLS();
//                     }}
//                     reverse 
//                     reverseColor={CodeColor.code1} 
//                 />
//                 // <Button
//                 //     onPress={() => {
//                 //         _handleHLS();
//                 //     }}
//                 //     buttonText={
//                 //     hlsState === "HLS_STARTED"
//                 //         ? `Live Starting`
//                 //         : hlsState === "HLS_STOPPING"
//                 //         ? `Live Stopping`
//                 //         : hlsState === "HLS_PLAYABLE"
//                 //         ? `Stop Live`
//                 //         : `Go Live`
//                 //     }
//                 //     backgroundColor={"#FF5D5D"}
//                 //     btnStyle={undefined}
//                 // />
//             ) : (
//                 <Icon 
//                     type='ionicon' 
//                     name='play' 
//                     color={'#FFF'} 
//                     // @ts-ignore
//                     onPress={() => {
//                         _handleHLS();
//                     }}
//                     reverse 
//                     reverseColor={CodeColor.code1} 
//                 />
//                 // <Button
//                 //     onPress={() => {
//                 //         _handleHLS();
//                 //     }}
//                 //     buttonText={`Go Live`}
//                 //     backgroundColor={"#1178F8"}
//                 //     btnStyle={undefined}
//                 // />
//             )}

//         </View>
//     );
// }
  
//   // Responsible for Speaker side view, which contains Meeting Controls(toggle mic/webcam & leave) and Participant list
// const SpeakerView = () => {
//     // Get the Participant Map and meetingId
//     const { meetingId, participants } = useMeeting({});
  
//     // For getting speaker participant, we will filter out `CONFERENCE` mode participant
//     const speakers = useMemo(() => {
//         const speakerParticipants = [...participants.values()].filter(
//             (participant) => {
//                 return participant.mode == Constants.modes.CONFERENCE;
//             }
//         );
//         return speakerParticipants;
//     }, [participants]);
  
//     return (
//         <SafeAreaView style={{ backgroundColor: "black", flex: 1 }}>
//             {/* Render Header for copy meetingId and leave meeting*/}
//             <HeaderView />
    
//             {/* Render Participant List */}
//             {speakers.length > 0 ? (
//                 <FlatList
//                     data={speakers}
//                     renderItem={({ item }) => {
//                         return <ParticipantView participantId={item.id} />;
//                     }}
//                 />
//             ) : null}
    
//             {/* Render Controls */}
//             <Controls />
//         </SafeAreaView>
//     );
// }
  
// const HeaderView = () => {
//     const { meetingId, leave } = useMeeting();
//     return (
//         <View
//             style={{
//                 flexDirection: "row",
//                 marginTop: 12,
//                 justifyContent: "space-evenly",
//                 alignItems: "center",
//             }}
//         >
//             <Text style={{ fontSize: 24, color: "white" }}>{meetingId}</Text>
//             <Button
//                 btnStyle={{
//                     borderWidth: 1,
//                     borderColor: "white",
//                 }}
//                 onPress={() => {
//                     Clipboard.setString(meetingId);
//                     Alert.alert("MeetingId copied successfully");
//                 }}
//                 buttonText={"Copy MeetingId"}
//                 backgroundColor={"transparent"}
//             />
//             <Button
//                 onPress={leave}
//                 buttonText={"Leave"}
//                 backgroundColor={"#FF0000"}
//                 btnStyle={undefined}
//             />
//         </View>
//     );
// }
  
// // Responsible for Viewer side view, which contains video player for streaming HLS and managing HLS state (HLS_STARTED, HLS_STOPPING, HLS_STARTING, etc.)
// const ViewerView = ({}) => {
//     const { hlsState, hlsUrls } = useMeeting();
  
//     return (
//         <SafeAreaView style={{ flex: 1, backgroundColor: "black" }}>
//             {hlsState == "HLS_PLAYABLE" ? (
//             <>
//                 {/* Render Header for copy meetingId and leave meeting*/}
//                 <HeaderView />
    
//                 {/* Render VideoPlayer that will play `downstreamUrl`*/}
//                 <Video
//                     controls={true}
//                     source={{
//                         uri: hlsUrls.downstreamUrl,
//                     }}
//                     resizeMode={"stretch"}
//                     style={{
//                         flex: 1,
//                         backgroundColor: "black",
//                     }}
//                     onError={(e: any) => console.log("error", e)}
//                 />
//             </>
//             ) : (
//                 <SafeAreaView
//                     style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
//                 >
//                     <Text style={{ fontSize: 20, color: "white" }}>
//                     HLS is not started yet or is stopped
//                     </Text>
//                 </SafeAreaView>
//             )}
//         </SafeAreaView>
//     );
// }
  
// // Responsible for managing two view (Speaker & Viewer) based on provided mode (`CONFERENCE` & `VIEWER`)
// const Container: React.FC<{navigation: any, setMeetingId: (a: any) => void}> = ({ navigation, setMeetingId }) => {
//     const { join, changeWebcam, localParticipant } = useMeeting({
//         onError: (error) => {
//             console.log(error.message);
//         },
//     });
  
//     return (
//         <View style={{ flex: 1 }}>
//             {localParticipant?.mode == Constants.modes.CONFERENCE ? (
//                 <SpeakerView />
//             ) : localParticipant?.mode == Constants.modes.VIEWER ? (
//                 <ViewerView />
//             ) : (
//                 <View
//                     style={{
//                         flex: 1,
//                         // justifyContent: "center",
//                         // alignItems: "center",
//                         backgroundColor: "black",
//                     }}
//                 >
//                     <DashboardHeaderSimple onPress={() => setMeetingId(null)} title={''} fontSize={'text-xl'} />

//                     <View style={tw`flex-1 justify-center items-center px-10`}>
//                         <Text style={{ fontSize: 20, color: "white" }}>Press Join button to enter studio.</Text>
//                         <Button
//                             btnStyle={{
//                                 marginTop: 8,
//                                 paddingHorizontal: 22,
//                                 padding: 12,
//                                 borderWidth: 1,
//                                 borderColor: "white",
//                                 borderRadius: 8,
//                             }}
//                             buttonText={"Join"}
//                             onPress={() => {
//                                 join();
//                                 setTimeout(() => {
//                                     changeWebcam();
//                                 }, 300);
//                             }}
//                         />
//                     </View>
//                 </View>
//             )}
//         </View>
//     );
// }

interface VideoSdkLiveProps {
    navigation: any,
    route: any
}
const VideoSdkLive: React.FC<VideoSdkLiveProps> = ({ navigation, route }) => {

    const { user, account } = route.params;

    const admin = useSelector((state: any) => state.admin.data)

    const authToken = useSelector((state: any) => state.videosdk.token)

    const [meetingId, setMeetingId] = useState(null);

    const [visible, setVisible] = useState(false);

    const {panelProps, isPanelActive} = useSwipeablePanel()

    //State to handle the mode of the participant i.e. CONFERNCE or VIEWER
    const [mode, setMode] = useState("CONFERENCE");
  
    //Getting MeetingId from the API we created earlier
    const getMeetingAndToken = async (id: any) => {
        // console.log('authToken: ', authToken)
        const meetingId = id == null ? await createMeeting({ token: authToken }) : id;
        setMeetingId(meetingId);
        if(meetingId && user) saveMeetingKey(meetingId);
    };

    const saveMeetingKey = (key: string) => {
        setVisible(true);
        const formData = new FormData()
        formData.append('js', null)
        formData.append('meeting_key', key);
        formData.append('user_slug', user.slug);
        formData.append('account', account);
        formData.append('token', admin.email)
        fetch(fetchUri, {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if(response.ok) {
                return response.json()
            }
            throw new Error(response.statusText);
            console.log('Response: ', response)
        })
        .then(async json => {
            setVisible(false);
            if(json.success) {

            } else {
                console.warn(json.errors)
            }
        })
        .catch(e => {
            setVisible(false);
            console.log('Error: ', e)
        })
    }

    useEffect(() => {
        toast('SUCCESS', 'Alo Moto')
    }, [])
  
    return (
        <>
            <ModalValidationForm showM={visible} />
            {authToken && meetingId ? (
                <MeetingProvider
                    config={{
                        meetingId,
                        micEnabled: true,
                        webcamEnabled: true,
                        name: "Ahmed",
                        //These will be the mode of the participant CONFERENCE or VIEWER
                        // @ts-ignore
                        mode: mode,
                    }}
                    token={authToken}
                >
                    <Container navigation={navigation} setMeetingId={setMeetingId} />
                </MeetingProvider>
            ) : (
                <JoinScreen getMeetingAndToken={getMeetingAndToken} setMode={setMode} navigation={navigation} user={user} account={account} />
            )}

            {/* {!user && (
                <SwipeablePanel
                    {...panelProps}
                    smallPanelHeight={100}
                    // onlySmall
                    onlyLarge
                    isActive={isPanelActive}
                    style={[tw``, { height: 100 }]}
                    // openLarge
                    showCloseButton={false}
                    scrollViewProps={{
                        scrollEnabled: false
                    }}
                >
                    <View style={tw`flex-row justify-around`}>
                        <Text>Alo</Text>
                    </View>
                </SwipeablePanel>
            )} */}
        </>
    )
}

export default VideoSdkLive

const styles = StyleSheet.create({})