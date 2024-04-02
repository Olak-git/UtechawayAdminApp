import { CommonActions } from '@react-navigation/native';
import { Image } from '@rneui/themed/dist/Image';
import React, { useEffect } from 'react';
import { Keyboard, PixelRatio, Pressable, SafeAreaView, ScrollView, Text, View } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import tw from 'twrnc';
import Base from '../../components/Base';
import InputAuthForm from '../../components/InputAuthForm';
import { ModalValidationForm } from '../../components/ModalValidationForm';
import { deleteAdmin, setAdmin } from '../../feature/admin.slice';
import { setStopped, setWelcome } from '../../feature/init.slice';
import { setVideoSdkToken } from '../../feature/videosdk.authtoken.slice';
import { account, baseUri, fetchUri, windowWidth } from '../../functions/functions';
import { clone } from '../../functions/helperFunction';
import { CodeColor } from '../../assets/style';

interface AuthViewProps {
    navigation: any
}

const AuthView: React.FC<AuthViewProps> = ( props ) => {

    const { navigation } = props;

    const dispatch = useDispatch();

    const admin = useSelector((state: any) => state.admin.data);

    const [showModal, setShowModal] = React.useState(false)

    const [inputs, setInputs] = React.useState({
        email: '',
        password: ''
    })

    const [errors, setErrors] = React.useState({
        email: null,
        password: null
    })

    const handleOnChange = (text: any, input: string) => {
        setInputs(prevState => ({...prevState, [input]: text}))
    }

    const handleError = (text: any, input: string) => {
        setErrors(prevState => ({...prevState, [input]: text}))
    }

    const goDashboard = () => {
        navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [
                    {name: 'Home'}
                ]
            })
        )
    }

    const onSubmit = () => {
        Keyboard.dismiss()

        let valid = true
        if(!inputs.email) {
            valid = false
            handleError('Est requis', 'email')
        } else {
            handleError(null, 'email')
        }

        if(!inputs.password) {
            valid = false
            handleError('Est requis', 'password')
        } else {
            handleError(null, 'password')
        }

        if(!valid) {
            console.log(errors);
            console.error('Invalid Form')
        } else {
            setShowModal(true)
            const formData = new FormData()
            formData.append('js', null)
            formData.append('csrf', null)
            formData.append(`${account}_signin[email]`, inputs.email)
            formData.append(`${account}_signin[password]`, inputs.password)
            fetch(fetchUri, {
                method: 'POST',
                headers: {},
                body: formData
            })
            .then(response => response.json())
            .then(async json => {
                setShowModal(false)
                if(json.success) {
                    if(json.videosdk_auth_token) {
                        dispatch(setVideoSdkToken(json.videosdk_auth_token))
                    }
                    const admin = json.admin;
                    let image = admin.image;
                    const data = clone(admin);
                    if(data.image) {
                        data.image = `${baseUri}/assets/avatars/${image}`;
                    }
                    dispatch(setAdmin({...data}));
                    dispatch(setStopped(false));
                } else {
                    const errors = json.errors
                    for(let k in errors) {
                        handleError(errors[k], k);
                    }
                    console.log('Errors: ', errors)
                }
            })
            .catch(e => {
                setShowModal(false)
                console.warn(e)
            })
        }
    }

    useEffect(() => {
        if(Object.keys(admin).length !== 0) {
            goDashboard();
        }
    }, [admin])

    return (
        <Base hiddenStatusBar={true}>
            <View style={tw`flex-1`}>
                <ScrollView
                    nestedScrollEnabled={true}
                    contentContainerStyle={[tw``, { minHeight: '100%' }]}
                >
                    <View style={[tw`flex-1`]}>
                        <ModalValidationForm showM={showModal} />
                        <View style={[tw`flex-1 bg-black justify-center items-center`]}>
                            <Image
                                transition={true}
                                transitionDuration={1000}
                                source={require('../../assets/images/logo-2.png')}
                                style={[tw``, { width: PixelRatio.getPixelSizeForLayoutSize(40), height: PixelRatio.getPixelSizeForLayoutSize(40) }]}
                                resizeMode='stretch'
                            />
                        </View>
                    </View>
                    <View style={[tw`flex-4 justify-around items-center bg-white`, { borderTopLeftRadius: 80 }]}>

                        <Text style={[tw`text-center text-black font-bold text-3xl`, { fontFamily: 'Raleway-VariableFont_wght', color: CodeColor.code1 }]}>Connexion</Text>

                        <View style={[tw`px-10`, { width: windowWidth }]}>
                            <InputAuthForm
                                defaultValue={inputs.email}
                                label='Email'
                                labelStyle={{color: CodeColor.code1}}
                                placeholder='admin@utechaway.com'
                                keyboardType='email-address'
                                onChangeText={(text: string) => handleOnChange(text, 'email')}
                                error={errors.email} />

                            <InputAuthForm
                                defaultValue={inputs.password}
                                label='Mot de passe'
                                labelStyle={{color: CodeColor.code1}}
                                placeholder='*******'
                                password={true}
                                onChangeText={(text: string) => handleOnChange(text, 'password')}
                                error={errors.password} />

                            <Pressable
                                onPress={onSubmit}
                                style={[tw`bg-black mb-4 mt-1 rounded-2xl shadow-2xl shadow-zinc-800 border-l-2 border-r-2 border-black`, { height: 55, justifyContent: 'center', backgroundColor: CodeColor.code1 }]} >
                                <Text style={[tw`text-white text-center text-lg`]}>Connexion</Text>
                            </Pressable>
                        </View>

                        <Text style={[tw`text-center text-black text-sm`]}>Connectez-vous pour accéder à votre espace de travail.</Text>
                    </View>
                </ScrollView>
            </View>
        </Base>
    )
}

export default AuthView;