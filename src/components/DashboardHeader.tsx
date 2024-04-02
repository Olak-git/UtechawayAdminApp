import { Icon } from '@rneui/base';
import { Tab } from '@rneui/themed';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Image, Pressable, Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import tw from 'twrnc';
import { CodeColor } from '../assets/style';
import { baseUri, getRandomInt, windowWidth } from '../functions/functions';
import SearchBar from './SearchBar';

interface DashboardHeaderProps {
    navigation?: any,
    route?: any,
    index?: number,
    setIndex?: any,
    userImage?: any | null,
    itemsNavBar?: any,
    user: any,
    visible?: boolean,
    setVisible: any,
    filterItemFunction: (text: string) => void,
    loading: boolean,
    setLoading: any,
    searchItem: string
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
    navigation, 
    route, 
    index, 
    setIndex = () => {}, 
    userImage = null, 
    itemsNavBar = [], 
    user, 
    visible, 
    setVisible,
    filterItemFunction,
    loading,
    setLoading,
    searchItem
}) => {

    const ViewContainer = useRef(new Animated.Value(0)).current;

    const onBack = () => {
        filterItemFunction('')
        setVisible(false)
    }

    useEffect(() => {
        if(visible) {
            Animated.timing(ViewContainer, {
                toValue: windowWidth,
                easing: Easing.back(1),
                duration: 1000,
                useNativeDriver: true
            }).start()
        } else {
            Animated.timing(ViewContainer, {
                toValue: 0,
                easing: Easing.back(1),
                duration: 1000,
                useNativeDriver: true
            }).start()
        }
    }, [visible])

    return (
        <View style={[ tw`` ]}>
            {visible
            ?
                // <Animated.View style={[tw`flex-row items-center`, {opacity: ViewContainer}]}>
                <View style={[tw`flex-row items-center mb-2 px-1 border-b border-gray-100`, {}]}>
                    <Pressable onPress={onBack}>
                        <Icon type='ant-design' name='arrowleft' size={30} />
                    </Pressable>
                    <SearchBar 
                        iconSearchColor='grey'
                        iconSearchSize={20}
                        loadingColor='grey'
                        containerStyle={[ tw`flex-1 px-3 rounded-lg border-0 bg-gray-200 bg-white` ]}
                        inputContainerStyle={tw`border-b-0`}
                        placeholder='Rechercher'
                        value={searchItem}
                        showLoading={loading}
                        onChangeText={filterItemFunction}
                        onEndEditing={() => setLoading(false)}
                    />
                </View>
                // </Animated.View>
            :
            <>
            <View style={[ tw`flex-row flex-wrap justify-between items-center mb-2` ]}>
                <Image
                    style={[tw`rounded-3xl`, { width: 100, height: 30 }]}
                    resizeMode='stretch'
                    source={require('../assets/images/logo-4.png')}
                />
                {/* <Text numberOfLines={1} style={[tw`text-black text-2xl flex-1`, {fontFamily: 'YanoneKaffeesatz-Bold'}]}>U<Text style={tw`text-white text-lg`}>techaway</Text></Text> */}
                <View style={[ tw`flex-row items-center` ]}>
                    <Pressable onPress={() => setVisible(true)} style={tw`mr-3`}>
                        <Icon type='ant-design' name="search1" color='#FFFFFF' />
                    </Pressable>
                    <Pressable onPress={() => navigation.navigate('Settings')} style={tw``}>
                        <Icon type='ionicon' name='settings-sharp' size={28} color='#FFFFFF' />
                    </Pressable>
                </View>
            </View>
            <Tab
                value={index}
                onChange={(e) => setIndex(e)}
                containerStyle={[ tw`p-0 m-0`, {backgroundColor:CodeColor.code1 }]}
                indicatorStyle={[ tw`bg-white`, {height: 3} ]}
                variant='primary' >
                {
                    itemsNavBar.map((item:string, index: any) => (
                        <Tab.Item
                            key={ index.toString() } 
                            title={item}
                            containerStyle={{ backgroundColor:CodeColor.code1 }}
                            titleStyle={[ tw`p-0`, {fontFamily: 'YanoneKaffeesatz-Regular'} ]} />
                    ))
                }
            </Tab>
            </>
            }
        </View>
    )
}