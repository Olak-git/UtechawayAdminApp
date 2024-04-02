import { ScreenHeight } from '@rneui/base';
import React, { useEffect, useState } from 'react';
import { Animated, ActivityIndicator, Dimensions, LogBox, Platform, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, useColorScheme, View } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { useSelector } from 'react-redux';
import tw from 'twrnc';
import { CodeColor } from '../assets/style';

// LogBox.ignoreLogs(['Warning: \rn-fetch-blob\index.js -> node_modules\rn-fetch-blob\polyfill\index.js -> node_modules\rn-fetch-blob\polyfill\XMLHttpRequest.js -> node_modules\rn-fetch-blob\index.js', 'Warning: Require cycle: node_modules\rn-fetch-blob\index.js -> node_modules\rn-fetch-blob\polyfill\index.js -> node_modules\rn-fetch-blob\polyfill\XMLHttpRequest.js -> node_modules\rn-fetch-blob\index.js', 'Warning: Require cycle: node_modules\rn-fetch-blob\index.js -> node_modules\rn-fetch-blob\polyfill\index.js -> node_modules\rn-fetch-blob\polyfill\Fetch.js -> node_modules\rn-fetch-blob\index.js']);
LogBox.ignoreLogs(['Warning: Require cycle']);

interface BaseProps {
    hiddenStatusBar?: boolean
}
const Base: React.FC<BaseProps> = ({hiddenStatusBar, children}) => {

    const barCurrentHeight = StatusBar.currentHeight;

    const isDarkMode = useColorScheme() === 'dark';
  
    const backgroundStyle = {
      backgroundColor: Colors.white
    //   backgroundColor: isDarkMode ? Colors.darker : Colors.lighter
    };
  
    return (
        // paddingTop: Platform.OS == 'android' ? StatusBar.currentHeight : 0
        <SafeAreaView style={[ tw`flex-1 bg-black` ]}>
            <StatusBar 
                hidden={ hiddenStatusBar }
                backgroundColor={CodeColor.code1}
                translucent={false}
                networkActivityIndicatorVisible
                // barStyle={isDarkMode ? 'light-content' : 'dark-content'} 
            />
            { children }
        </SafeAreaView>
    )
}

export default Base;