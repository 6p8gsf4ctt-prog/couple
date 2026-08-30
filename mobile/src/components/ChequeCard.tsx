import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ChequeDraft } from '../types';
import { colors, radius, shadow, spacing, typography } from '../theme';

type Props = {
  cheque: ChequeDraft;
  used?: boolean;
  compact?: boolean;
};

export function ChequeCard({ cheque, used, compact }: Props) {
  return (
    <View style={[styles.card, compact && styles.compact]}>
      <View style={styles.stub}>
        <Text style={styles.stubHeart}>♡</Text>
        <View style={styles.stubLine} />
        <Text style={styles.stubText}>COUPLE</Text>
      </View>

      <View style={styles.perforation} />

      <View style={styles.body}>
        <Text style={styles.kicker}>BON POUR</Text>
        <Text numberOfLines={2} style={[styles.title, compact && styles.titleCompact]}>
          {cheque.title || '…'}
        </Text>
        <Text numberOfLines={compact ? 1 : 2} style={styles.message}>
          {cheque.message || 'Une attention rien que pour toi.'}
        </Text>

        <View style={styles.names}>
          <Text style={styles.meta}>POUR : <Text style={styles.script}>{cheque.to || 'Toi'}</Text></Text>
          <Text style={styles.meta}>DE : <Text style={styles.script}>{cheque.from || 'Moi'}</Text></Text>
        </View>
      </View>

      <View style={styles.seal}>
        <Text style={styles.sealText}>♡</Text>
      </View>

      {used && (
        <View style={styles.usedStamp}>
          <Text style={styles.usedText}>UTILISÉ</Text>
          <Text style={styles.usedHeart}>♡</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    minHeight: 220,
    backgroundColor: colors.paper,
    borderRadius: radius.l,
    flexDirection: 'row',
    position: 'relative',
    overflow: 'visible',
    borderWidth: 1,
    borderColor: '#E7DCCF',
    ...shadow,
  },
  compact: {
    minHeight: 176,
  },
  stub: {
    width: 52,
    alignItems: 'center',
    paddingVertical: spacing.m,
    justifyContent: 'space-between',
  },
  stubHeart: {
    color: colors.burgundy,
    fontSize: 18,
  },
  stubLine: {
    width: 1,
    height: 20,
    backgroundColor: colors.line,
  },
  stubText: {
    transform: [{ rotate: '-90deg' }],
    letterSpacing: 2.4,
    color: colors.muted,
    fontSize: 9,
    width: 70,
    textAlign: 'center',
  },
  perforation: {
    width: 1,
    borderStyle: 'dashed',
    borderLeftWidth: 1,
    borderColor: '#BCA99B',
    marginVertical: 8,
  },
  body: {
    flex: 1,
    paddingHorizontal: spacing.l,
    paddingVertical: spacing.l,
    alignItems: 'center',
  },
  kicker: {
    fontFamily: typography.editorial,
    fontSize: 25,
    letterSpacing: 2.4,
    color: colors.burgundy,
    marginBottom: 14,
  },
  title: {
    fontFamily: typography.editorial,
    fontStyle: 'italic',
    fontSize: 24,
    textAlign: 'center',
    color: colors.graphite,
    marginBottom: 8,
  },
  titleCompact: {
    fontSize: 21,
  },
  message: {
    fontFamily: typography.editorial,
    fontStyle: 'italic',
    fontSize: 15,
    textAlign: 'center',
    color: colors.muted,
    lineHeight: 21,
    minHeight: 42,
  },
  names: {
    width: '100%',
    marginTop: 'auto',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  meta: {
    fontFamily: typography.ui,
    fontSize: 10,
    letterSpacing: 1,
    color: colors.muted,
  },
  script: {
    fontFamily: typography.editorial,
    fontStyle: 'italic',
    fontSize: 16,
    color: colors.graphite,
  },
  seal: {
    position: 'absolute',
    right: -18,
    top: '42%',
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.blush,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E8C8BF',
  },
  sealText: {
    fontSize: 22,
    color: colors.white,
  },
  usedStamp: {
    position: 'absolute',
    right: 48,
    top: 86,
    width: 74,
    height: 74,
    borderRadius: 37,
    borderWidth: 2,
    borderColor: 'rgba(122,48,54,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ rotate: '-9deg' }],
    backgroundColor: 'rgba(251,247,239,0.72)',
  },
  usedText: {
    color: colors.burgundy,
    fontSize: 10,
    letterSpacing: 1.2,
    fontWeight: '700',
  },
  usedHeart: {
    color: colors.burgundy,
    fontSize: 16,
    marginTop: 2,
  },
});
