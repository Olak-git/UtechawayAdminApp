import { View, Text, SafeAreaView, TextInput, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { CodeColor } from '../../../../assets/style';
import { DashboardHeaderSimple } from '../../../../components/DashboardHeaderSimple';
import tw from 'twrnc';
import { fetchUri } from '../../../../functions/functions';
import { ModalValidationForm } from '../../../../components/ModalValidationForm';

const JoinButton: React.FC<{value: any, onPress: any}> = ({ value, onPress }) => {
    return (
      <TouchableOpacity
        style={{
          backgroundColor: CodeColor.code1,
          padding: 12,
          marginVertical: 8,
          borderRadius: 6,
        }}
        onPress={onPress}
      >
        <Text style={{ color: "white", alignSelf: "center", fontSize: 18 }}>
          {value}
        </Text>
      </TouchableOpacity>
    );
}

// Responsible for either schedule new meeting or to join existing meeting as a host or as a viewer.
interface JoinScreenProps {
    getMeetingAndToken: any, 
    setMode: any,
    navigation: any,
    user: object|null,
    account: string|null,
}
const JoinScreen: React.FC<JoinScreenProps> = ({ getMeetingAndToken, setMode, navigation, user, account }) => {
    const admin = useSelector((state: any) => state.admin.data)

    const [meetingVal, setMeetingVal] = useState("");

    const [visible, setVisible] = useState(false)

    const meetToken = () => {
        setVisible(true)
        console.log('User: ', user)

        const formData = new FormData()
        formData.append('js', null)
        formData.append('meet_token', null);
        formData.append('token', admin.email)
        // @ts-ignore
        formData.append('user_slug', user.slug)
        formData.append('account', account)

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
            if(json.success) {
                console.log('Meeting: ', json.meeting)
                setMeetingVal(json.meeting.meeting_key)
            } else {
                console.warn(json.errors)
            }
            setVisible(false)
        })
        .catch(e => {
            setVisible(false)
            console.log('Error: ', e)
        })
    }

    useEffect(() => {
        if(user) {
            meetToken()
        }
    }, [user, account])

    useEffect(() => {
        console.log('MeetingVal: ', meetingVal)
    }, [meetingVal])
    
    return (
        <SafeAreaView
            style={{
                flex: 1,
                backgroundColor: "black",
                // justifyContent: "center",
                // paddingHorizontal: 6 * 10,
            }}
        >
            <ModalValidationForm showM={visible} />

            <DashboardHeaderSimple navigation={navigation} title={''} fontSize={'text-xl'} />

            <View style={tw`flex-1 justify-center px-10`}>
                
                <TextInput
                    value={meetingVal}
                    onChangeText={setMeetingVal}
                    placeholder={"XXXX-XXXX-XXXX"}
                    placeholderTextColor={"grey"}
                    style={{
                        padding: 12,
                        borderWidth: 1,
                        borderColor: "white",
                        borderRadius: 6,
                        color: "white",
                        marginBottom: 16,
                    }}
                />
                <JoinButton
                    onPress={() => {
                        getMeetingAndToken(meetingVal);
                    }}
                    value={"Join as Host"}
                />
                {/* <JoinButton
                    onPress={() => {
                        setMode("VIEWER");
                        getMeetingAndToken(meetingVal);
                    }}
                    value={"Join as Viewer"}
                /> */}
                <Text
                    style={{
                        alignSelf: "center",
                        fontSize: 22,
                        marginVertical: 16,
                        fontStyle: "italic",
                        color: "grey",
                    }}
                >
                ---------- OR ----------
                </Text>
        
                <JoinButton
                    onPress={() => {
                        getMeetingAndToken();
                    }}
                    value={"Create Studio Room"}
                />
            </View>
        </SafeAreaView>
    );
}

export default JoinScreen