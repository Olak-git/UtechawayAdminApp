import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import WelcomeView from '../view/WelcomeView/WelcomeView';
import AuthView from '../view/AuthView/AuthView';
import ProfileScreen from '../view/Dashboard/ProfileScreen/ProfileScreen';
import { useSelector } from 'react-redux';
import HomeScreen from '../view/Dashboard/HomeScreen/HomeScreen';
import MessageScreen from '../view/Dashboard/MessageScreen/MessageScreen';
import CallScreen from '../view/Dashboard/CallScreen/CallScreen';
import ParametresScreen from '../view/Dashboard/ParametresScreen/ParametresScreen';
import VideoSdkLive from '../view/Dashboard/VideoSdkLive/VideoSdkLive';
import VideoLive from '../view/Dashboard/VideoLive/VideoLive';

const Stack = createNativeStackNavigator();

const GenerateView: React.FC<{}> = () => {

  const { welcome } = useSelector((state: any) => state.init);
    
  const admin = useSelector((state: any) => state.admin.data);

  useEffect(() => {
    console.log('ADMIN => ', admin)
    console.log('Welcome => ', welcome);
  }, [])

  return (
    <NavigationContainer>
      <Stack.Navigator 
        // initialRouteName={!welcome ? 'Welcome' : (Object.keys(user).length == 0 ? 'Home' : 'DashboadClientHome'))}
        initialRouteName={ 'Welcome' }
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right'
        }}
      >
        {!welcome && (
          <Stack.Group>
            <Stack.Screen name='Welcome' component={WelcomeView} />
          </Stack.Group>
        )}

        {welcome && (
          Object.keys(admin).length == 0
            ?
              <Stack.Group>
                <Stack.Screen name='Auth' component={AuthView} />
              </Stack.Group>
            :
              <Stack.Group>
                <Stack.Screen name='Home' component={HomeScreen} />
                <Stack.Screen name='ProfileUser' component={ProfileScreen} 
                  options={{
                    animation: 'fade_from_bottom'
                  }}
                />
                <Stack.Screen name='Settings' component={ParametresScreen}
                  options={{
                    animation:'slide_from_bottom'
                  }}
                />
                <Stack.Screen name='Discussion' component={MessageScreen} />
                <Stack.Screen name='DashboadVideoSdkLive' component={VideoLive} 
                  options={{
                    animation:'slide_from_bottom'
                  }}
                />
                <Stack.Screen name='Call' component={CallScreen}
                  options={{
                    animation:'slide_from_bottom'
                  }}
                />
              </Stack.Group>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default GenerateView;