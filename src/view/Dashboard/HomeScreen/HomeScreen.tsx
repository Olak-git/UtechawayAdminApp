import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Button, Dimensions, Image, ImageBackground, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import Base from '../../../components/Base';
import tw from 'twrnc';
import { Card, Header, Icon, ListItem, Tab, SpeedDial, TabView, Text as TextRNE } from '@rneui/themed';
import { useDispatch, useSelector } from 'react-redux';
import { DashboardHeader } from '../../../components/DashboardHeader';
import { account, baseUri, componentPaddingHeader, fetchUri, formatDate, getCurrency, getRandomInt, getUser, windowHeight, windowWidth } from '../../../functions/functions';
import { Discussions } from './components/Discussions';
import { CommonActions } from '@react-navigation/native';
import { CodeColor } from '../../../assets/style';
import  { default as HeaderP } from '../../../components/Header';
import { Teams } from './components/Teams';
import { Clients } from './components/Clients';
import { addMessages, clearFullMessages, setMessages } from '../../../feature/messages.slice';
import ImageView from 'react-native-image-viewing';
import { ImageSource } from 'react-native-vector-icons/Icon';
import { setStopped } from '../../../feature/init.slice';
import { setVideoSdkToken } from '../../../feature/videosdk.authtoken.slice';

const timer = require('react-native-timer');

interface HomeScreenProps {
    navigation?: any,
    route?: any
}
const HomeScreen: React.FC<HomeScreenProps> = (props) => {
    const {navigation, route} = props

    const admin = useSelector((state: any) => state.admin.data)

    const dispatch = useDispatch();

    const stopped = useSelector((state: any) => state.init.stopped);

    const videoSdkAuthToken = useSelector((state: any) => state.videosdk.token)

    const messages = useSelector((state: any) => state.messages.data);

    const [open, setOpen] = useState(false);

    const [visibleSearchBar, setVisibleSearchBar] = useState(false)

    const [refreshing, setRefreshing] = useState(false);

    const [index, setIndex] = useState(0)

    const [visible, setVisible] = useState(false);

    const [imageSelected, setImageSelected] = useState({});

    const [emptyText, setEmptyText] = useState({
        discussions: 'Aucune discussion disponible',
        teams: 'Aucun membre disponible',
        clients: 'Aucun client disponible'
    })

    const [data, setData] = useState({
        discussions: [],
        teams: [],
        clients: []
    });

    const [searchItem, setSearchItem] = useState('');
    const [loading, setLoading] = useState(false);
    const [master, setMaster] = useState({
        discussions: [],
        teams: [],
        clients: []
    });

    const [endFetch, setEndFetch] = useState(false)

    const onRefresh = () => {
        if(stopped) dispatch(setStopped(false))
        setRefreshing(true);
        getData();
    }

    const onTabChange = (value: number) => {
        setIndex(value)
        setVisibleSearchBar(false)
        filterItemFunction('');
    }

    const filterItemFunction = (text: string) => {
        // Check if searched text is not blank
        if (text) {
            setLoading(true)
            // Inserted text is not blank
            // Filter the masterDataSource and update FilteredDataSource
            
            if(index == 0) {
                const newData = master.discussions.filter(function (item: any) {
                    // Applying filter for the inserted text in search bar
                    // @ts-ignore
                    const ctext = item.conversation.receveur.prenom + ' ' + item.conversation.receveur.nom + ' ' + (item.message.fichier ? (item.message.type_fichier.toLowerCase() == 'image' ? 'image' : 'fichier') : item.message.texte);
                    const itemData = ctext.trim()
                                    ? ctext.toUpperCase()
                                    : '';
                    const textData = text.toUpperCase();
                    return itemData.indexOf(textData) > -1;
                });
                
                setEmptyText((prevState: any) => ({...prevState, discussions: 'Aucun résultat trouvé'}))
                setData((prevState: any) => ({...prevState, discussions: newData}))
            } else if(index == 1) {
                const newData = master.teams.filter(function (item: any) {
                    // Applying filter for the inserted text in search bar
                    // @ts-ignore
                    const ctext = `${item.prenom} ${item.nom}`;
                    const itemData = ctext.trim()
                                    ? ctext.toUpperCase()
                                    : '';
                    const textData = text.toUpperCase();
                    return itemData.indexOf(textData) > -1;
                });
                
                setEmptyText((prevState: any) => ({...prevState, teams: 'Aucun résultat trouvé'}))
                setData((prevState: any) => ({...prevState, teams: newData}))
            } else if(index == 2) {
                const newData = master.clients.filter(function (item: any) {
                    // Applying filter for the inserted text in search bar
                    // @ts-ignore
                    const ctext = `${item.prenom} ${item.nom}`;
                    const itemData = ctext.trim()
                                    ? ctext.toUpperCase()
                                    : '';
                    const textData = text.toUpperCase();
                    return itemData.indexOf(textData) > -1;
                });

                setEmptyText((prevState: any) => ({...prevState, clients: 'Aucun résultat trouvé'}))
                setData((prevState: any) => ({...prevState, clients: newData}))
            }
            setSearchItem(text);
        } else {
            // Inserted text is blank
            // Update FilteredDataSource with masterDataSource
            
            setData((prevState: any) => ({...prevState, discussions: master.discussions, teams: master.teams, clients: master.clients}))
            // setData(master)
            setSearchItem(text);
            setEmptyText((prevState: any) => ({...prevState, discussions: 'Aucun résultat trouvé'}))
            // setCovoiturageEmptyText('Aucune discussion');
            setEmptyText((prevState: any) => ({
                ...prevState,
                discussions: 'Aucune discussion disponible',
                teams: 'Aucun membre disponible',
                clients: 'Aucun client disponible'
            }))
            setLoading(false);
        }
    }

    const getData = () => {
        if(!stopped && !visibleSearchBar) {
            // console.log('Yaaaa');
            const formData = new FormData()
            formData.append('js', null)
            formData.append('discussions-teams-clients', null);
            formData.append('token', admin.email)

            fetch(fetchUri, {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(async json => {
                if(json.success) {
                    let discussions = await json.discussions.filter(function(v: any) {
                        return v.conversation_receveur != false && v.conversation_receveur != null
                    })
                    setData((prevState) => ({ 
                        ...prevState,
                        discussions: discussions, 
                        teams: json.teams, 
                        clients: json.clients
                    }))
                    setMaster((prevState) => ({ 
                        ...prevState,
                        discussions: discussions, 
                        teams: json.teams, 
                        clients: json.clients
                    }))
                    if(json.videosdk_auth_token && json.videosdk_auth_token !== videoSdkAuthToken) {
                        dispatch(setVideoSdkToken(json.videosdk_auth_token))
                    }
                } else {
                    console.warn(json.errors)
                }
                setEndFetch(true)
                setRefreshing(false)
            })
            // .catch(e => console.warn(e))
        }
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

    const counter = useCallback((c: number) => {
        return c > 1 ? '(' + (c < 10 ? c.toString().padStart(2, '0') : c) + ')' : ''
    }, [data])

    useEffect(() => {
        dispatch(setStopped(false))
        // dispatch(clearFullMessages());
        // dispatch(addMessages({mkl: [0, -1]}))
        // dispatch(setMessages({mkl: [1, 2, 3]}))
    }, [])

    useEffect(() => {
        if(Object.keys(admin).length !== 0) {
            getData();
        } else {
            signIn()
        }
    }, [admin])

    useEffect(() => {
        timer.setInterval('home-data', getData, 5000)
        return () => {
            if(timer.intervalExists('home-data')) timer.clearInterval('home-data')
        }
    }, [stopped, visibleSearchBar])

    return (
        <Base>
            <ImageView 
                images={[imageSelected]} 
                imageIndex={0} 
                visible={visible}
                animationType='slide'
                // presentationStyle='pageSheet'
                doubleTapToZoomEnabled
                onRequestClose={function (): void {
                    setVisible(false)
                    // throw new Error('Function not implemented.');
                }}
                keyExtractor={(imageSrc: ImageSource, index: number) => index.toString()}
            />
            <HeaderP
                elevated={true}
                backgroundColor={visibleSearchBar ? '#FFF' : CodeColor.code1}
                barStyle='default'
                containerStyle={[tw`pt-2 pb-0 ${visibleSearchBar ? 'shadow' : 'px-4'}`, {}]}
                centerComponent={
                    <DashboardHeader
                        visible={visibleSearchBar}
                        setVisible={setVisibleSearchBar}
                        filterItemFunction={filterItemFunction}
                        loading={loading}
                        setLoading={setLoading}
                        searchItem={searchItem}
                        user={admin}
                        itemsNavBar={['Discussions', `Teams${counter(data.teams.length)}`, `Clients${counter(data.clients.length)}`]}
                        // @ts-ignore
                        userImage={admin.image}
                        navigation={navigation} index={index} setIndex={setIndex} />
                }
            />
            <View style={[tw`flex-1`, { backgroundColor: '#ffffff', minHeight: windowHeight }]}>

                <TabView
                    value={index}
                    onChange={onTabChange}
                    animationType='timing'
                    tabItemContainerStyle={[tw``, {}]}
                    containerStyle={[tw`flex flex-1`, {width: windowWidth}]}>

                    <TabView.Item style={[tw`flex-1`]}>
                        <Discussions endFetch={endFetch} discussions={data.discussions} emptyMessage={emptyText.discussions} navigation={navigation} refreshing={refreshing} onRefresh={onRefresh} />
                    </TabView.Item>

                    <TabView.Item style={[tw`flex-1`]}>
                        <Teams endFetch={endFetch} teams={data.teams} emptyMessage={emptyText.teams} navigation={navigation} user={admin} refreshing={refreshing} onRefresh={onRefresh} setImageSelected={setImageSelected} setVisible={setVisible} />
                    </TabView.Item>

                    <TabView.Item style={[tw`flex-1`]}>
                        <Clients endFetch={endFetch} clients={data.clients} emptyMessage={emptyText.clients} navigation={navigation} user={admin} refreshing={refreshing} onRefresh={onRefresh} setImageSelected={setImageSelected} setVisible={setVisible} />
                    </TabView.Item>
                </TabView>

            </View>

            <SpeedDial
                isOpen={open}
                icon={{ type: 'ant-design', name: 'plus', color: '#fff' }}
                openIcon={{ name: 'close', color: '#fff' }}
                color={CodeColor.code1}
                onOpen={() => setOpen(!open)}
                onClose={() => setOpen(!open)}
            >
                {/* @ts-ignore */}
                <SpeedDial.Action
                    icon={{ type: 'material-community', name: 'video', color: '#fff' }} 
                    color={CodeColor.code1}
                    title='Meeting' 
                    onPress={() => {
                        setOpen(false);
                        navigation.navigate('DashboadVideoSdkLive', {user: null, account: null});
                    }}
                />
            </SpeedDial>
        </Base>
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
    }
})

export default HomeScreen;