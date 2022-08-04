import { Alert } from 'react-native';
import { useEffect, useState } from 'react';

import { useNavigation } from '@react-navigation/native';
import { dateFormat } from '../utils/firestoreDateFormat';
import { ChatTeardropText, SignOut } from 'phosphor-react-native';
import { VStack, HStack, IconButton, useTheme, Text, Heading, FlatList, Center } from 'native-base';

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

import { Filter } from "../components/Filter";
import { Button } from "../components/Button";
import { Loading } from '../components/Loading';
import Logo from '../assets/images/logo_secondary.svg';
import { Order, OrderProps } from "../components/Order";

export function Home() {
  const { colors } = useTheme();

  const [isLoading, setIsLoading] = useState(true);
  const [statusSelected, setStatusSelected] = useState<'open' | 'closed'>('open');
  const [orders, setOrders] = useState<OrderProps[]>([]);

  const navigation = useNavigation();

  function handleNewOrder() {
    navigation.navigate('order');
  }

  function handleOpenDetails(orderId: string) {
    navigation.navigate('orderDetails', { orderId });
  }

  function handleSignOut() {
    auth()
      .signOut()
      .catch(error => {
        console.log(error)
        return Alert.alert('Sign-out', 'An error occurred, failed to sign-out.')
      });
  }

  useEffect(() => {
    setIsLoading(true);

    const registeringUser = firestore()
      .collection('orders')
      .where('status', '==', statusSelected)
      .onSnapshot(snapshot => {
        const data = snapshot.docs.map(doc => {
          const { patrimony, description, status, created_at } = doc.data();

          return {
            id: doc.id,
            patrimony,
            description,
            status,
            when: dateFormat(created_at)
          }
        });

        setOrders(data);
        setIsLoading(false);
      });

    return registeringUser;
  }, [statusSelected]);

  return (
    <VStack flex={1} pb={6} bg="gray.700">
      <HStack
        w="full"
        justifyContent="space-between"
        align-items="center"
        bg="gray.600"
        pt={12}
        pb={4}
        px={5}
        top={1}
      >
        <Logo />

        <IconButton
          mt={-2.5}
          icon={<SignOut size={26} color={colors.gray[300]} />}
          onPress={handleSignOut}
        />
      </HStack>

      <VStack flex={1} px={6}>
        <HStack w="full" mt={10} mb={4} justifyContent="space-between" alignItems="center">

          <Heading fontFamily="heading" color="gray.100" >
            Solicitações
          </Heading>

          <Text color="gray.200">
            {orders.length}
          </Text>
        </HStack>

        <HStack space={3} mb={8}>
          <Filter
            type="open"
            title="In progress"
            onPress={() => setStatusSelected('open')}
            isActive={statusSelected === 'open'}
          />
          <Filter
            type="closed"
            title="Finished"
            onPress={() => setStatusSelected('closed')}
            isActive={statusSelected === 'closed'}
          />
        </HStack>

        {
          isLoading ? <Loading /> :
            <FlatList
              data={orders}
              keyExtractor={item => item.id}
              renderItem={({ item }) => <Order data={item} onPress={() => handleOpenDetails(item.id)} />}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                paddingBottom: 70
              }}

              ListEmptyComponent={() => (
                <Center>

                  <ChatTeardropText color={colors.gray[400]} size={45} />
                  <Text color="gray.300" fontSize="lg" mt={6} textAlign="center">
                    You don't have {'\n'}
                    any {statusSelected === 'open' ? 'open' : 'closed'} orders yet.
                  </Text>

                </Center>
              )}
            />
        }

        <Button title="New order" onPress={handleNewOrder} />
      </VStack>
    </VStack >
  )
}