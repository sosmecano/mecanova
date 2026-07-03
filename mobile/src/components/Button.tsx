import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Colors, FontSize, BorderRadius, Spacing } from '../constants/theme';

interface Props {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'black' | 'secondary' | 'sos' | 'outline';
  loading?: boolean;
  disabled?: boolean;
  style?: any;
}

export default function Button({ title, onPress, variant = 'primary', loading, disabled, style }: Props) {
  const config: Record<string, { bg: string; text: string; border?: string }> = {
    primary: { bg: Colors.primary, text: Colors.black },
    black: { bg: Colors.black, text: Colors.white },
    secondary: { bg: Colors.lightGray, text: Colors.black },
    sos: { bg: Colors.sos, text: Colors.white },
    outline: { bg: 'transparent', text: Colors.primary, border: Colors.primary },
  };

  const { bg, text: textColor, border } = config[variant] || config.primary;

  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor: bg },
        border ? { borderWidth: 1.5, borderColor: border } : {},
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={loading || disabled}
      activeOpacity={0.85}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? Colors.black : Colors.white} />
      ) : (
        <Text style={[styles.text, { color: textColor }]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 52,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
  },
  text: {
    fontSize: FontSize.body,
    fontWeight: '700',
  },
  disabled: {
    opacity: 0.4,
  },
});
