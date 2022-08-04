import React, { useState } from 'react';
import auth from '@react-native-firebase/auth';
import { Alert, Dimensions } from 'react-native';
import Logo from '../assets/images/logo_primary.svg';
import { Envelope, Key } from 'phosphor-react-native';
import { Heading, VStack, Icon, useTheme, Box } from 'native-base';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { Input } from '../components/Input';
import { Button } from '../components/Button';

export function SignIn() {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { colors } = useTheme();

  function handleSignIn() {
    if (!email || !password) {
      return Alert.alert('Sign-in', 'Please inform e-mail and password.');
    }

    setIsLoading(true);

    auth()
      .signInWithEmailAndPassword(email, password)
      .catch((error) => {
        console.log(error);
        setIsLoading(false);

        if (error.code === 'auth/invalid-email') {
          return Alert.alert('Sign-in', 'Invalid e-mail.');
        }

        if (error.code === 'auth/user-not-found') {
          return Alert.alert('Sign-in', 'Invalid password or e-mail.');
        }

        if (error.code === 'auth/wrong-password') {
          return Alert.alert('Sign-in', 'Invalid password or e-mail.');
        }

        return Alert.alert('Sign-in', 'Failed to access.');
      });
  }

  return (

    <KeyboardAwareScrollView
      contentContainerStyle={{
        flex: 1,
        backgroundColor: colors.gray[600],
        minHeight: Dimensions.get('window').height
      }}
      enableOnAndroid
    >
      <VStack flex={1} alignItems="center" bg="gray.600" px={8} pt={24}>

        <Logo />

        <Heading
          color="gray.100"
          fontSize="xl"
          fontFamily="heading"
          mt={20} mb={6}
        >
          Access Your Account
        </Heading>

        <Input
          placeholder="E-mail"
          mb={4}
          InputLeftElement=
          {<Icon as={<Envelope color={colors.gray[300]} />}
            ml={4}
          />}
          onChangeText={setEmail}
        />

        <Input
          placeholder="Password"
          mb="4"
          InputLeftElement=
          {<Icon as={<Key color={colors.gray[300]} />}
            ml={4}
          />}
          secureTextEntry
          onChangeText={setPassword}
        />

        <Button
          title="Sign-in"
          w="full"
          onPress={handleSignIn}
          isLoading={isLoading}
        />
      </VStack >
    </KeyboardAwareScrollView >
  )
}