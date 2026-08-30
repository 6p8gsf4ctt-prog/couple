import React, { useMemo, useRef, useState } from 'react';
import {
  Animated,
  PanResponder,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { ChequeDraft } from '../types';
import { colors, radius, shadow, typography } from '../theme';
import { ChequeCard } from './ChequeCard';

const MAX_PULL = 350;
const RELEASE_THRESHOLD = 195;
const RESISTANCE = 0.72;

type Props = {
  cheque: ChequeDraft;
  onRevealed: () => void;
};

export function EnvelopeReveal({ cheque, onRevealed }: Props) {
  const pull = useRef(new Animated.Value(0)).current;
  const thresholdReached = useRef(false);
  const [committed, setCommitted] = useState(false);

  // First part of the gesture opens the flap.
  const flapRotate = pull.interpolate({
    inputRange: [-100, 0],
    outputRange: ['-118deg', '0deg'],
    extrapolate: 'clamp',
  });

  // The cheque barely moves while the envelope opens, then progressively follows the finger.
  const chequeTranslate = pull.interpolate({
    inputRange: [-MAX_PULL, -110, -55, 0],
    outputRange: [-245, -20, 46, 60],
    extrapolate: 'clamp',
  });

  const chequeOpacity = pull.interpolate({
    inputRange: [-85, -25, 0],
    outputRange: [1, 0.72, 0.28],
    extrapolate: 'clamp',
  });

  const envelopeTranslate = pull.interpolate({
    inputRange: [-MAX_PULL, -150, 0],
    outputRange: [34, 10, 0],
    extrapolate: 'clamp',
  });

  const envelopeScale = pull.interpolate({
    inputRange: [-MAX_PULL, 0],
    outputRange: [0.965, 1],
    extrapolate: 'clamp',
  });

  const hintOpacity = pull.interpolate({
    inputRange: [-95, -15, 0],
    outputRange: [0.2, 0.72, 1],
    extrapolate: 'clamp',
  });

  const progressWidth = pull.interpolate({
    inputRange: [-RELEASE_THRESHOLD, 0],
    outputRange: ['100%', '0%'],
    extrapolate: 'clamp',
  });

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, gesture) =>
          !committed && Math.abs(gesture.dy) > 4 && Math.abs(gesture.dy) > Math.abs(gesture.dx),

        onPanResponderMove: async (_, gesture) => {
          if (committed) return;

          const resisted = Math.min(0, Math.max(-MAX_PULL, gesture.dy * RESISTANCE));
          pull.setValue(resisted);

          const distance = -resisted;
          if (distance >= RELEASE_THRESHOLD && !thresholdReached.current) {
            thresholdReached.current = true;
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          } else if (distance < RELEASE_THRESHOLD - 18) {
            thresholdReached.current = false;
          }
        },

        onPanResponderRelease: async (_, gesture) => {
          if (committed) return;

          const distance = Math.max(0, -gesture.dy * RESISTANCE);

          if (distance >= RELEASE_THRESHOLD) {
            setCommitted(true);

            Animated.timing(pull, {
              toValue: -MAX_PULL,
              duration: 620,
              useNativeDriver: false,
            }).start(async () => {
              await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              setTimeout(onRevealed, 320);
            });
          } else {
            thresholdReached.current = false;
            Animated.spring(pull, {
              toValue: 0,
              useNativeDriver: false,
              damping: 19,
              stiffness: 92,
              mass: 0.95,
            }).start();
          }
        },

        onPanResponderTerminate: () => {
          if (committed) return;
          thresholdReached.current = false;
          Animated.spring(pull, {
            toValue: 0,
            useNativeDriver: false,
            damping: 19,
            stiffness: 92,
          }).start();
        },
      }),
    [committed, onRevealed, pull]
  );

  return (
    <View style={styles.stage}>
      <Text style={styles.forYou}>Pour toi</Text>
      <Text style={styles.subtitle}>Quelque chose t’attend.</Text>

      <View style={styles.object}>
        <Animated.View
          {...panResponder.panHandlers}
          style={[
            styles.chequeWrap,
            {
              opacity: chequeOpacity,
              transform: [{ translateY: chequeTranslate }],
            },
          ]}
        >
          <ChequeCard cheque={cheque} compact />
        </Animated.View>

        <Animated.View
          style={[
            styles.envelope,
            {
              transform: [
                { translateY: envelopeTranslate },
                { scale: envelopeScale },
              ],
            },
          ]}
        >
          <Animated.View
            pointerEvents="none"
            style={[
              styles.flap,
              {
                transform: [
                  { perspective: 900 },
                  { rotateX: flapRotate },
                ],
              },
            ]}
          />

          <View pointerEvents="none" style={styles.front}>
            <View style={styles.frontFoldLeft} />
            <View style={styles.frontFoldRight} />
            <View style={styles.seal}>
              <Text style={styles.sealText}>♡</Text>
            </View>
          </View>
        </Animated.View>
      </View>

      <Animated.View style={[styles.instruction, { opacity: hintOpacity }]}>
        <Text style={styles.hint}>Tire doucement le chèque vers le haut</Text>
        <Text style={styles.detail}>L’enveloppe s’ouvre d’abord, puis le papier se libère.</Text>
        <View style={styles.progressTrack}>
          <Animated.View style={[styles.progressFill, { width: progressWidth }]} />
        </View>
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
    paddingBottom: 30,
  },
  forYou: {
    fontFamily: typography.editorial,
    fontSize: 32,
    color: colors.graphite,
    marginBottom: 7,
  },
  subtitle: {
    fontFamily: typography.editorial,
    fontStyle: 'italic',
    color: colors.muted,
    fontSize: 16,
    marginBottom: 56,
  },

  object: {
    width: '100%',
    height: 348,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  chequeWrap: {
    position: 'absolute',
    width: '88%',
    bottom: 55,
    zIndex: 1,
  },

  envelope: {
    width: '92%',
    height: 204,
    zIndex: 2,
    position: 'relative',
  },
  flap: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 124,
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
    height: 148,
    borderRadius: radius.l,
    backgroundColor: '#F4EADC',
    borderWidth: 1,
    borderColor: colors.line,
    overflow: 'hidden',
    ...shadow,
  },
  frontFoldLeft: {
    position: 'absolute',
    width: '58%',
    height: 1,
    backgroundColor: '#DDCDBA',
    left: -18,
    top: 67,
    transform: [{ rotate: '31deg' }],
  },
  frontFoldRight: {
    position: 'absolute',
    width: '58%',
    height: 1,
    backgroundColor: '#DDCDBA',
    right: -18,
    top: 67,
    transform: [{ rotate: '-31deg' }],
  },
  seal: {
    position: 'absolute',
    top: -23,
    left: '50%',
    marginLeft: -24,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.blush,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E8C8BF',
  },
  sealText: {
    color: colors.white,
    fontSize: 25,
  },

  instruction: {
    marginTop: 24,
    width: '82%',
    alignItems: 'center',
  },
  hint: {
    fontFamily: typography.ui,
    color: colors.graphite,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  detail: {
    marginTop: 5,
    fontFamily: typography.ui,
    color: colors.muted,
    fontSize: 11,
    lineHeight: 16,
    textAlign: 'center',
  },
  progressTrack: {
    marginTop: 15,
    width: '64%',
    height: 3,
    borderRadius: 3,
    backgroundColor: colors.paperDeep,
    overflow: 'hidden',
  },
  progressFill: {
    height: 3,
    borderRadius: 3,
    backgroundColor: colors.burgundy,
  },
  arrow: {
    color: colors.burgundy,
    marginTop: 7,
    fontSize: 23,
  },
});
