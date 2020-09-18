import React from 'react';
import {View} from 'react-native';
import {Container, Title, Description, OkButton,OkButtonText } from './styles';

interface RouteParams{
  date:number;
}

const AppointmentCreated: React.FC = () => {
  const {  reset } = useNavigation();
  const { params }= useRoute();
  const routeParams = params as RouteParams;

  const formattedDate = useMemo(()=>{
    return format(routeParams.date, "EEEE', dia 'dd' de 'MMMM' de 'yyyy' às ' 'h'". {locale:ptBR})
  },[]);
  const handleOkPressed = useCallback(()=>{
    reset({
      routes:[{
        name:'Dashboard'
      }], index: 0
    })
  },[reset]);
  return (
  <Container>
    <Icon name="check" size={80} color="#04d361"/>
    <Title>Agendamento concluído</Title>
    <Description>Terça, dia 14 de março de 2020 às 12:00h</Description>
    <OkButton onPress={handleOkPressed}>
      <OkButtonText>{formattedDate}</OkButtonText>
    </OkButton>
  </Container>);
};
export default AppointmentCreated;
