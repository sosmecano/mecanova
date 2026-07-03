import { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { Colors, FontSize, Spacing } from '../constants/theme';
import Button from '../components/Button';
import Input from '../components/Input';
import { api } from '../services/api';
import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'auth_token';
const REFRESH_KEY = 'refresh_token';
const USER_TYPE_KEY = 'userType';

export default function LoginScreen({ navigation }: any) {
  const [phone, setPhone] = useState('+225 ');
  const [code, setCode] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [otpCode, setOtpCode] = useState('');

  const cooldownTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => { if (cooldownTimer.current) clearInterval(cooldownTimer.current); };
  }, []);

  const sendOtp = async () => {
    setLoading(true);
    try {
      const data = await api.auth.sendOtp(phone);
      if (data.code) setOtpCode(data.code);
      setStep('otp');
      setCooldown(60);
      const timer = setInterval(() => {
        setCooldown(prev => {
          if (prev <= 1) { clearInterval(timer); return 0; }
          return prev - 1;
        });
      }, 1000);
      cooldownTimer.current = timer;
    } catch (e: any) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    setLoading(true);
    try {
      const res = await api.auth.verifyOtp(phone, code);
      await SecureStore.setItemAsync(TOKEN_KEY, res.token);
      await SecureStore.setItemAsync(REFRESH_KEY, res.refreshToken);
      if (res.role === 'admin') {
        await SecureStore.setItemAsync(USER_TYPE_KEY, 'admin');
        navigation.replace('AdminTabs');
      } else {
        await SecureStore.setItemAsync(USER_TYPE_KEY, 'client');
        navigation.replace('ClientTabs');
      }
    } catch (e: any) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.inner}>
        <View style={styles.logoRow}>
          <Text style={styles.logoIcon}>🔧</Text>
        </View>
        <Text style={styles.title}>MecaCI</Text>
        <Text style={styles.subtitle}>Le mécanicien à portée de main</Text>

        <View style={styles.form}>
          {step === 'phone' ? (
            <>
              <Input
                label="Numéro de téléphone"
                placeholder="+225 01 01 01 01 01"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                maxLength={20}
              />
              <Button
                title="Continuer"
                onPress={sendOtp}
                loading={loading}
                disabled={phone.replace(/\s/g, '').length < 10}
              />
            </>
          ) : (
            <>
              <Text style={styles.info}>Code envoyé au {phone}</Text>
              {otpCode ? (
                <Text style={styles.otpDisplay}>{otpCode}</Text>
              ) : null}
              <Input
                label="Code de vérification"
                placeholder="123456"
                value={code}
                onChangeText={setCode}
                keyboardType="number-pad"
                maxLength={6}
                autoFocus
              />
              {cooldown > 0 && <Text style={styles.cooldown}>Renvoyer dans {cooldown}s</Text>}
              <Button title="Se connecter" onPress={verifyOtp} loading={loading} disabled={code.length < 6} />
              <TouchableOpacity onPress={() => { setStep('phone'); setCode(''); }}>
                <Text style={styles.backLink}>Modifier le numéro</Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        <View style={styles.footer}>
          <TouchableOpacity onPress={() => navigation.navigate('ProLogin')}>
            <Text style={styles.proLink}>Espace professionnel</Text>
          </TouchableOpacity>
          <Text style={styles.terms}>
            En continuant, vous acceptez nos{' '}
            <Text style={styles.termsLink}>Conditions d'utilisation</Text>
          </Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  inner: {
    flex: 1,
    justifyContent: 'center',
    padding: Spacing.xl,
  },
  logoRow: {
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  logoIcon: {
    fontSize: 48,
  },
  title: {
    fontSize: FontSize.largeTitle,
    fontWeight: '800',
    color: Colors.black,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: FontSize.body,
    color: Colors.mediumGray,
    textAlign: 'center',
    marginBottom: Spacing.xxl,
  },
  form: {
    marginBottom: Spacing.xl,
  },
  cooldown: {
    textAlign: 'center',
    color: Colors.mediumGray,
    fontSize: FontSize.caption,
    marginBottom: Spacing.sm,
  },
  info: {
    fontSize: FontSize.body,
    color: Colors.mediumGray,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  otpDisplay: {
    fontSize: 32,
    fontWeight: '700',
    letterSpacing: 4,
    textAlign: 'center',
    color: Colors.black,
    backgroundColor: '#E8F0FE',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginBottom: Spacing.lg,
    overflow: 'hidden',
  },
  backLink: {
    textAlign: 'center',
    color: Colors.mediumGray,
    fontSize: FontSize.body,
    marginTop: Spacing.md,
    textDecorationLine: 'underline',
  },
  footer: {
    alignItems: 'center',
    gap: Spacing.md,
  },
  proLink: {
    color: Colors.black,
    fontSize: FontSize.body,
    fontWeight: '600',
  },
  terms: {
    color: Colors.textSecondary,
    fontSize: FontSize.caption,
    textAlign: 'center',
    marginTop: Spacing.sm,
  },
  termsLink: {
    textDecorationLine: 'underline',
    color: Colors.mediumGray,
  },
});