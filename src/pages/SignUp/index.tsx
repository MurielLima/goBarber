import {
  Image,
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import Button from '../../components/Button';
import Input from '../../components/Input';
import {FormHandles} from '@unform/core';
import {Form} from '@unform/mobile';
import {useNavigation} from '@react-navigation/native';
import React, {useRef, useCallback, useContext} from 'react';
import {
  Container,
  Title,
  BackToSignInButton,
  BackToSignInButtonText,
} from './styles';
import logoImg from '../../assets/logo.png';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as Yup from 'yup';
import getValidationErrors from '../../utils/getValidationErrors';
import api from '../../services/api';

const SignUp: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const inputRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const navigation = useNavigation();
  interface SignUpFormData {
    name: string;
    email: string;
    password: string;
  }
  const handleSignUp = useCallback(async (data: SignUpFormData) => {
    formRef.current?.setErrors({});

    try {
      const schema = Yup.object().shape({
        name: Yup.string().required('Nome é obrigatório'),
        email: Yup.string()
          .required('E-mail é obrigatório')
          .email('Digite um e-mail válido'),
        password: Yup.string().min(6, 'Mínimo 6 caracteres'),
      });
      await schema.validate(data, {
        abortEarly: false,
      });
      await api.post('/session', data);
      Alert.alert(
        'Conta cadastrada com sucesso',
        'Você será redirecionado para fazer seu primeiro login',
      );
      navigation.goBack();
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const errors = getValidationErrors(err);
        formRef.current?.setErrors(errors);
        return;
      }
      Alert.alert(
        'Erro na autenticação',
        'Ocorreu um erro ao fazer login, cheque as credenciais.',
      );
    }
  }, []);
  return (
    <>
      <KeyboardAvoidingView
        style={{flex: 1}}
        enabled
        behavior={Platform.OS == 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={{flex: 1}}
          keyboardShouldPersistTaps="handled">
          <Container>
            <Image source={logoImg} />
            <View>
              <Title>Faça seu logon</Title>
            </View>
            <Form ref={formRef} onSubmit={handleSignUp}>
              <Input name="name" icon="user" placeholder="Nome" />
              <Input
                ref={inputRef}
                autoCorrect={false}
                autoCapitalize="none"
                name="email"
                icon="mail"
                placeholder="E-mail"
                onSubmitEditing={() => {
                  inputRef.current?.focus();
                }}
              />
              <Input
                ref={passwordRef}
                secureTextEntry
                name="password"
                icon="lock"
                placeholder="Senha"
                returnKeyType="next"
                onSubmitEditing={() => {
                  formRef.current?.submitForm();
                }}
              />
              <Button
                onPress={() => {
                  formRef.current?.submitForm();
                }}>
                Cadastrar
              </Button>
            </Form>
          </Container>
        </ScrollView>
        <BackToSignInButton
          onPress={() => {
            navigation.goBack();
          }}>
          <Icon name="arrowleft" size={20} color="#fff" />
          <BackToSignInButtonText>Voltar para logon</BackToSignInButtonText>
        </BackToSignInButton>
      </KeyboardAvoidingView>
    </>
  );
};

export default SignUp;
