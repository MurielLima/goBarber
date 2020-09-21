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
import { useAuth} from '../../hook';
import {
  Container,
  Title,
  UserAvatarButton,
  UserAvatar,
  BackToDashboardButton,
  BackToDashboardText
} from './styles';
import logoImg from '../../assets/logo.png';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as Yup from 'yup';
import getValidationErrors from '../../utils/getValidationErrors';
import api from '../../services/api';
/**
 * TODO INSERIR IMAGE EDITOR PARA REALIZAR RESIZE DE AVATAR
 */
const Profile: React.FC = () => {
  const {user} = useAuth();
  const formRef = useRef<FormHandles>(null);
  const inputRef = useRef<TextInput>(null);
  const old_passwordInputRef = useRef<TextInput>(null);
  const passwordInputRef = useRef<TextInput>(null);
  const password_confirmationInputRef = useRef<TextInput>(null);
  const navigation = useNavigation();
  interface ProfileFormData {
    name: string;
    email:string;
    password:string;
    old_password:string;
    password:string;
    password_confirmation:string;  
  }
  const handleProfile = useCallback(async (data: ProfileFormData) => {
    
    formRef.current?.setErrors({});

    try {
      const schema = Yup.object().shape({
        name: Yup.string().required('Nome é obrigatório'),
        email: Yup.string()
          .required('E-mail é obrigatório')
          .email('Digite um e-mail válido'),
        ols_password: Yup.string(),
        password: Yup.string().when('old_password',{
          is: val => !!val.length,
          then: Yup.string().required('Campo obrigatório'),
          otherwise: Yup.string()
        }),
        password_confirmation: Yup.string().when('old_password',{
          is: val => !!val.length,
          then: Yup.string().required('Campo obrigatório'),
          otherwise: Yup.string()
        }).oneOf(
          [Yup.ref('password'),null],'Confirmação incorreta'
        ),
      });
      await schema.validate(data, {
        abortEarly: false,
      });

    const { name, email, old_password, password, password_confirmation} = data;

    const formData = {
      name,
      email,
      ...( old_password ? {
      old_password,
      password,
      password_confirmation
    }: {})};
      const response = await api.put('/profile', formData);
      updateUser(response.data);
      Alert.alert(
        'Perfil atualizado com sucesso',
      );
      navigation.goBack();
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const errors = getValidationErrors(err);
        formRef.current?.setErrors(errors);
        return;
      }
      Alert.alert(
        'Erro na atualização de perfil',
        'Ocorreu um erro ao atualizar seu perfil, cheque as informações.',
      );
    }
  }, []);
  const handleUpdateAvatar = useCallback(()=>{
ImagePicker.showImagePicker({
  title: 'Selecione um avatar',
  cancelButtonTitle: 'Cancelar',
  takePhotoButtonTitle: 'Usar camêra',
  chooseFromLibraryButtonTitle: 'Escolher da galeria'
}, response=>{
  if(response.didCancel){
    console.log('User cancelled image picker.');
    return;
  }
   if(response.error){
     Alert.alert('Erro ao atualizar seu avatar');
    console.log('ImagePicker Error', response.error);
    return 
   }
   const data = new FormData();
   data.append('avatar',{
     type: 'image/jpeg',
     name: `${user.id}.jpg`,
     uri: response.uri,
   })
  api.patch('/users/avatar', data).then(response =>{
    updateUser(response.data);
  });
});
  },[user.id, updateUser]);
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
          <BackToDashboardButton
          onPress={() => {
            navigation.goBack();
          }}>
          <Icon name="arrowleft" size={24} color="#999591" />
          <BackToDashboardText>Voltar para logon</BackToDashboardText>
        </BackToDashboardButton>
<UserAvatarButton onPress={()=>{}}>
  <UserAvatar source={user.avatar_url}/>
</UserAvatarButton>
            <View>
              <Title>Meu Perfil</Title>
            </View>
            <Form initialData={user} ref={formRef} onSubmit={handleProfile}>
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
                ref={old_passwordInputRef}
                secureTextEntry
                name="old_password"
                icon="lock"
                containerStyle={{marginTop:24px}}
                placeholder="Senha atual"
                returnKeyType="next"
                onSubmitEditing={() => {
                  formRef.current?.submitForm();
                }}
                <Input
                ref={passwordInputRef}
                secureTextEntry
                name="password"
                icon="lock"
                placeholder="Nova senha"
                returnKeyType="next"
                onSubmitEditing={() => {
                  formRef.current?.submitForm();
                }}
              <Input
                ref={password_confirmationInputRef}
                secureTextEntry
                name="password_confirmation"
                icon="lock"
                placeholder="Confirmação de senha"
                returnKeyType="send"
                onSubmitEditing={() => {
                  formRef.current?.submitForm();
                }}
              />
              <Button
                onPress={() => {
                  formRef.current?.submitForm();
                }}>
                Confirmar mudanças
              </Button>
            </Form>
          </Container>
        </ScrollView>

      </KeyboardAvoidingView>
    </>
  );
};

export default Profile;
