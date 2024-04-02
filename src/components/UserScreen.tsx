import React from 'react';
import { ScrollView, View, Text, TouchableOpacity, RefreshControl } from 'react-native';
import Base from './Base';
import { Image as ImageRNE } from '@rneui/themed/dist/Image';
import tw from 'twrnc';
import { baseUri } from '../functions/functions';

interface UserScreenProps {
    navigation: any,
    users: any,
    account: string,
    refreshing: boolean,
    setRefreshing: any,
    getUsers: any
}
const UserScreen: React.FC<UserScreenProps> = (props) => {
    
    const {navigation, users, account, refreshing, setRefreshing = () => {}, getUsers = () => {}} = props;

    const onRefresh = () => {
        setRefreshing(true)
        getUsers()
    }

    // @ts-ignore
    const renderItem = ({ item }) => (
        <TouchableOpacity
            onPress={() => navigation.navigate('ProfileUser', {user: item, profile: account})}
            style={[ tw`flex-row p-3 mb-4 bg-white rounded-2xl` ]}>
            <ImageRNE 
                source={item.image ? {uri: baseUri + '/assets/avatars/' + item.image} : require('../assets/images/person.png')}
                style={[ tw`rounded-full overflow-hidden`, { width: 50, height: 50 }]}
                containerStyle={[ tw`mr-3 bg-gray-400 rounded-full overflow-hidden` ]} />
            <View style={[ tw`flex-1 ` ]}>
                <View style={[ tw`flex-1 flex-row justify-between items-center` ]}>
                    <Text style={[ tw`text-black` ]}>{ item.nom + ' ' + item.prenom }</Text>
                    <Text style={[ tw`text-black` ]}>{ item.dat }</Text>
                </View>
                <Text style={[ tw`text-black` ]}>{ item.text }</Text>
            </View>
        </TouchableOpacity>
    )

    return (
        <Base>
            <ScrollView
                refreshControl={
                    <RefreshControl
                        colors={['red', 'blue', 'green']}
                        refreshing={refreshing}
                        onRefresh={onRefresh} />
                }
                contentContainerStyle={[ tw``, {minHeight: '100%'} ]}>
                <View style={[ tw`flex-1 rounded-3xl pb-28 my-2 bg-white` ]}>
                    <Text style={[ tw`text-4xl text-black text-center p-5 my-8 font-serif` ]}>M<Text style={[ tw`text-2xl` ]}>es { account }s</Text></Text>
                    <View style={[ tw`flex-row flex-wrap justify-around` ]}>
                        { users.map((item: any, index: any) => (
                            <TouchableOpacity 
                                key={ index.toString() }
                                onPress={() => navigation.navigate('ProfileUser', {user: item, profile: account})}
                                style={[ tw`justify-center items-center mb-4`, {flexBasis: '40%'} ]}>
                                <ImageRNE 
                                    // @ts-ignore
                                    source={item.image ? {uri: baseUri + '/assets/avatars/' + item.image} : require('../assets/images/person.png')}
                                    style={[ tw`rounded-full overflow-hidden`, { width: 100, height: 100 }]}
                                    containerStyle={[ tw`mx-2 mb-2 bg-gray-400 rounded-full overflow-hidden`, { width: 100, height: 100 } ]} />
                                    {/* @ts-ignore */}
                                <Text numberOfLines={1} ellipsizeMode='tail' style={[ tw`text-black text-base text-center`, {fontFamily: 'IbarraRealNova-VariableFont_wght'} ]}>{ item.nom + ' ' + item.prenom }</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            </ScrollView>
            {/* <View style={[ tw`flex-1 bg-black` ]}>
                <FlatList 
                    data={ Discussions }
                    ListEmptyComponent={ 
                        <View>
                            <Text style={[ tw`text-gray-400` ]}>Aucun utilisateur</Text>
                        </View>
                    }
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={renderItem}
                    contentContainerStyle={[ tw`px-2 pt-3 pb-28 rounded-3xl`, {backgroundColor: ColorsPers.palette_1} ]}
                />
            </View> */}
        </Base>
    )
}

export default UserScreen;