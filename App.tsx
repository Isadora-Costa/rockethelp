import React from 'react';
import { NativeBaseProvider, StatusBar } from 'native-base';
import { Routes } from './src/routes';
import { Loading } from './src/components/Loading';
import { THEME } from './src/styles/theme';
import { useFonts, Roboto_700Bold, Roboto_400Regular } from '@expo-google-fonts/roboto';

export default function App() {
  const [fontsLoaded] = useFonts({Roboto_400Regular, Roboto_700Bold})
  return (
    <NativeBaseProvider theme={THEME}>

      <StatusBar 
        barStyle="light-content"
        translucent={true}
        backgroundColor={"transparent"}
      />
      
      { fontsLoaded ? <Routes /> : <Loading /> }
    </NativeBaseProvider>
  );
}
