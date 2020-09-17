import React, {
  createContext,
  useCallback,
  useState,
  useContext,
  useEffect,
} from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import api from '../services/api';

interface User{
  id:string;
  name:string;
  email:string;
  avatar_url:string;
}
interface SignInCredentials {
  email: string;
  password: string;
}
interface AuthContextData {
  user: User;
  loading: boolean;
  signIn(credentials: SignInCredentials):void;
}
interface AuthState {
  token: string;
  user: User;
}

const AuthContext = createContext({} as AuthContextData);

const AuthProvider: React.FC = ({children}) => {
  const [data, setData] = useState<AuthState>({} as AuthState);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function loadStorageData() {
      const token = await AsyncStorage.getItem('@GoBarber:token');
      const user = await AsyncStorage.getItem('@GoBarber:user');
      if (token && user) {
        api.defaults.headers.authorization = `Bearer ${token}`;
        setData({token: token, user: JSON.parse(user)});
      }
      setLoading(false);
    }
    loadStorageData();
  }, []);
  const signIn = useCallback(async ({email, password}: SignInCredentials) => {
    const response = await api.post('/sessions', {email, password});
    const {token, user} = response.data;
    await AsyncStorage.setItem('@GoBarber:token', token);
    await AsyncStorage.setItem(
      '@GoBarber:user',
      JSON.stringify(user),
    );
    api.defaults.headers.authorization = `Bearer ${token}`;
    setData({token, user});
  }, []);
  const signOut = useCallback(async () => {
    await AsyncStorage.removeItem('@GoBarber:token');
    await AsyncStorage.removeItem('@GoBarber:user');
    setData({} as AuthState);
  }, []);
  return (
    <AuthContext.Provider value={{user: data.user, signIn, signOut, loading}}>
      {children}
    </AuthContext.Provider>
  );
};

function useAuth(): AuthContextData {
  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error('useAuth must be used within an AuthContext');
  }
  return authContext;
}
export {AuthContext, AuthProvider, useAuth};
