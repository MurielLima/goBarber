import styled from 'styled-components/native';
import { getBottomSpace} from 'react-native-iphone-x-helper';

export const Container = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: 0 30px 100px;
  position:relative;
`;

export const Title = styled.Text`
  font-size: 20px;
  color: #f4ede8;
  font-family: 'RobotoSlab-Medium';
  margin: 24px 0 24px;
`;
export const UserAvatarButton = styled.TouchableOpacity`
margin-top: 32px;
`;
export const UserAvatar = styled.Image`
width:186px;
height:186px;
border-radius:98px;
margin-top:64px;
align-self:center;
`;

export const BackToDashboardButton = styled.TouchableOpacity`
margin-top:40px;
`;
export const BackToDashboardText = styled.Text``;
