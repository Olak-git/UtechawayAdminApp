import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import Button from './Button';
import { useMeeting } from '@videosdk.live/react-native-sdk';
import { Icon } from '@rneui/base';
import { CodeColor } from '../../../../assets/style';
import { account, fetchUri, toast } from '../../../../functions/functions';
import { useSelector } from 'react-redux';

// Responsible for managing meeting controls such as toggle mic / webcam and leave
const Controls: React.FC<{ setBottomHeight?:(a:number)=>void }> = ({ setBottomHeight }) => {
    const { end, stopRecording, stopVideo, toggleScreenShare, localScreenShareOn, toggleWebcam, changeWebcam, localWebcamOn, toggleMic, localMicOn, startHls, stopHls, hlsState } = useMeeting({});

    const admin = useSelector((state: any) => state.admin.data)

    const [goLive, setGoLive] = useState(false)
  
    const _handleHLS = async () => {
        if (!hlsState || hlsState === "HLS_STOPPED") {
            // @ts-ignore
            startHls({
                layout: {
                    type: "GRID",
                    priority: "PIN",
                    gridSize: 4,
                },
                theme: "DARK",
                orientation: "portrait",
            });
        } else if (hlsState === "HLS_STARTED" || hlsState === "HLS_PLAYABLE") {
            stopHls();
        }
    };

    const onHandleShareScreen = async () => {
        await toggleScreenShare();
        const lcs = await localScreenShareOn
        if(lcs) {
            toast('SUCCESS', 'Partage d\'écran activé')
        } else {
            toast('SUCCESS', 'Partage d\'écran désactivé')
        }
    }

    const canGoLive = () => {
        const formData = new FormData()
        formData.append('js', null)
        formData.append('csrf', null)
        formData.append('token', admin.email)
        formData.append('go_live', null)
        fetch(fetchUri, {
            method: 'POST',
            body: formData,
            headers: {
                // 'Accept': 'application/json',
            }
        })
        .then(response => response.json())
        .then(async json => {
            if(json.success) {
                setGoLive(json.go_live)
            } else {
                const errors = json.errors
                console.log('Errors: ', errors);
            }
        })
        .catch(e => {
            console.warn(e)
        })
    }

    useEffect(() => {
        canGoLive()
    }, [])

    useEffect(() => {
        stopRecording()
        // stopHls()
        stopVideo()
        console.log('localMicOn: ', localMicOn)
        console.log('localWebcamOn: ', localWebcamOn)
        console.log('localScreenShareOn: ', localScreenShareOn)
        console.log('----------------------------------------------------------------------------------')
    }, [localMicOn, localWebcamOn, localScreenShareOn])
  
    return (
        <View
            onLayout={e => {
                // @ts-ignore
                setBottomHeight(e.nativeEvent.layout.height)
            }}
            style={{
                padding: 24,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: 'center'
                // backgroundColor: 'green'
            }}
        >
            <Icon 
                type='ionicon' 
                name='camera-reverse-sharp' 
                color={'#FFF'} 
                // @ts-ignore
                onPress={changeWebcam} 
                reverse 
                reverseColor={CodeColor.code1} 
            />

            {/* Toggle Webcam */}
            <Icon 
                type='material-icon' 
                name={localWebcamOn?'videocam':'videocam-off'} 
                color={'#FFF'} 
                // @ts-ignore
                onPress={toggleWebcam} 
                // reverse 
                reverseColor={CodeColor.code1}
            />

            {/* Toggle MIC */}
            <Icon 
                type='font-awesome-5' 
                name={localMicOn?'microphone':'microphone-slash'} 
                color={'#FFF'} 
                // @ts-ignore
                onPress={toggleMic} 
                // reverse={true}
                reverseColor={CodeColor.code1} 
            />

            <Icon 
                type={localScreenShareOn?'material-icon':'font-awesome-5' }
                name={localScreenShareOn?'stop-screen-share':'share-alt'} 
                color={'#FFF'} 
                // @ts-ignore
                onPress={onHandleShareScreen} 
                // reverse 
                reverseColor={CodeColor.code1} 
            />

            {goLive
            ?
                hlsState === "HLS_STARTED" ||
                hlsState === "HLS_STOPPING" ||
                hlsState === "HLS_STARTING" ||
                hlsState === "HLS_PLAYABLE" ? (
                    <Icon 
                        type='ionicon' 
                        name={hlsState === "HLS_STARTED" ? 
                                `pause` : hlsState === "HLS_STOPPING" ? 
                                    `alert` : hlsState === "HLS_PLAYABLE" ? 
                                        `stop` : `play`} 
                        color={'#FFF'} 
                        // @ts-ignore
                        onPress={() => {
                            _handleHLS();
                        }}
                        reverse 
                        reverseColor={CodeColor.code1} 
                    />
                    // <Button
                    //     onPress={() => {
                    //         _handleHLS();
                    //     }}
                    //     buttonText={
                    //     hlsState === "HLS_STARTED"
                    //         ? `Live Starting`
                    //         : hlsState === "HLS_STOPPING"
                    //         ? `Live Stopping`
                    //         : hlsState === "HLS_PLAYABLE"
                    //         ? `Stop Live`
                    //         : `Go Live`
                    //     }
                    //     backgroundColor={"#FF5D5D"}
                    //     btnStyle={undefined}
                    // />
                ) : (
                    <Icon 
                        type='ionicon' 
                        name='play' 
                        color={'#FFF'} 
                        // @ts-ignore
                        onPress={() => {
                            _handleHLS();
                        }}
                        reverse 
                        reverseColor={CodeColor.code1} 
                    />
                    // <Button
                    //     onPress={() => {
                    //         _handleHLS();
                    //     }}
                    //     buttonText={`Go Live`}
                    //     backgroundColor={"#1178F8"}
                    //     btnStyle={undefined}
                    // />
                )
            : null
            }
        </View>
    );
}

export default Controls