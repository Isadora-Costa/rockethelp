import { CaretLeft } from 'phosphor-react-native';
import { useNavigation } from '@react-navigation/native';
import { Heading, HStack, IconButton, useTheme, StyledProps } from 'native-base';

type Props = StyledProps & {
  title: string;
}

export function Header({ title, ...rest }: Props) {
  const { colors } = useTheme();
  const navigation = useNavigation();

  function handleGoBack() {
    navigation.goBack();
  }

  return (
    <HStack
      w="full"
      justifyContent="space-between"
      alignItems="center"
      bg="gray.600"
      pb={5}
      pt={10}
      {...rest}
    >
      <IconButton
        icon={<CaretLeft color={colors.gray[200]} size={24} />}
        ml={-2}
        onPress={handleGoBack}
      />

      <Heading
        color="gray.100"
        textAlign="center"
        fontFamily="heading"
        fontSize="lg"
        flex={1}
        ml={-7}
      >
        {title}
      </Heading>
    </HStack>
  );
}