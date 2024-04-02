import React, { Children, useEffect, useState } from 'react';
import { ActivityIndicator, Button, Dimensions, Image, ImageBackground, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Base from '../../../components/Base';
import tw from 'twrnc';
import { useDispatch, useSelector } from 'react-redux';
import { setNotify } from '../../../feature/switch.notification.slice';
import { DashboardHeaderSimple } from '../../../components/DashboardHeaderSimple';
import { account, componentPaddingHeader, fetchUri, getUser, toast } from '../../../functions/functions';
import { deleteAdmin } from '../../../feature/admin.slice';
import { ModalValidationForm } from '../../../components/ModalValidationForm';
import { Dialog, Toast, ALERT_TYPE, Root } from 'react-native-alert-notification';
import { CommonActions } from '@react-navigation/native';
import  { default as HeaderP } from '../../../components/Header';
import { CodeColor } from '../../../assets/style';
import { Divider, Icon } from '@rneui/base';
import { setStopped } from '../../../feature/init.slice';
import { getVersion } from 'react-native-device-info';
import { clearFullMessages } from '../../../feature/messages.slice';


const timer = require('react-native-timer');

interface ParamItemProps {
    title?: string,
    titleComponent?: React.ReactElement,
    description?: string,
    onPress?: any,
    hasDivider?: boolean,
    disabled?: boolean
}
const ParamItem: React.FC<ParamItemProps> = ({title, titleComponent, description, onPress=()=>{}, hasDivider, disabled}) => {
    return (
        <>
            <TouchableOpacity
                onPress={onPress}
                disabled={disabled}
                touchSoundDisabled
                activeOpacity={0.5}
                style={tw`flex-1 px-3`}
            >
                {titleComponent && (
                    titleComponent
                )}
                {title && (
                    <View style={tw`flex-row`}>
                        <Text style={[tw`text-base mb-1 text-gray-500`, styles.paramTitle]}>{title}</Text>
                    </View>
                )}
                {description && (
                    <Text style={tw`text-xs text-slate-500`}>{description}</Text>
                )}
            </TouchableOpacity>
            {hasDivider && (
                <Divider style={tw`mx-5 my-3`} />
            )}
        </>
    )
}

interface ParamProps {
    title: string,
    style?: any,
    onPress?: any
}
const Param: React.FC<ParamProps> = ({title, style, children, ...props}) => {
    return (
        <TouchableOpacity activeOpacity={0.5} style={[ styles.paramsContainer, style ]}>
            <Text style={[ tw`text-lg text-slate-600 flex-1`, styles.paramTitle ]} {...props}>{ title }</Text>
            { children }
        </TouchableOpacity>
    )
}

interface ParametresScreenProps {
    navigation?: any,
    route?: any
}
const ParametresScreen: React.FC<ParametresScreenProps> = (props) => {
    const {navigation, route} = props

    const dispatch = useDispatch()

    const admin = useSelector((state: any) => state.admin.data)

    const [showModal, setShowModal] = useState(false)

    const signOut = async () => {
        setShowModal(true)
        dispatch(setStopped(true));
        dispatch(clearFullMessages());
        setTimeout(() => {
            if(timer.intervalExists('home-data')) timer.clearInterval('home-data')
            setShowModal(false);
            dispatch(deleteAdmin());
        }, 3000)
    }

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
        if(Object.keys(admin).length == 0) {
            signIn()
        }
    }, [admin])

    return (
        <Root theme='dark'>
            <Base>
                <ModalValidationForm showM={showModal} />
                <HeaderP
                    elevated={true}
                    backgroundColor={CodeColor.code1}
                    containerStyle={{ paddingTop: componentPaddingHeader }}
                    leftComponent={
                        <DashboardHeaderSimple navigation={navigation} title={'Paramètres'} fontSize={'text-xl'} />
                    }
                />

                <View style={[tw`flex-1 py-5`, { backgroundColor: '#ffffff' }]}>
                    <ScrollView>
                        <View style={tw`mx-3 bg-gray-50 rounded-xl p-4`}>
                            <ParamItem title='Me déconnecter' hasDivider
                                onPress={() => {
                                    Dialog.show({
                                        type: ALERT_TYPE.DANGER,
                                        title: 'Déconnexion',
                                        textBody: 'Vous allez être déconnecté',
                                        button: 'Continuer',
                                        onPressButton: signOut
                                    })
                                }}
                            />
                            <ParamItem title='Version' description={getVersion()} disabled />
                        </View>
                    </ScrollView>
                </View>
            </Base>
        </Root>
    )
}

const styles = StyleSheet.create({
    title: {
        textAlign: 'center',
        color: 'rgb(4,28,84)',
        fontSize: 25,
        fontWeight: '600',
        marginBottom: 18,
        fontFamily: 'serif'
    },
    paragraph: {
        color: 'rgb(4,28,84)',
        lineHeight: 20,
        textAlign: 'justify',
        fontFamily: 'sans-serif'
    },
    paramsContainer: {
        borderWidth: 1,
        borderColor: '#f4f4f4',
        padding: 12,
        marginTop: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        flexWrap: 'wrap'
    },
    paramTitle: {
        fontFamily: 'YanoneKaffeesatz-Regular',
        // fontWeight: '600',
    }
})

export default ParametresScreen;