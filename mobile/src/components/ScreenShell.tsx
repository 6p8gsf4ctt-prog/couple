import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { colors, spacing, typography } from '../theme';

type Props = {
  children: React.ReactNode;
  title?: string;
  onBack?: () => void;
  onHome?: () => void;
  scroll?: boolean;
  contentStyle?: ViewStyle;
};

export function ScreenShell({ children, title, onBack, onHome, scroll = true, contentStyle }: Props) {
  const content = (
    <View style={[styles.content, contentStyle]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack ?? onHome} style={styles.headerSide}>
          <Text style={styles.headerAction}>{onBack ? '‹' : ''}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onHome} disabled={!onHome}>
          <Text style={styles.brand}>{title ?? 'COUPLE'}</Text>
        </TouchableOpacity>
        <View style={styles.headerSide} />
      </View>
      {children}
    </View>
  );

  return (
    <SafeAreaView style={styles.safe}>
      {scroll ? (
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {content}
        </ScrollView>
      ) : (
        content
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.ivory,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.l,
    paddingBottom: 96,
  },
  header: {
    minHeight: 70,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerSide: {
    width: 44,
    height: 44,
    justifyContent: 'center',
  },
  headerAction: {
    fontSize: 36,
    color: colors.graphite,
    lineHeight: 38,
  },
  brand: {
    fontFamily: typography.editorial,
    letterSpacing: 4.5,
    color: colors.graphite,
    fontSize: 17,
  },
});
