import { TextInput, StyleSheet, View, Text } from 'react-native';
import { Colors, FontSize, BorderRadius, Spacing } from '../constants/theme';

interface Props {
  placeholder?: string;
  value: string;
  onChangeText: (t: string) => void;
  label?: string;
  keyboardType?: any;
  autoFocus?: boolean;
  maxLength?: number;
  multiline?: boolean;
  numberOfLines?: number;
  leftIcon?: string;
  style?: any;
}

export default function Input({
  placeholder, value, onChangeText, label, keyboardType,
  autoFocus, maxLength, multiline, numberOfLines, leftIcon, style,
}: Props) {
  return (
    <View style={[styles.wrapper, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.inputRow}>
        {leftIcon ? <Text style={styles.leftIcon}>{leftIcon}</Text> : null}
        <TextInput
          style={[styles.input, leftIcon ? { paddingLeft: Spacing.sm } : {}, multiline ? styles.multiline : {}]}
          placeholder={placeholder}
          placeholderTextColor={Colors.textSecondary}
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          autoFocus={autoFocus}
          maxLength={maxLength}
          multiline={multiline}
          numberOfLines={numberOfLines}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginBottom: Spacing.md },
  label: {
    fontSize: FontSize.caption,
    color: Colors.mediumGray,
    marginBottom: Spacing.xs,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.lightGray,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
  },
  leftIcon: {
    fontSize: 16,
    marginRight: Spacing.xs,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: FontSize.body,
    color: Colors.text,
  },
  multiline: {
    height: 100,
    paddingTop: Spacing.md,
    textAlignVertical: 'top',
  },
});
