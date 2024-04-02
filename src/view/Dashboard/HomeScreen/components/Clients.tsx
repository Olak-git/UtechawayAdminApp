import React, { useEffect, useState } from 'react';
import { View, Pressable, Text, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { DataTable } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import tw from 'twrnc';
import { ActivityLoading } from '../../../../components/ActivityLoading';
import { Image as ImageRNE } from '@rneui/themed/dist/Image';
import { baseUri } from '../../../../functions/functions';
import { Icon } from '@rneui/base';
import { CodeColor } from '../../../../assets/style';
import RenderUser from './RenderUser';

interface ClientsProps {
    endFetch: boolean,
    clients: any,
    refreshing: boolean,
    onRefresh: any,
    navigation: any,
    user: any,
    setImageSelected: any,
    setVisible: any,
    emptyMessage: string
}

export const Clients: React.FC<ClientsProps> = ({ endFetch, clients, refreshing, onRefresh, navigation, user, setImageSelected, setVisible, emptyMessage }) => {

    // @ts-ignore
    const renderItem = ({ item }) => (
        <RenderUser navigation={navigation} item={item} setImageSelected={setImageSelected} setVisible={setVisible} account={'client'} />
    )
    
    return (
        <FlatList
            ListEmptyComponent={
                endFetch
                    ?
                        <View>
                            <Text style={[tw`text-black text-center`]}>{emptyMessage}</Text>
                        </View>
                    : <ActivityLoading containerStyle={tw`justify-start`} />
            }
            refreshControl={
                <RefreshControl
                    colors={['red', 'blue', 'green']}
                    refreshing={refreshing}
                    onRefresh={onRefresh} />
            }
            contentContainerStyle={[tw`pt-5 pb-30 px-2`]}
            data={clients}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderItem}
            horizontal={false}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={true}
        />
    )
}