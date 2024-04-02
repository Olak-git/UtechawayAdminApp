import { CommonActions } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Text, TouchableOpacity, View, SafeAreaView, StatusBar, Easing, Image, PixelRatio } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import tw from 'twrnc';
import { CodeColor } from '../../assets/style';
import { setWelcome } from '../../feature/init.slice';
import { windowHeight, windowWidth } from '../../functions/functions';

interface WelcomeViewProps {
   navigation: any,
   route: any 
}
const WelcomeView: React.FC<WelcomeViewProps> = (props) => {

    const {navigation, route} = props;

    const dispatch = useDispatch();

    const { welcome } = useSelector((state: any) => state.init)

    const LogoAnime = useRef(new Animated.Value(0)).current;
    const LogoText = useRef(new Animated.Value(0)).current;
    const [loadingSpinner, setLoadingSpinner] = useState(false);
    const fadeAnim = useRef(new Animated.Value(0)).current;

    const dispatchNavigation = () => {
        navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [
                    {name: 'Auth'}
                ]
            })
        )
    }

    const goSignForm = async (): Promise<void> => {
        dispatch(setWelcome(true))
    }

    useEffect(() => {
        Animated.parallel([
            // @ts-ignore
            Animated.spring(LogoAnime, {
                toValue: 1,
                tension: 10,
                friction: 2,
                useNativeDriver: false
            }).start(),
            // @ts-ignore
            Animated.timing(LogoText, {
                toValue: 1,
                easing: Easing.back(1),
                duration: 1000,
                useNativeDriver: true
            }),
            Animated.timing(
                fadeAnim, {
                    toValue: 1,
                    duration: 2000,
                    useNativeDriver: true
                }
            )
        ]).start(() => {
            setLoadingSpinner(true)
        })
    }, [])

    useEffect(() => {
        if(welcome) {
            dispatchNavigation()
        }
    }, [welcome])

    return (
        <SafeAreaView style={tw`bg-black flex-1`}>
            <StatusBar hidden />
            <View style={[tw`flex-1 relative`]}>
                <View style={[tw`absolute flex-row top-0 left-0`, { width: windowWidth, height: windowHeight }]}>
                    <View style={[tw`flex-1 bg-black`, {}]} />
                    <View style={[tw`flex-1`, { backgroundColor: CodeColor.code1 }]} />
                </View>
                <View style={[tw`flex-1 bg-black justify-end`, { borderBottomRightRadius: 100 }]}>
                    <Animated.View style={[tw`items-center mb-10`, {
                        opacity: LogoAnime, top: LogoAnime.interpolate({
                            inputRange: [0, 1],
                            outputRange: [80, 0]
                        })
                    }]}>
                        <Image
                            // style={[tw`rounded-3xl`, { width: PixelRatio.getPixelSizeForLayoutSize(70), height: PixelRatio.getPixelSizeForLayoutSize(70) }]}
                            style={[tw`rounded-3xl`, { width: PixelRatio.getPixelSizeForLayoutSize(70), height: PixelRatio.getPixelSizeForLayoutSize(30) }]}
                            resizeMode='contain'
                            source={require('../../assets/images/logo-4.png')}
                        />
                    </Animated.View>
                </View>
                <View style={[tw`flex-1 justify-between`, { backgroundColor: CodeColor.code1, borderTopLeftRadius: 100 }]}>
                    <Animated.View
                        style={[tw`mt-5 items-center`, { opacity: fadeAnim }]}>
                        <TouchableOpacity
                            style={[tw`rounded-full bg-black shadow px-20 py-3`, {}]}
                            onPress={goSignForm}
                        >
                            <Text style={[tw`text-white font-bold text-base`]}>Commencer</Text>
                        </TouchableOpacity>
                    </Animated.View>
                    <Text style={[tw`text-xl text-white text-center mb-2`, { fontFamily: 'Raleway-VariableFont_wght' }]}>Bienvenue Admin !</Text>
                </View>
            </View>
        </SafeAreaView>
    )
}

export default WelcomeView;