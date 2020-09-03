import React from 'react';
import {Image} from 'react-native';
import Button from '../../components/Button';
import Input from '../../components/Input';
import {Container, Title} from './styles';
import logoImg from '../../assets/logo.png';
const SignIn: React.FC = () => {
  return (
    <Container>
      <Image source={logoImg} />
      <Title>Faça seu logon</Title>
      <Input name="email" icon="mail" placeholder="E-mail"></Input>
      <Input name="password" icon="lock" placeholder="Senha"></Input>
      <Button
        onPress={() => {
          console.log('clicou');
        }}>
        Entrar
      </Button>
    </Container>
  );
};

export default SignIn;
