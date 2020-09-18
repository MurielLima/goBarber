import React, { useEffect, useState, useCallback} from 'react';
import {View} from 'react-native';
import { useNavigation} from 'react-router-dom';
import { useAuth } from '../../hook/auth';
import api from '../../services/api';
import { Container, Header, HeaderTitle, UserName, ProfileButton, UserAvatar, ProvidersList, ProvidersListTitle, ProviderContainer, ProviderAvatar, ProviderInfo, ProviderMeta, ProviderMetaText} from './styles';

export interface Provider{
  id:string;
  name:string;
}

const Dashboard: React.FC = () => {
  const [providers, setProviders] = useState<Provider[]>([]);
const { user } = useAuth();
const {navigate } = useNavigation();

useEffect(()=>{
  api.get<Provider>('/providers').then(response =>{
    setProviders(response.data);
  });
},[]);

const navigateProfile = useCallback(()=>{
  navigate('Profile');
},[navigate]);
const navigateToCreateAppointment = useCallback((providerId: string)=>{
navigate('CreateAppointment', {providerId});
},[navigate]);

  return (<Container>
    <Header>
      <HeaderTitle>
        Bem vindo, {"\n"}
        <UserName>{user.name}</UserName>
      </HeaderTitle>
      <ProfileButton onPress={navigateProfile}>
       <UserAvatar source={{uri:user.avatar_url}}/>
       </ProfileButton>
    </Header>
    <ProvidersList
    data={providers}
    keyExtractor={(provider) => provider.id}
    ListHeaderComponent={
      <ProvidersListTitle>Cabeleireiros</ProvidersListTitle>
    }
    renderItem={({item:provider})=>(
      <ProviderContainer onPress={()=>navigateToCreateAppointment(provider.id)}>
        <ProviderAvatar source={{uri:provider.avatar_url}}/>

        <ProviderInfo>
          <ProviderName>{provider.name}</ProviderName>
          
          <ProviderMeta>
            <Icon name="calendar" size={14} color="#ff9000"/>
            <ProviderMetaText>Segunda à sexta</ProviderMetaText>
          </ProviderMeta>

        </ProviderInfo>
      </ProviderContainer>
    )}
    >

    </ProvidersList>
  </Container>);
};
export default Dashboard;
