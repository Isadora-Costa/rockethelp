import { useEffect, useState } from 'react';

import { OrderDto } from '../dtos/OrderDto';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Header } from '../components/Header';
import { Loading } from '../components/Loading';
import { OrderProps } from '../components/Order';
import { CardDetails } from '../components/CardDetails';
import { dateFormat } from '../utils/firestoreDateFormat';

import { Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { VStack, Text, HStack, useTheme, ScrollView } from 'native-base';
import { CircleWavyCheck, Hourglass, DesktopTower, ClipboardText } from 'phosphor-react-native';

import firestore from '@react-native-firebase/firestore';

type RouteParams = {
  orderId: string;
}

type OrderDetails = OrderProps & {
  description: string;
  solution: string;
  closed: string;
}

export function Details() {
  const route = useRoute();
  const { orderId } = route.params as RouteParams;

  const { colors } = useTheme();
  const navigation = useNavigation();
  const [solution, setSolution] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [order, setOrders] = useState<OrderDetails>({} as OrderDetails);

  function handleCloseOrder() {
    if (!solution) {
      return Alert.alert('Order', 'Inform solution to conclude order.');
    }

    firestore()
      .collection<OrderDto>('orders')
      .doc(orderId)
      .update({
        status: 'closed',
        solution,
        closed_at: firestore.FieldValue.serverTimestamp()
      })
      .then(() => {
        Alert.alert('Order', 'Order was concluded successfully.');
        navigation.goBack();
      })
      .catch((error) => {
        console.log(error);
        Alert.alert('Order', 'Failed to conclude order.');
      })
  }

  useEffect(() => {
    firestore()
      .collection<OrderDto>('orders')
      .doc(orderId)
      .get()
      .then((doc) => {
        const { patrimony, description, status, created_at, closed_at, solution } = doc.data();
        const closed = closed_at ? dateFormat(closed_at) : null;

        setOrders({
          id: doc.id,
          patrimony,
          description,
          status,
          solution,
          when: dateFormat(created_at),
          closed,
        })

        setIsLoading(false);
      })
  }, [])

  if (isLoading) {
    <Loading />
  }

  return (
    <VStack flex={1} bg="gray.700" pb={5}>
      <Header title="Order details" p={6} />

      <HStack bg="gray.500" justifyContent="center" p={4}>
        {
          order.status === "closed"
            ? <CircleWavyCheck size={22} color={colors.green[300]} />
            : <Hourglass size={22} color={colors.secondary[700]} />
        }

        <Text
          fontSize="sm"
          color={order.status === 'closed' ? colors.green[300] : colors.secondary[700]}
          ml={2}
          textTransform="uppercase"
        >
          {order.status === 'closed' ? 'finished' : 'in progress'}
        </Text>
      </HStack>

      <ScrollView mx={5} showsVerticalScrollIndicator={false}>
        <CardDetails
          title="equipment"
          description={`Patrimony ${order.patrimony}`}
          icon={DesktopTower}
        />

        <CardDetails
          title="problem description"
          description={order.description}
          icon={ClipboardText}
          footer={`Registered in ${order.when}`}
        />

        <CardDetails
          title="solution"
          icon={CircleWavyCheck}
          description={order.solution}
          footer={order.closed && `Closed in ${order.closed}`}
        >
          {
            order.status === 'open' &&
            <Input
              h={24}
              multiline
              bg="gray.600"
              textAlignVertical="top"
              onChangeText={setSolution}
              placeholder="Solution description"
            />
          }
        </CardDetails>
      </ScrollView>

      {
        order.status === 'open' &&
        <Button
          title="Conclude order"
          ml={5} mr={5} mt={5}
          onPress={handleCloseOrder}
        />
      }
    </VStack>
  );
}