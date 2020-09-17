import React from 'react';
import {View} from 'react-native';
import { useAuth } from '../../hook/auth';
import api from '../../services/api';
import { Header, HeaderTitle, UserName, ProfileButton, UserAvatar } from './styles';

interface Provider{
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

  return (<Container>
    <Header>
      <HeaderTitle>
        Bem vindo, {"\n"}
        <UserName>{user.name}</UserName>
      </HeaderTitle>
      <ProfileButton onPress={()=>{}}>
       <UserAvatar source={{uri:user.avatar_url}}/>
       </ProfileButton>
    </Header>
  </Container>);
};
export default Dashboard;
