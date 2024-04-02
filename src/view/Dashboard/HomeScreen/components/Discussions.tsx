import React, { useEffect, useState } from 'react';
import { View, Pressable, Text, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import tw from 'twrnc';
import { CodeColor } from '../../../../assets/style';
import { ActivityLoading } from '../../../../components/ActivityLoading';
import { account, baseUri, fetchUri, formatDate, getDiscussDate } from '../../../../functions/functions';
import { capitalizeFirstLetter, refreshColor } from '../../../../functions/helperFunction';
import { Image as ImageRNE } from '@rneui/themed/dist/Image';
import { Icon } from '@rneui/base';

interface DiscussionsProps {
    endFetch: boolean,
    discussions: any,
    refreshing: boolean,
    onRefresh: any,
    navigation: any,
    emptyMessage: string
}

export const Discussions: React.FC<DiscussionsProps> = ({ endFetch, discussions, refreshing, onRefresh, navigation, emptyMessage, ...props }) => {

    // @ts-ignore
    const renderItem = ({ item }) => {
        
        const _class = item.message_expediteur !== account && item.message_readed == 0 ? 'font-black' : '';

        return (
            <View style={[ tw`flex-row mb-3 py-1 ${item.conversation_receveur.del == 1 ? 'bg-gray-100 rounded' : ''}` ]}>
                {/* <Text>{JSON.stringify(item)}</Text> */}
                {item.conversation_receveur.del == 1 && (
                    <Icon type='ant-design' name='close' color={CodeColor.code1} containerStyle={tw`absolute right-0 bottom-0`} />
                )}
                <ImageRNE 
                    onPress={() => navigation.navigate('ProfileUser', {user: item.conversation_receveur, profile: item.conversation_compte_receveur})}
                    source={item.conversation_receveur.image ? {uri: baseUri + '/assets/avatars/' + item.conversation_receveur.image} : require('../../../../assets/images/user-1.png')}
                    style={[ tw`rounded-full overflow-hidden`, { width: 50, height: 50 }]}
                    containerStyle={[ tw`mr-3 rounded-full overflow-hidden` ]} />
                <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => navigation.navigate('Discussion', {user: item.conversation_receveur, account: item.conversation_compte_receveur})}
                    style={[ tw`flex-1 ` ]}>
                    <View style={[ tw`flex-1 flex-row justify-between items-center` ]}>
                        <View style={[ tw`flex-1 pr-4` ]}>
                            <Text style={[ tw`text-black ${_class}` ]} numberOfLines={1}>{ capitalizeFirstLetter(item.conversation_receveur.prenom) + ' ' + item.conversation_receveur.nom.toUpperCase() } <Text style={tw`text-gray-400 text-xs`}>({capitalizeFirstLetter(item.conversation_compte_receveur)})</Text></Text>
                        </View>
                        <View style={[ tw``, {width: 75} ]}>
                            <Text style={[ tw`text-black text-right text-xs ${_class}` ]}>{ getDiscussDate(item.message_dat) }</Text>
                        </View>
                    </View>
                    <Text style={[ tw`text-black text-xs ${_class}` ]} numberOfLines={1} ellipsizeMode='tail'>{ item.message_fichier ? (item.message_type_fichier.toLowerCase() == 'image' ? 'image' : (item.message_type_fichier.toLowerCase() == 'doc' ? 'fichier' : null)) : item.message_texte }</Text>
                </TouchableOpacity>
            </View>
            // <View style={[ tw`flex-row mb-3 py-1 ${item.conversation.receveur.del == 1 ? 'bg-gray-100 rounded' : ''}` ]}>
            //     {item.conversation.receveur.del == 1 && (
            //         <Icon type='ant-design' name='close' color={CodeColor.code1} containerStyle={tw`absolute right-0 bottom-0`} />
            //     )}
            //     <ImageRNE 
            //         onPress={() => navigation.navigate('ProfileUser', {user: item.conversation.receveur, profile: item.conversation.compte_receveur})}
            //         source={item.conversation.receveur.image ? {uri: baseUri + '/assets/avatars/' + item.conversation.receveur.image} : require('../../../../assets/images/user-1.png')}
            //         style={[ tw`rounded-full overflow-hidden`, { width: 50, height: 50 }]}
            //         containerStyle={[ tw`mr-3 rounded-full overflow-hidden` ]} />
            //     <TouchableOpacity
            //         activeOpacity={0.7}
            //         onPress={() => navigation.navigate('Discussion', {user: item.conversation.receveur, account: item.conversation.compte_receveur})}
            //         style={[ tw`flex-1 ` ]}>
            //         <View style={[ tw`flex-1 flex-row justify-between items-center` ]}>
            //             <View style={[ tw`flex-1 pr-4` ]}>
            //                 <Text style={[ tw`text-black ${_class}` ]} numberOfLines={1}>{ capitalizeFirstLetter(item.conversation.receveur.prenom) + ' ' + item.conversation.receveur.nom.toUpperCase() } <Text style={tw`text-gray-400 text-xs`}>({capitalizeFirstLetter(item.conversation.compte_receveur)})</Text></Text>
            //             </View>
            //             <View style={[ tw``, {width: 75} ]}>
            //                 <Text style={[ tw`text-black text-right text-xs ${_class}` ]}>{ getDiscussDate(item.message.dat) }</Text>
            //             </View>
            //         </View>
            //         <Text style={[ tw`text-black text-xs ${_class}` ]} numberOfLines={1} ellipsizeMode='tail'>{ item.message.fichier ? (item.message.type_fichier.toLowerCase() == 'image' ? 'image' : (item.message.type_fichier.toLowerCase() == 'doc' ? 'fichier' : null)) : item.message.texte }</Text>
            //     </TouchableOpacity>
            // </View>
        )
    }

    useEffect(() => {
        // console.log('Key: ', Object.keys(discussions[0]));
        // console.log('Discussion: ', discussions[0]);
    }, [])

    return (
        <FlatList
            refreshControl={
                <RefreshControl
                    colors={refreshColor}
                    refreshing={refreshing} 
                    onRefresh={onRefresh} />
            }
            contentContainerStyle={[tw`pt-5 pb-30 px-2`]}
            data={discussions}
            ListEmptyComponent={
                endFetch
                ?
                    <View style={[ tw`` ]}>
                        <Text style={[ tw`text-black text-center` ]}>{emptyMessage}</Text>
                    </View>
                : <ActivityLoading containerStyle={tw`justify-start`} />
            }
            keyExtractor={(item, index) => index.toString()} 
            renderItem={renderItem}
            horizontal={ false }
            showsHorizontalScrollIndicator={ false }
            showsVerticalScrollIndicator={ true }            
        />
    )
}