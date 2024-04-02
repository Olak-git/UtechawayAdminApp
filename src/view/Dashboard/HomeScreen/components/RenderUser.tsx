import { View, Text, Pressable, TouchableOpacity } from 'react-native'
import React from 'react'
import { Icon } from '@rneui/base'
import { CodeColor } from '../../../../assets/style'
import { baseUri } from '../../../../functions/functions'
import { Image } from '@rneui/themed'
import tw from 'twrnc'
import { capitalizeFirstLetter } from '../../../../functions/helperFunction'

interface RenderUserProps {
    navigation: any,
    item: any,
    setImageSelected: any,
    setVisible: any,
    account: string
}
const RenderUser: React.FC<RenderUserProps> = ({
    navigation,
    item,
    setImageSelected,
    setVisible,
    account
}) => {
    return (
        <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => navigation.navigate('ProfileUser', {user: item, profile: account.toLowerCase()})}
            style={[ tw`flex-row items-center py-1 mb-3` ]}>
            <Pressable 
                onPress={() => {
                    setImageSelected({uri: baseUri + '/assets/avatars/' + item.image})
                    setVisible(true);
                }}
                disabled={item.image ? false : true}
                style={tw`mr-3`}
            >
                <Image
                    source={item.image ? {uri: baseUri + '/assets/avatars/' + item.image} : require('../../../../assets/images/user-1.png')}
                    style={[ tw`rounded-full overflow-hidden`, { width: 50, height: 50 }]}
                    containerStyle={[ tw`rounded-full overflow-hidden` ]} />
            </Pressable>
            <View style={[ tw`flex-1 justify-between self-start` ]}>
                <Text style={[ tw`text-black mb-2` ]} numberOfLines={1}>{ capitalizeFirstLetter(item.prenom) + ' ' + item.nom.toUpperCase() }</Text>
                <Text style={[ tw`text-gray-400 font-thin`, {fontFamily: 'YanoneKaffeesatz-Regular'} ]} numberOfLines={1}>{capitalizeFirstLetter(account)}</Text>
            </View>

            {/* <TouchableOpacity onPress={() => navigation.navigate('DashboadVideoSdkLive', {user: item, account: account.toLowerCase()})} style={tw`pl-2 self-start`}>
                <Icon
                    containerStyle={[tw`text-right`, { marginLeft: 'auto' }]}
                    color={CodeColor.code1}
                    name="video"
                    type='material-community'
                    size={32}
                />
            </TouchableOpacity> */}
            <TouchableOpacity onPress={() => navigation.navigate('Discussion', {user: item, account: account.toLowerCase()})} style={tw`pl-2 self-start`}>
                <Icon
                    containerStyle={[tw`text-right`, { marginLeft: 'auto' }]}
                    color={CodeColor.code1}
                    name="android-messages"
                    type='material-community'
                    size={32}
                />
            </TouchableOpacity>
        </TouchableOpacity>
    )
}

export default RenderUser