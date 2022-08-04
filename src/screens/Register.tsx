import { useState } from 'react';
import { VStack } from 'native-base';
import { Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';

import { Header } from '../components/Header';
import { Input } from '../components/Input';
import { Button } from '../components/Button';

export function Register() {
  const [isLoading, setIsLoading] = useState(false);
  const [patrimony, setPatrimory] = useState('');
  const [description, setDescription] = useState('');
  const navigation = useNavigation();

  function handleNewOrderRegister() {
    if (!patrimony || !description) {
      return Alert.alert('Register', 'Please fill in all fields.');
    }

    setIsLoading(true);

    firestore()
      .collection('orders')
      .add({
        patrimony,
        description,
        status: 'open',
        created_at: firestore.FieldValue.serverTimestamp()
      })
      .then(() => {
        Alert.alert('Order', 'Order registered successfully.');
        navigation.goBack();
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
        return Alert.alert('Order', 'Could no register order');
      })
  }

  return (
    <VStack flex={1} p={6} bg="gray.600">
      <Header mt={-4} title="Order" fontFamily="heading" />

      <Input
        placeholder="Patrimony number"
        onChangeText={setPatrimory}
        mt={4}
      />

      <Input
        placeholder="Problem description."
        onChangeText={setDescription}
        flex={1}
        mt={5}
        multiline
        textAlignVertical="top"
      />

      <Button
        title="Register"
        mt={5}
        isLoading={isLoading}
        onPress={handleNewOrderRegister}
      />
    </VStack>
  );
}