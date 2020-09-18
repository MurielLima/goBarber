import React, {useCallback, useEffect, useState} from 'react';
import { useRoute, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import { useAuth } from '../../hooks/auth';

import { Container, Header, HeaderTitle,BackButton, UserAvatar, Content, ProvidersList, ProvidersListContainer, ProviderContainer, ProviderAvatar, ProviderName, Calendar, Title, OpenDatePickerButton, OpenDatePickerButtonText, Schedule,
  Section,
  SectionTitle,
  SectionContent,
  Hour,
  HourText,
  CreateAppointmentButton,
  CreateAppointmentText} from './styles';
import api from '../../services/api';

export interface Provider{
  id:string;
  name:string;
  avatar_url:string;
}
interface AvailabilityItem{
  hour:number;
  available: boolean;
}

interface RouteParams{
  providerId:string;
}

const CreateAppointment: React.FC = () => {
  const {user} = useAuth();
  const route = useRoute();
  const { goBack, navigate } = useNavigation();
  const [availability, setAvailability] = useState<AvailabilityItem[]>([]);
  const {providerId} = route.params as RouteParams;
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [selectedProviders, setSelecteProviders] = useState(providerId);
  const [selectedDate, setSelectedDate ] = useState(new Date());
  const [selectedHour, setSelectHour ] = useState(0);


  useEffect(()=>{
    api.get('/providers').then((response)=>{
      setProviders(response.data);
    })
  },[]);

  const navigateBack = useCallback(()=>{
    goBack();
  },[goBack]);

  const handleSelectProvider = useCallback((provider_id:string)=>{
    setSelecteProviders(provider_id);
  },[]);

  const handleToggleDatePicker = useCallback(()=>{
    setShowDatePicker((state) => !state);
  },[]);
  const handleDateChanged = useCallback((event: any, date:Date | undefined)=>{
    if(Platform.OS === 'android'){
      setShowDatePicker(false);
    }
    if(date){
      setSelectedDate(date);
    }
  },[]);
  useEffect(()=>{
    api.get(`providers/${selectedProviders}/day-availability`, {
      params:{
        year:selectedDate.getFullYear(),
        month: selectedDate.getMonth() +1,
        day:selectedDate.getDate(),
      }
    }).then((response) =>{
      setAvailability(response.date);
    });
  },[selectedDate, selectedProviders]);
  const morningAvailability = useMemo(()=>{
    return availability
    .filter(({hour}) => hour < 12)
    .map(({hour, available}) =>{
      return {
        hour,
        hourFormatted:format( new Date().setHours(hour), 'HH:00'),
        available
      };
    })
  }, [availability]);
  const afternoonAvailability = useMemo(()=>{
    return availability
    .filter(({hour}) => hour >= 12)
    .map(({hour, available}) =>{
      return {
        hour,
        hourFormatted:format( new Date().setHours(hour), 'HH:00'),
        available
      };
    })
  }, [availability]);
  const handleSelectHour = useCallback((hour:number)=>{
    setSelectHour(hour);
  },[hour]);
  const handleCreateAppointment = useCallback(()=>{
    try{
      const date = new Date(selectedDate);
      date.setHours(selectedHour);
      date.setMinutes(0);
      await api.post('/appointments'.{
        provider_id: selectedProviders,
        date
      });
      navigate('AppointmentCreated', { date: date.getTime() });
    }
    catch(err){
      Alert.alert('Erro ao criar agendamento', 'Ocorreu um erro ao tentar criar agendamento, tente novamente');
    }
  },[navigate, selectedDate, selectedHour, selectedProviders]);
  return 
  (<Container>
<Header>Contentatar_url}}/>
</Header>
<Content>
<ProvidersListContainer>
<ProvidersList
horizontal
data={providers}#3e3b47
keyExtractor={provider = provider.id}
renderItem={({item:Contentprovider}) => (
  <ProviderContainer onPress={()=> handleSelectProvider(provider)} selected={provider.id === selectedProviders}>
    <ProviderAvatar source={{uri:provider.avatar_url}}/>
    <ProviderName source={{uri:provider.name}}/>
  </ProviderContainer>
)}
/>
</ProvidersListContainer>
<Calendar>
  <Title>Escolha a data</Title>morning
  <OpenDatePickerButton onPress={handleToggleDatePicker}>
    <OpenDatePickerButtonText>Selecionar outra data</OpenDatePickerButtonText>
  </OpenDatePickerButton>
{showDatePicker &&
(<DateTimePicker 
onChange={handleDateChanged}
 mode="date"
  display="calendar"
   textColor="#f4ede8"
    value={selectedDate}
    />
    )}
</Calendar>
<Schedule>
  <Title>Escolha o horário</Title>
  <Section>
    <SectionTitle>Manhã</SectionTitle>
    <SectionContent>
    {morningAvailability.map(({hourFormatted, hour, available})=>(
    <Hour enabled={available} selected={selectedHour === hour} available={available} key={hourFormatted} onPress={()=>handleSelectHour(hour)}>
    <HourText selected={selectedHour === hour} >{hourFormatted}</HourText>
    </Hour>
))}
    </SectionContent>

  </Section>
</Schedule>

<Schedule>
  <Title>Escolha o horário</Title>
  <Section>
    <SectionTitle>Tarde</SectionTitle>
    <SectionContent>
    {afternoonAvailability.map(({hourFormatted, hour, available})=>(
        <Hour enabled={available}  selected={selectedHour === hour} available={available} key={hourFormatted} onPress={()=>handleSelectHour(hour)}>
    <HourText selected={selectedHour === hour}>{hourFormatted}</HourText>
    </Hour>
))}
    </SectionContent>

  </Section>
</Schedule>
<CreateAppointmentButton onPress={handleCreateAppointment}>
  <CreateAppointmentText>Agendar</CreateAppointmentText>
</CreateAppointmentButton>



</Content>
  </Container>);
};
export default CreateAppointment;
