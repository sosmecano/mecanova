import { useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { Colors, FontSize } from '../constants/theme';
import { api } from '../services/api';

const TOKEN_KEY = 'auth_token';
const REFRESH_KEY = 'refresh_token';
const USER_TYPE_KEY = 'userType';

export default function SplashScreen({ navigation }: any) {
  useEffect(() => {
    (async () => {
      try {
        const token = await SecureStore.getItemAsync(TOKEN_KEY);
        const userType = await SecureStore.getItemAsync(USER_TYPE_KEY);

        if (!token) {
          navigation.replace('Login');
          return;
        }

        if (userType === 'admin') {
          await api.admin.dashboard();
          navigation.replace('AdminTabs');
        } else if (userType === 'pro') {
          await api.professionals.me();
          navigation.replace('ProTabs');
        } else {
          await api.users.me();
          navigation.replace('ClientTabs');
        }
      } catch {
        await SecureStore.deleteItemAsync(TOKEN_KEY);
        await SecureStore.deleteItemAsync(REFRESH_KEY);
        await SecureStore.deleteItemAsync(USER_TYPE_KEY);
        navigation.replace('Login');
      }
    })();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.icon}>🔧</Text>
      <Text style={styles.title}>MecaCI</Text>
      <ActivityIndicator size="large" color={Colors.black} style={styles.spinner} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.white,
  },
  icon: {
    fontSize: 64,
    marginBottom: 16,
  },
  title: {
    fontSize: FontSize.largeTitle,
    fontWeight: '800',
    color: Colors.black,
    letterSpacing: -0.5,
  },
  spinner: {
    marginTop: 32,
  },
});