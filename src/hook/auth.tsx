import React, {
  createContext,
  useCallback,
  useState,
  useContext,
  useEffect,
} from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import api from '../services/api';
interface SignInCredentials {
  email: string;
  password: string;
}
interface AuthContextData {
  user: object;
  loading: boolean;
  signIn(credentials: SignInCredentials): void;
  signOut(): void;
}
interface AuthState {
  token: string;
  user: object;
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
        setData({token: token, user: JSON.parse(user)});
      }
      setLoading(false);
    }
    loadStorageData();
  }, []);
  const signIn = useCallback(async ({email, password}: SignInCredentials) => {
    const response = await api.post('/sessions', {email, password});

    await AsyncStorage.setItem('@GoBarber:token', response.data.token);
    await AsyncStorage.setItem(
      '@GoBarber:user',
      JSON.stringify(response.data.user),
    );
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