import AuthRoutes from './auth.routes';
import React from 'react';
import {ActivityIndicator, View} from 'react-native';
import {useAuth} from '../hook/auth';
import AppRoutes from './app.routes';

const Routes: React.FC = () => {
  const {user, loading} = useAuth();
  if (loading) {
    return (
      <View>
        <ActivityIndicator color="#9999" />
      </View>
    );
  }
  return user ? <AppRoutes /> : <AuthRoutes />;
};
