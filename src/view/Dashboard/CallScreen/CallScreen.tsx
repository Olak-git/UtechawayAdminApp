import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { CommonActions } from '@react-navigation/native'
import { useSelector } from 'react-redux';
import Base from '../../../components/Base';
import Audio from './components/Audio';
import Video from './components/Video';

interface CallScreenProps {
    navigation: any
    route: any
}
const CallScreen: React.FC<CallScreenProps> = ({navigation, route}) => {

    const { type, action } = route.params;

    const admin = useSelector((state: any) => state.admin.data);

    const [mode, setMode] = useState<string>(type);

    const signIn = () => {
        navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [
                    {name: 'Auth'}
                ]
            })
        )
    }

    useEffect(() => {
        if(Object.keys(admin).length === 0) {
            signIn();
        }
    }, [admin])

    return (
        <Base>
            {mode == 'audio'
            ? <Audio navigation={navigation} action={action} setMode={setMode} />
            : <Video navigation={navigation} action={action} setMode={setMode} />
            }
        </Base>
    )
}

export default CallScreen