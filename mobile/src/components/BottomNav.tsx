import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { colors, radius, shadow, spacing, typography } from '../theme';

type Tab = 'carnet' | 'ideas' | 'settings';

type Props = {
  active?: Tab;
  onCarnet: () => void;
  onIdeas: () => void;
  onSettings: () => void;
};

const items: Array<{ key: Tab; label: string; glyph: string }> = [
  { key: 'carnet', label: 'Carnet', glyph: '▤' },
  { key: 'ideas', label: 'Idées', glyph: '◇' },
  { key: 'settings', label: 'Réglages', glyph: '○' },
];

export function BottomNav({ active, onCarnet, onIdeas, onSettings }: Props) {
  const actions = { carnet: onCarnet, ideas: onIdeas, settings: onSettings };
  return (
    <View style={styles.wrap}>
      {items.map((item) => (
        <Pressable
          key={item.key}
          onPress={async () => {
            await Haptics.selectionAsync();
            actions[item.key]();
          }}
          style={styles.item}
        >
          <Text style={[styles.glyph, active === item.key && styles.active]}>{item.glyph}</Text>
          <Text style={[styles.label, active === item.key && styles.active]}>{item.label}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    bottom: 18,
    left: spacing.l,
    right: spacing.l,
    height: 68,
    borderRadius: radius.xl,
    backgroundColor: 'rgba(251,247,239,0.96)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderWidth: 1,
    borderColor: colors.line,
    ...shadow,
  },
  item: {
    minWidth: 86,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  glyph: {
    color: colors.muted,
    fontSize: 20,
  },
  label: {
    fontFamily: typography.ui,
    color: colors.muted,
    fontSize: 11,
  },
  active: {
    color: colors.burgundy,
    fontWeight: '700',
  },
});
