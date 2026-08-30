import React, { useMemo, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  PanResponder,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { ChequeDraft } from '../types';
import { colors, radius, shadow, spacing, typography } from '../theme';
import { ChequeCard } from './ChequeCard';

const MAX_PULL = 230;
const RELEASE_THRESHOLD = 118;

type Props = {
  cheque: ChequeDraft;
  onRevealed: () => void;
};

export function EnvelopeReveal({ cheque, onRevealed }: Props) {
  const pull = useRef(new Animated.Value(0)).current;
  const [committed, setCommitted] = useState(false);

  const flapRotate = pull.interpolate({
    inputRange: [-MAX_PULL, -40, 0],
    outputRange: ['-18deg', '-4deg', '0deg'],
    extrapolate: 'clamp',
  });

  const envelopeFade = pull.interpolate({
    inputRange: [-MAX_PULL, -150, 0],
    outputRange: [0.15, 0.88, 1],
    extrapolate: 'clamp',
  });

  const hintFade = pull.interpolate({
    inputRange: [-80, 0],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dy) > 4,
        onPanResponderMove: (_, g) => {
          if (committed) return;
          const dy = Math.min(0, Math.max(-MAX_PULL, g.dy * 0.86));
          pull.setValue(dy);
        },
        onPanResponderRelease: async (_, g) => {
          if (committed) return;
          const distance = Math.max(0, -g.dy);
          if (distance >= RELEASE_THRESHOLD) {
            setCommitted(true);
            await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            Animated.spring(pull, {
              toValue: -MAX_PULL,
              useNativeDriver: true,
              damping: 17,
              stiffness: 115,
              mass: 0.85,
            }).start(() => setTimeout(onRevealed, 180));
          } else {
            Animated.spring(pull, {
              toValue: 0,
              useNativeDriver: true,
              damping: 18,
              stiffness: 135,
            }).start();
          }
        },
      }),
    [committed, onRevealed, pull]
  );

  return (
    <View style={styles.stage}>
      <Text style={styles.forYou}>Pour toi</Text>
      <Text style={styles.subtitle}>Un moment à découvrir…</Text>

      <View style={styles.object}>
        <Animated.View
          {...panResponder.panHandlers}
          style={[
            styles.chequeWrap,
            {
              transform: [{ translateY: pull }],
            },
          ]}
        >
          <ChequeCard cheque={cheque} compact />
        </Animated.View>

        <Animated.View style={[styles.envelope, { opacity: envelopeFade }]}>
          <Animated.View
            style={[
              styles.flap,
              {
                transform: [{ perspective: 700 }, { rotateX: flapRotate }],
              },
            ]}
          />
          <View style={styles.front}>
            <View style={styles.seal}>
              <Text style={styles.sealText}>♡</Text>
            </View>
          </View>
        </Animated.View>
      </View>

      <Animated.View style={{ opacity: hintFade, alignItems: 'center' }}>
        <Text style={styles.hint}>Fais glisser le chèque vers le haut</Text>
        <Text style={styles.arrow}>↑</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  stage: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 22,
  },
  forYou: {
    fontFamily: typography.editorial,
    fontSize: 31,
    color: colors.graphite,
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: typography.editorial,
    fontStyle: 'italic',
    color: colors.muted,
    marginBottom: 52,
  },
  object: {
    width: '100%',
    height: 300,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  chequeWrap: {
    position: 'absolute',
    width: '88%',
    bottom: 54,
    zIndex: 1,
  },
  envelope: {
    width: '92%',
    height: 188,
    zIndex: 2,
    position: 'relative',
  },
  flap: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 105,
    backgroundColor: colors.paper,
    borderTopLeftRadius: radius.l,
    borderTopRightRadius: radius.l,
    borderWidth: 1,
    borderColor: colors.line,
  },
  front: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 136,
    borderRadius: radius.l,
    backgroundColor: '#F4EADC',
    borderWidth: 1,
    borderColor: colors.line,
    ...shadow,
  },
  seal: {
    position: 'absolute',
    top: -22,
    alignSelf: 'center',
    left: '50%',
    marginLeft: -23,
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: colors.blush,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sealText: {
    color: colors.white,
    fontSize: 24,
  },
  hint: {
    fontFamily: typography.ui,
    color: colors.muted,
    fontSize: 13,
  },
  arrow: {
    color: colors.burgundy,
    marginTop: 4,
    fontSize: 22,
  },
});
