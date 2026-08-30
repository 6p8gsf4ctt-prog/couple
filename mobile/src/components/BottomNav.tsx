import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { colors, radius, shadow, typography } from '../theme';

export type Tab = 'home' | 'carnet' | 'ideas' | 'settings';

type Props = {
  active?: Tab;
  onHome: () => void;
  onCarnet: () => void;
  onIdeas: () => void;
  onSettings: () => void;
};

const items: Array<{ key: Tab; label: string; glyph: string }> = [
  { key: 'home', label: 'Accueil', glyph: '⌂' },
  { key: 'carnet', label: 'Carnet', glyph: '▤' },
  { key: 'ideas', label: 'Idées', glyph: '◇' },
  { key: 'settings', label: 'Réglages', glyph: '○' },
];

export function BottomNav({
  active,
  onHome,
  onCarnet,
  onIdeas,
  onSettings,
}: Props) {
  const actions = { home: onHome, carnet: onCarnet, ideas: onIdeas, settings: onSettings };

  return (
    <View style={styles.wrap}>
      {items.map((item) => (
        <Pressable
          key={item.key}
          hitSlop={8}
          onPress={async () => {
            await Haptics.selectionAsync();
            actions[item.key]();
          }}
          style={({ pressed }) => [styles.item, pressed && styles.pressed]}
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
    bottom: 10,
    left: 18,
    right: 18,
    height: 62,
    borderRadius: radius.xl,
    backgroundColor: 'rgba(251,247,239,0.98)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderWidth: 1,
    borderColor: colors.line,
    ...shadow,
  },
  item: {
    flex: 1,
    minHeight: 54,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 1,
  },
  pressed: {
    opacity: 0.62,
  },
  glyph: {
    color: colors.muted,
    fontSize: 18,
    lineHeight: 21,
  },
  label: {
    fontFamily: typography.ui,
    color: colors.muted,
    fontSize: 10,
  },
  active: {
    color: colors.burgundy,
    fontWeight: '700',
  },
});
