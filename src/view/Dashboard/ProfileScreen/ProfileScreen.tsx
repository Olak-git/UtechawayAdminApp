import React, { useEffect, useState } from 'react';
import { Modal, Platform, Pressable, RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Base from '../../../components/Base';
import { Image as ImageRNE } from '@rneui/themed/dist/Image';
import tw from 'twrnc';
import { Icon } from '@rneui/themed';
import { baseUri, downloadFile, fetchUri, headers, requestPermissions } from '../../../functions/functions';
import { useDispatch, useSelector } from 'react-redux';
import { ActivityLoading } from '../../../components/ActivityLoading';
import { ModalValidationForm } from '../../../components/ModalValidationForm';
import { setFocusedClient, setFocusedDiscuss, setFocusedTeam } from '../../../feature/focused.slice';
import { CommonActions } from '@react-navigation/native';
import { ImageSource } from 'react-native-vector-icons/Icon';
import ImageView from 'react-native-image-viewing';
import Pdf from 'react-native-pdf';
import { CodeColor } from '../../../assets/style';
import { ActivityIndicator as ActivityIndicatorRNP, DataTable } from 'react-native-paper';
import { Divider } from '@rneui/base';
import { callable, fileExtension, live, openUrl, refreshColor } from '../../../functions/helperFunction';
import Pdfview from './component/Pdfview';

interface ParamItemProps {
    title: string,
    description: string,
}
const ParamItem: React.FC<ParamItemProps> = ({title, description}) => {
    return (
        <View style={tw`px-3 mb-3`}>
            <Text style={[tw`text-base mb-1 text-black`, { fontFamily: 'YanoneKaffeesatz-Regular', }]}>{title}</Text>
            <Text style={tw`text-sm text-slate-500`}>{description}</Text>
        </View>
    )
}

interface ProfileScreenProps {
    navigation: any,
    route: any
}
const ProfileScreen: React.FC<ProfileScreenProps> = (props) => {
    const { navigation, route } = props;

    const dispatch = useDispatch();

    // @ts-ignore
    const admin = useSelector(state => state.admin.data);

    const [user, setUser] = useState(route.params.user)

    const [candidatures, setCandidatures] = useState([]);
    const [masterCandidatures, setMasterCandidatures] = useState([]);
    
    const profile = route.params.profile.toLowerCase();

    const [endFetch, setEndFetch] = useState(false)

    const [visible, setVisible] = useState(false)

    const [toggle, setToggle] = useState(false)

    const [show, setShow] = useState(false);
    const [selected, setSelected] = useState(0);

    const [refreshing, setRefreshing] = useState(false);

    const [hide, setHide] = useState(true);
    const [imageSelected, setImageSelected] = useState({});

    const [filename, setFilename] = useState<string|undefined>(undefined);
    const [typeFile, setTypeFile] = useState<string|undefined>(undefined);

    const onHandleValidateAccount = () => {
        setVisible(true)
        const formData = new FormData()
        formData.append('js', null);
        formData.append('csrf', null);
        formData.append('validation_account', null);
        formData.append('user', user.slug);
        formData.append('token', admin.email);
        fetch(fetchUri, {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(json => {
            setVisible(false);
            if(json.success) {
                setUser((prevState:any) => ({...prevState, valide: 1}))
            } else {
                console.log(json.errors);
            }
        })
        .catch(e => {
            setVisible(false);
            console.warn(e)
        })
        // setUser((prevState:any) => ({...prevState, valide: 1}))
    }

    const onRefresh = () => {
        setRefreshing(true)
        getProfileUser();
    }

    const getProfileUser = async () => {
        const formData = new FormData()
        formData.append('js', null)
        formData.append('profile', null)
        formData.append('user', profile)
        // @ts-ignore
        formData.append('token', user.slug)
        fetch(fetchUri, {
            method: 'POST',
            body: formData,
            headers: headers
        })
        .then(response => response.json())
        .then(async json => {
            if(json.success) {
                // console.log('Data=> ', json);
                setUser(json.user);
                setMasterCandidatures(json.accept_candidatures);
                setCandidatures(json.new_candidatures);
            } else {
                console.warn(json.errors);
            }
            // !endFetch ? setEndFetch(true) : null;
            setEndFetch(true)
            setRefreshing(false);
        })
        .catch(e => {
            console.warn(e)
        })
    }

    const onPressRow = (index: number) => {
        setSelected(index)
        setShow(true)
    }

    const readFile = (_filename: string, type: string) => {
        setFilename(_filename)
        setTypeFile(type)
        setToggle(true);
    }

    const renderItem = (item: any, index: number) => {
        return (
            <DataTable.Row key={index.toString()} style={[tw`px-2`]}>
                <DataTable.Title onPress={() => onPressRow(index)} numberOfLines={2} textStyle={[tw`text-left`, { lineHeight: 15 }]} style={tw`flex-5`}>{item.offre_candidature_intituler}</DataTable.Title>
                <DataTable.Cell onPress={() => readFile(item.cv, 'cv')} textStyle={tw`text-blue-500 text-xs underline`} style={tw`flex-1 justify-end`}>CV</DataTable.Cell>
                <DataTable.Cell onPress={() => readFile(item.lettre_motivation, 'Lettre de motivation')} textStyle={tw`text-blue-500 text-xs underline`} style={tw`flex-2 justify-end`}>Lettre</DataTable.Cell>
            </DataTable.Row>
        )
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
        if(Object.keys(admin).length !== 0) {
            getProfileUser();
        } else {
            signIn()
        }
    }, [admin])

    return (
        <Base hiddenStatusBar={hide}>
            <ImageView 
                images={[imageSelected]} 
                imageIndex={0} 
                visible={!hide}
                animationType='slide'
                // presentationStyle='fullScreen'
                doubleTapToZoomEnabled
                onRequestClose={function (): void {
                    setHide(true)
                    // throw new Error('Function not implemented.');
                }}
                keyExtractor={(imageSrc: ImageSource, index: number) => index.toString()}
            />
            <ModalValidationForm showM={visible} />
            {(profile == 'collaborateur' && candidatures.length !== 0) && (
                <>
                    <Modal
                        visible={show} 
                        animationType='slide'
                        transparent
                        children={
                            <View style={tw`flex-1 rounded-t-3xl bg-neutral-50 bg-white`}>
                                <View style={tw`items-end`}>
                                    <Pressable onPress={() => setShow(false)} style={tw`p-2`}>
                                        <Icon type='ant-design' name='close' size={30} />
                                    </Pressable>
                                </View>
                                <View style={tw``}>
                                    <Text style={tw`text-black text-center text-lg mb-1`}>Candidature</Text>
                                    <Divider style={tw`mb-3`} />
                                    {/* @ts-ignore */}
                                    <ParamItem title='Intitulé :' description={candidatures[selected].offre_candidature_intituler} />
                                    {/* @ts-ignore */}
                                    <ParamItem title='Caractéristiques :' description={candidatures[selected].offre_candidature_caracteristique} />
                                </View>
                            </View>
                        }
                    />
                    <Modal
                        visible={toggle} 
                        animationType='slide'
                        transparent
                        children={
                            <View style={tw`flex-1 rounded-t-3xl bg-white`}>
                                <View style={tw`flex-row justify-between items-center`}>
                                    <Text numberOfLines={1} style={[tw`text-black text-xl ml-2 flex-1`, {fontFamily: 'YanoneKaffeesatz-Regular'}]}>{ typeFile }</Text>
                                    <Pressable onPress={() => setToggle(false)} style={tw`p-2`}>
                                        <Icon type='ant-design' name='close' size={30} />
                                    </Pressable>
                                </View>
                                <Divider />
                                <View style={tw`flex-1`}>
                                    {filename && (
                                        typeFile == 'cv'
                                            ? <Pdfview filename={baseUri + '/assets/files/cv/' + filename} />
                                            : <Pdfview filename={baseUri + '/assets/files/lm/' + filename} />
                                    )}
                                </View>
                            </View>
                        }
                    />
                </>
            )}
            <ScrollView
                refreshControl={
                    <RefreshControl
                        colors={refreshColor}
                        refreshing={refreshing}
                        onRefresh={onRefresh} />
                }
                contentContainerStyle={[ tw``, {minHeight: '100%'} ]}
            >
                <View style={[ tw`flex-1 rounded-3xl rounded-b-0 bg-white` ]}>
                    <View style={[ tw`justify-between items-start flex-row mb-5 p-4` ]}>
                        <Pressable onPress={() => navigation.goBack()}>
                            {/* <Icon type='entypo' name='chevron-thin-left' size={30} color='rgb(115, 115, 115)' containerStyle={ tw`rounded-full`} /> */}
                            <Icon type='ant-design' name='close' size={30} />
                        </Pressable>
                        { profile === 'collaborateur' && user.block === 1 && (
                            <Icon onPress={() => console.log('Compte Verrouillé.')} type='material-community' name='account-lock' size={30} color='red' containerStyle={[ tw`rounded-full` ]} />
                        )}
                    </View>
                    <View style={[ tw`items-center` ]}>
                        <Pressable 
                            onPress={() => {
                                setImageSelected({uri: baseUri + '/assets/avatars/' + user.image})
                                setHide(false);
                            }}
                            disabled={user.image ? false : true}
                            style={tw`mx-2 mb-2`}
                        >
                        <ImageRNE 
                            source={user.image ? {uri: baseUri + '/assets/avatars/' + user.image} : require('../../../assets/images/person.png')}
                            style={[ tw`rounded-full overflow-hidden`, { width: 120, height: 120 }]}
                            containerStyle={[ tw`bg-gray-400 rounded-full overflow-hidden`, { width: 120, height: 120 } ]} />
                        </Pressable>
                    </View>
                    <Text style={[ tw`mt-5 text-gray-600 text-center text-3xl`, {fontFamily: 'IbarraRealNova-VariableFont_wght'} ]}>{ user.nom + ' ' + user.prenom }</Text>
                    <Text style={[ tw`text-gray-400 text-center text-sm mt-5`, {fontFamily: 'Raleway-VariableFont_wght'} ]}>
                        { profile }
                        { profile === 'collaborateur' && user.block === 1 && (
                            <Icon onPress={() => console.log('Compte Verrouillé.')} type='material-community' name='account-lock' size={28} color={CodeColor.code4} containerStyle={[ tw`rounded-full` ]} />
                        )}
                    </Text>

                    {profile == 'collaborateur' && (
                        <View style={tw`flex-row justify-center items-center px-5 mt-5`}>
                            {masterCandidatures.map((item: any, index: number) => {
                                return (
                                    <>
                                        <Text key={index.toString()} style={[tw`text-gray-500`, {fontFamily: 'IbarraRealNova-VariableFont_wght'}]}>{item.offre_candidature_intituler}</Text>
                                        {(index < masterCandidatures.length - 1) && (
                                            <Icon type='entypo' name='dot-single' color='silver' />
                                        )}
                                    </>
                                )
                            })}
                        </View>
                    )}

                    <View style={[ tw`mt-5 flex-row justify-center`]}>
                        <Icon onPress={() => navigation.navigate('Discussion', {user: user, account: profile})} type='ionicon' name='md-chatbubble-ellipses' size={20} color={CodeColor.code1} reverse />
                        {(callable && !live) && (
                            <>
                                <Icon onPress={() => navigation.navigate('Call', {type: 'audio', action: 'emit', user: user, account: profile})} type="ionicon" name={ Platform.OS == 'android' ? 'call-outline' : 'ios-call-outline' } size={20} color={CodeColor.code1} reverse containerStyle={[ tw`mx-4` ]} />
                                <Icon onPress={() => navigation.navigate('Call', {type: 'video', action: 'emit', user: user, account: profile})} type="ionicon" name={ Platform.OS == 'android' ? 'videocam-outline' : 'ios-videocam-outline' } size={20} color={CodeColor.code1} reverse />
                            </>
                        )}
                    </View>

                    <View style={[ tw`mt-10 px-10` ]}>
                        <View style={[ tw`flex-row flex-wrap` ]}>
                            <Text style={[ tw`flex-1 font-normal text-base text-gray-400`, {fontFamily: 'IbarraRealNova-VariableFont_wght'} ]}>Email</Text>
                            <Text style={[ tw`flex-1 font-medium text-base text-gray-600`, {fontFamily: 'IbarraRealNova-VariableFont_wght'} ]}>{ user.email }</Text>
                        </View>
                        <View style={[ tw`flex-row flex-wrap mt-3` ]}>
                            <Text style={[ tw`flex-1 font-normal text-base text-gray-400`, {fontFamily: 'IbarraRealNova-VariableFont_wght'} ]}>Phone</Text>
                            <Text style={[ tw`flex-1 font-medium text-base text-gray-600`, {fontFamily: 'IbarraRealNova-VariableFont_wght'} ]}>{ user.phone }</Text>
                        </View>
                    </View>

                    {profile == 'collaborateur' && (
                        <View style={tw`mt-3`}>
                            <DataTable style={[tw`mb-4`]}>
                                <DataTable.Header style={[tw`bg-slate-200`]}>
                                    <DataTable.Title textStyle={[tw`font-extrabold`]}>Candidatures</DataTable.Title>
                                    <DataTable.Title>{null}</DataTable.Title>
                                </DataTable.Header>
                                {!endFetch
                                    ?
                                    <DataTable.Row style={[tw`px-0`]}>
                                        <DataTable.Cell style={tw`justify-center`}>
                                            <ActivityIndicatorRNP color='silver' />
                                        </DataTable.Cell>
                                    </DataTable.Row>
                                    :
                                    candidatures.length == 0
                                        ?
                                        <DataTable.Row style={[tw`px-0`]}>
                                            <DataTable.Cell style={tw`justify-center`}>
                                                Aucune candidature
                                            </DataTable.Cell>
                                        </DataTable.Row>
                                        :
                                        candidatures.map((item: any, index: number) => 
                                            renderItem(item, index)
                                        )
                                }
                            </DataTable>
                        </View>
                    )}
                </View>
            </ScrollView>
        </Base>
    )
}

export default ProfileScreen;