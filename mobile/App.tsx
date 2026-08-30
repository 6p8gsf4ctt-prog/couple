import React, { useMemo, useRef, useState } from 'react';
import {
  Animated,
  Pressable,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { ScreenShell } from './src/components/ScreenShell';
import { PrimaryButton } from './src/components/PrimaryButton';
import { ChequeCard } from './src/components/ChequeCard';
import { EnvelopeReveal } from './src/components/EnvelopeReveal';
import { BottomNav, Tab } from './src/components/BottomNav';
import { categories, ideas } from './src/data/ideas';
import { ChequeDraft, ScreenName } from './src/types';
import { colors, radius, shadow, spacing, typography } from './src/theme';

const initialDraft: ChequeDraft = {
  title: 'Un dîner improvisé',
  message: 'Rien que nous deux, ici et maintenant.',
  to: 'Toi',
  from: 'Moi',
  category: 'Romantique',
};


const availableExample: ChequeDraft = {
  title: 'Une soirée cinéma',
  message: 'Tu choisis le film, je m’occupe du reste.',
  to: 'Toi',
  from: 'Moi',
  category: 'Maison',
};

const usedExample: ChequeDraft = {
  title: 'Un petit déjeuner au lit',
  message: 'Un matin lent, rien qu’à nous.',
  to: 'Toi',
  from: 'Moi',
  category: 'Petites attentions',
};

export default function App() {
  const [screen, setScreen] = useState<ScreenName>('home');
  const [draft, setDraft] = useState<ChequeDraft>(initialDraft);
  const [used, setUsed] = useState(false);
  const [carnetFilter, setCarnetFilter] = useState<'available' | 'used' | 'offered'>('available');
  const [notifications, setNotifications] = useState(true);
  const [faceId, setFaceId] = useState(true);
  const transition = useRef(new Animated.Value(1)).current;

  const navigate = (next: ScreenName) => {
    Animated.timing(transition, {
      toValue: 0,
      duration: 120,
      useNativeDriver: true,
    }).start(() => {
      setScreen(next);
      transition.setValue(0);
      Animated.spring(transition, {
        toValue: 1,
        useNativeDriver: true,
        damping: 20,
        stiffness: 150,
      }).start();
    });
  };

  const transitionStyle = {
    opacity: transition,
    transform: [
      {
        translateY: transition.interpolate({
          inputRange: [0, 1],
          outputRange: [10, 0],
        }),
      },
    ],
  };

  const setFromIdea = (title: string) => {
    const idea = ideas.find((item) => item.title === title);
    if (!idea) return;
    setDraft({
      title: idea.title,
      message: idea.message,
      to: 'Toi',
      from: 'Moi',
      category: idea.category,
    });
    navigate('edit');
  };

  const randomIdea = () => {
    const index = Math.floor(Math.random() * ideas.length);
    const idea = ideas[index] ?? ideas[0];
    if (!idea) return;
    setDraft({
      title: idea.title,
      message: idea.message,
      to: 'Toi',
      from: 'Moi',
      category: idea.category,
    });
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    navigate('edit');
  };

  const headerHome = () => navigate('home');

  const immersiveScreens: ScreenName[] = ['sent', 'receive', 'useConfirm'];
  const showGlobalNav = !immersiveScreens.includes(screen);

  const activeTab: Tab =
    screen === 'carnet' || screen === 'revealed' || screen === 'used'
      ? 'carnet'
      : screen === 'library'
        ? 'ideas'
        : screen === 'settings'
          ? 'settings'
          : 'home';

  const screenNode = useMemo(() => {
    if (screen === 'home') {
      return (
        <ScreenShell onHome={headerHome}>
          <Text style={styles.eyebrow}>NOTRE CARNET</Text>
          <Text style={styles.hero}>Chaque moment{"\n"}compte.</Text>

          <View style={styles.section}>
            <Text style={styles.sectionLabel}>TON BON DU MOIS</Text>
            <View style={styles.monthCard}>
              <Text style={styles.monthTitle}>
                {used ? 'Un souvenir à conserver' : 'Rien à découvrir pour le moment'}
              </Text>
              <Text style={styles.bodyCopy}>
                {used
                  ? 'Ton dernier bon utilisé repose maintenant dans le carnet.'
                  : 'Quand un bon arrivera, il t’attendra ici sans rien révéler.'}
              </Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionLabel}>TON BON À OFFRIR</Text>
            <ChequeCard cheque={draft} compact />
            <View style={styles.buttonGap}>
              <PrimaryButton label="Préparer un bon" onPress={() => navigate('prepare')} />
              <PrimaryButton label="Me surprendre" secondary onPress={() => navigate('surprise')} />
            </View>
          </View>
        </ScreenShell>
      );
    }

    if (screen === 'prepare') {
      return (
        <ScreenShell title="PRÉPARER" onBack={() => navigate('home')} onHome={headerHome}>
          <Text style={styles.pageTitle}>Comment veux-tu commencer ?</Text>
          <Text style={styles.pageIntro}>Le chèque reste l’objet principal. Choisis simplement le point de départ.</Text>
          <ChoiceCard title="Choisir une idée" text="Parcourir la bibliothèque." onPress={() => navigate('library')} />
          <ChoiceCard title="Me surprendre" text="Laisser le hasard choisir avec douceur." onPress={() => navigate('surprise')} />
          <ChoiceCard title="Créer le mien" text="Partir d’un chèque vierge." onPress={() => navigate('custom')} />
        </ScreenShell>
      );
    }

    if (screen === 'library') {
      return (
        <ScreenShell title="IDÉES" onBack={() => navigate('prepare')} onHome={headerHome}>
          <Text style={styles.pageTitle}>Qu’est-ce qui ferait plaisir aujourd’hui ?</Text>
          {categories.map((category) => {
            const subset = ideas.filter((idea) => idea.category === category);
            return (
              <View key={category} style={styles.categoryBlock}>
                <Text style={styles.categoryTitle}>{category}</Text>
                {subset.length === 0 ? (
                  <Text style={styles.categoryEmpty}>D’autres idées arriveront ici.</Text>
                ) : (
                  subset.map((idea) => (
                    <Pressable key={idea.title} onPress={() => setFromIdea(idea.title)} style={styles.ideaRow}>
                      <View>
                        <Text style={styles.ideaTitle}>{idea.title}</Text>
                        <Text style={styles.ideaMessage}>{idea.message}</Text>
                      </View>
                      <Text style={styles.chevron}>›</Text>
                    </Pressable>
                  ))
                )}
              </View>
            );
          })}
        </ScreenShell>
      );
    }

    if (screen === 'surprise') {
      return (
        <ScreenShell title="SURPRISE" onBack={() => navigate('prepare')} onHome={headerHome}>
          <View style={styles.centeredPage}>
            <View style={styles.sparkle}><Text style={styles.sparkleText}>✦</Text></View>
            <Text style={styles.pageTitleCentered}>Je prépare une surprise rien que pour toi.</Text>
            <Text style={styles.pageIntroCentered}>Une idée choisie parmi notre carnet, sans score ni obligation.</Text>
            <PrimaryButton label="Lancer la surprise" onPress={randomIdea} style={styles.fullButton} />
          </View>
        </ScreenShell>
      );
    }

    if (screen === 'custom') {
      return (
        <ScreenShell title="CRÉER" onBack={() => navigate('prepare')} onHome={headerHome}>
          <Text style={styles.pageTitle}>Créer le mien</Text>
          <Text style={styles.pageIntro}>Commence avec un chèque vierge. Tu pourras tout ajuster à l’étape suivante.</Text>
          <ChequeCard cheque={{ title: '', message: '', to: 'Toi', from: 'Moi' }} />
          <PrimaryButton
            label="Commencer"
            onPress={() => {
              setDraft({ title: '', message: '', to: 'Toi', from: 'Moi' });
              navigate('edit');
            }}
            style={styles.topGap}
          />
        </ScreenShell>
      );
    }

    if (screen === 'edit') {
      return (
        <ScreenShell title="NOUVEAU BON" onBack={() => navigate('prepare')} onHome={headerHome}>
          <Text style={styles.sectionLabel}>APERÇU</Text>
          <ChequeCard cheque={draft} compact />

          <View style={styles.form}>
            <Field
              label="Titre du bon"
              value={draft.title}
              onChangeText={(title) => setDraft((d) => ({ ...d, title }))}
              placeholder="Ex. Un dîner improvisé"
            />
            <Field
              label="Message personnel"
              value={draft.message}
              onChangeText={(message) => setDraft((d) => ({ ...d, message }))}
              placeholder="Quelques mots rien que pour vous…"
              multiline
            />
            <View style={styles.row}>
              <View style={styles.flex}>
                <Field label="Pour" value={draft.to} onChangeText={(to) => setDraft((d) => ({ ...d, to }))} />
              </View>
              <View style={styles.flex}>
                <Field label="De" value={draft.from} onChangeText={(from) => setDraft((d) => ({ ...d, from }))} />
              </View>
            </View>
            <Field
              label="Validité (optionnelle)"
              value={draft.validity ?? ''}
              onChangeText={(validity) => setDraft((d) => ({ ...d, validity }))}
              placeholder="Laisser vide si aucune"
            />
          </View>

          <PrimaryButton
            label="Le bon est prêt"
            disabled={!draft.title.trim()}
            onPress={() => navigate('ready')}
          />
        </ScreenShell>
      );
    }

    if (screen === 'ready') {
      return (
        <ScreenShell title="PRÊT" onBack={() => navigate('edit')} onHome={headerHome}>
          <View style={styles.centeredTop}>
            <Text style={styles.pageTitleCentered}>Ton bon est prêt à être offert.</Text>
            <Text style={styles.pageIntroCentered}>Il reste entièrement secret tant que tu ne l’offres pas.</Text>
          </View>
          <ChequeCard cheque={draft} />
          <View style={styles.buttonGap}>
            <PrimaryButton
              label="Offrir ce bon"
              onPress={async () => {
                await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                navigate('sent');
              }}
            />
            <PrimaryButton label="Modifier" secondary onPress={() => navigate('edit')} />
          </View>
        </ScreenShell>
      );
    }

    if (screen === 'sent') {
      return (
        <ScreenShell title="OFFERT" onHome={headerHome}>
          <View style={styles.centeredPage}>
            <EnvelopeStatic />
            <Text style={styles.pageTitleCentered}>C’est envoyé.</Text>
            <Text style={styles.pageIntroCentered}>
              Le contenu reste caché. L’autre personne sait seulement qu’un bon l’attend.
            </Text>
            <PrimaryButton label="Retour à l’accueil" onPress={() => navigate('home')} style={styles.fullButton} />
            <PrimaryButton
              label="Simuler la réception"
              secondary
              onPress={() => navigate('receive')}
              style={styles.fullButton}
            />
            <Text style={styles.prototypeNote}>Action visible uniquement dans le prototype.</Text>
          </View>
        </ScreenShell>
      );
    }

    if (screen === 'receive') {
      return (
        <ScreenShell title="POUR TOI" onHome={headerHome} scroll={false}>
          <EnvelopeReveal
            cheque={draft}
            onRevealed={() => {
              setUsed(false);
              navigate('revealed');
            }}
          />
        </ScreenShell>
      );
    }

    if (screen === 'revealed') {
      return (
        <ScreenShell title="DÉCOUVERT" onHome={headerHome}>
          <Text style={styles.pageTitleCentered}>Pour toi.</Text>
          <Text style={styles.pageIntroCentered}>Le bon est maintenant dans votre carnet.</Text>
          <View style={styles.topGap}>
            <ChequeCard cheque={draft} />
          </View>
          <View style={styles.buttonGap}>
            <PrimaryButton label="Utiliser ce bon" onPress={() => navigate('useConfirm')} />
            <PrimaryButton label="Voir le carnet" secondary onPress={() => navigate('carnet')} />
          </View>
        </ScreenShell>
      );
    }

    if (screen === 'useConfirm') {
      return (
        <ScreenShell title="UTILISER" onBack={() => navigate('revealed')} onHome={headerHome}>
          <View style={styles.centeredPage}>
            <ChequeCard cheque={draft} compact />
            <Text style={styles.pageTitleCentered}>Utiliser ce bon maintenant ?</Text>
            <Text style={styles.pageIntroCentered}>
              Une fois utilisé, il restera dans le carnet avec une marque discrète.
            </Text>
            <PrimaryButton
              label="Oui, utiliser"
              onPress={async () => {
                setUsed(true);
                await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                navigate('used');
              }}
              style={styles.fullButton}
            />
            <PrimaryButton label="Pas encore" secondary onPress={() => navigate('revealed')} style={styles.fullButton} />
          </View>
        </ScreenShell>
      );
    }

    if (screen === 'used') {
      return (
        <ScreenShell title="SOUVENIR" onHome={headerHome}>
          <Text style={styles.pageTitleCentered}>Un moment vécu, toujours conservé.</Text>
          <Text style={styles.pageIntroCentered}>Le chèque ne disparaît jamais.</Text>
          <View style={styles.topGap}>
            <ChequeCard cheque={draft} used />
          </View>
          <PrimaryButton label="Voir le carnet" onPress={() => navigate('carnet')} style={styles.topGap} />
        </ScreenShell>
      );
    }

    if (screen === 'carnet') {
      return (
        <ScreenShell title="CARNET" onHome={headerHome}>
          <Text style={styles.pageTitle}>Notre carnet</Text>
          <Text style={styles.pageIntro}>Un album à feuilleter, pas une liste à gérer.</Text>

          <View style={styles.segment}>
            <Segment label="Disponibles" active={carnetFilter === 'available'} onPress={() => setCarnetFilter('available')} />
            <Segment label="Utilisés" active={carnetFilter === 'used'} onPress={() => setCarnetFilter('used')} />
            <Segment label="Offerts" active={carnetFilter === 'offered'} onPress={() => setCarnetFilter('offered')} />
          </View>

          <View style={styles.stack}>
            <View style={[styles.stackGhost, { top: 18, transform: [{ scale: 0.94 }] }]} />
            <View style={[styles.stackGhost, { top: 9, transform: [{ scale: 0.97 }] }]} />

            {carnetFilter === 'available' && (
              <ChequeCard cheque={availableExample} compact />
            )}

            {carnetFilter === 'used' && (
              <ChequeCard cheque={usedExample} compact used />
            )}

            {carnetFilter === 'offered' && (
              <ChequeCard cheque={draft} compact />
            )}
          </View>

          <Text style={styles.albumNote}>
            {carnetFilter === 'used'
              ? 'Ici, uniquement les bons déjà vécus — conservés sans disparaître.'
              : carnetFilter === 'offered'
                ? 'Ici, les bons que tu as offerts à l’autre.'
                : 'Ici, uniquement les bons découverts et encore utilisables.'}
          </Text>
        </ScreenShell>
      );
    }

    if (screen === 'settings') {
      return (
        <ScreenShell title="RÉGLAGES" onHome={headerHome}>
          <Text style={styles.pageTitle}>Réglages</Text>
          <Text style={styles.pageIntro}>Peu d’options, uniquement celles qui protègent ou simplifient l’expérience.</Text>

          <SettingRow
            title="Notifications discrètes"
            text="Aucun titre de bon ni contenu personnel sur l’écran verrouillé."
            value={notifications}
            onValueChange={setNotifications}
          />
          <SettingRow
            title="Verrouillage Face ID"
            text="Demander une authentification locale à l’ouverture."
            value={faceId}
            onValueChange={setFaceId}
          />
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>Confidentialité</Text>
            <Text style={styles.infoText}>
              Ce prototype ne contient aucun compte, aucune donnée réseau et aucun contenu envoyé à un serveur.
            </Text>
          </View>
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>Prototype 0.2</Text>
            <Text style={styles.infoText}>
              La navigation, les statuts du Carnet et la révélation ont été corrigés après le premier test sur téléphone.
            </Text>
          </View>
        </ScreenShell>
      );
    }

    return null;
  }, [
    screen,
    draft,
    used,
    carnetFilter,
    notifications,
    faceId,
  ]);

  return (
    <View style={styles.app}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.ivory} />
      <Animated.View style={[styles.app, transitionStyle]}>
        {screenNode}
      </Animated.View>

      {showGlobalNav && (
        <BottomNav
          active={activeTab}
          onHome={() => navigate('home')}
          onCarnet={() => navigate('carnet')}
          onIdeas={() => navigate('library')}
          onSettings={() => navigate('settings')}
        />
      )}
    </View>
  );
}

function ChoiceCard({ title, text, onPress }: { title: string; text: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.choiceCard, pressed && styles.choicePressed]}>
      <View style={styles.choiceGlyph}><Text style={styles.choiceGlyphText}>♡</Text></View>
      <View style={styles.flex}>
        <Text style={styles.choiceTitle}>{title}</Text>
        <Text style={styles.choiceText}>{text}</Text>
      </View>
      <Text style={styles.chevron}>›</Text>
    </Pressable>
  );
}

function Field({
  label,
  value,
  onChangeText,
  placeholder,
  multiline,
}: {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  multiline?: boolean;
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        style={[styles.input, multiline && styles.multiline]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#A69C93"
        multiline={multiline}
        textAlignVertical={multiline ? 'top' : 'center'}
      />
    </View>
  );
}

function Segment({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={[styles.segmentItem, active && styles.segmentActive]}>
      <Text style={[styles.segmentText, active && styles.segmentTextActive]}>{label}</Text>
    </Pressable>
  );
}

function SettingRow({
  title,
  text,
  value,
  onValueChange,
}: {
  title: string;
  text: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
}) {
  return (
    <View style={styles.settingRow}>
      <View style={styles.flex}>
        <Text style={styles.settingTitle}>{title}</Text>
        <Text style={styles.settingText}>{text}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: colors.sand, true: colors.blush }}
        thumbColor={colors.paper}
      />
    </View>
  );
}

function EnvelopeStatic() {
  return (
    <View style={styles.envelopeStatic}>
      <View style={styles.envelopeFlap} />
      <View style={styles.envelopeFront}>
        <View style={styles.envelopeSeal}><Text style={styles.envelopeSealText}>♡</Text></View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  app: {
    flex: 1,
    backgroundColor: colors.ivory,
  },
  eyebrow: {
    marginTop: spacing.l,
    fontFamily: typography.ui,
    fontSize: 11,
    letterSpacing: 2.5,
    color: colors.burgundy,
    textAlign: 'center',
  },
  hero: {
    marginTop: spacing.m,
    fontFamily: typography.editorial,
    fontSize: 42,
    lineHeight: 48,
    color: colors.graphite,
    textAlign: 'center',
  },
  section: {
    marginTop: spacing.xl,
    gap: spacing.m,
  },
  sectionLabel: {
    fontFamily: typography.ui,
    fontSize: 11,
    letterSpacing: 2.1,
    color: colors.muted,
  },
  monthCard: {
    padding: spacing.l,
    borderRadius: radius.l,
    backgroundColor: colors.paper,
    borderWidth: 1,
    borderColor: colors.line,
  },
  monthTitle: {
    fontFamily: typography.editorial,
    color: colors.graphite,
    fontSize: 22,
    marginBottom: spacing.s,
  },
  bodyCopy: {
    fontFamily: typography.ui,
    color: colors.muted,
    fontSize: 14,
    lineHeight: 21,
  },
  buttonGap: {
    marginTop: spacing.l,
    gap: spacing.s,
  },
  pageTitle: {
    marginTop: spacing.l,
    fontFamily: typography.editorial,
    fontSize: 32,
    lineHeight: 39,
    color: colors.graphite,
  },
  pageIntro: {
    marginTop: spacing.s,
    marginBottom: spacing.l,
    fontFamily: typography.ui,
    color: colors.muted,
    fontSize: 15,
    lineHeight: 23,
  },
  pageTitleCentered: {
    fontFamily: typography.editorial,
    fontSize: 30,
    lineHeight: 37,
    color: colors.graphite,
    textAlign: 'center',
    marginTop: spacing.l,
  },
  pageIntroCentered: {
    marginTop: spacing.s,
    fontFamily: typography.ui,
    color: colors.muted,
    fontSize: 15,
    lineHeight: 23,
    textAlign: 'center',
  },
  choiceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.l,
    borderRadius: radius.l,
    backgroundColor: colors.paper,
    borderWidth: 1,
    borderColor: colors.line,
    marginBottom: spacing.s,
    gap: spacing.m,
  },
  choicePressed: {
    transform: [{ scale: 0.992 }],
    opacity: 0.9,
  },
  choiceGlyph: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.blushLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  choiceGlyphText: {
    color: colors.burgundy,
    fontSize: 20,
  },
  choiceTitle: {
    fontFamily: typography.ui,
    fontWeight: '700',
    color: colors.graphite,
    fontSize: 16,
  },
  choiceText: {
    fontFamily: typography.ui,
    color: colors.muted,
    marginTop: 4,
    fontSize: 13,
  },
  chevron: {
    color: colors.burgundy,
    fontSize: 30,
    fontWeight: '300',
  },
  flex: {
    flex: 1,
  },
  categoryBlock: {
    marginBottom: spacing.l,
  },
  categoryTitle: {
    fontFamily: typography.editorial,
    color: colors.burgundy,
    fontSize: 22,
    marginBottom: spacing.s,
  },
  categoryEmpty: {
    color: colors.muted,
    fontFamily: typography.ui,
    fontStyle: 'italic',
  },
  ideaRow: {
    minHeight: 74,
    paddingVertical: spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ideaTitle: {
    color: colors.graphite,
    fontFamily: typography.ui,
    fontWeight: '600',
    fontSize: 15,
  },
  ideaMessage: {
    color: colors.muted,
    fontFamily: typography.ui,
    fontSize: 12,
    marginTop: 4,
    maxWidth: 285,
  },
  centeredPage: {
    flex: 1,
    minHeight: 640,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centeredTop: {
    alignItems: 'center',
    marginBottom: spacing.l,
  },
  sparkle: {
    width: 92,
    height: 92,
    borderRadius: 46,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.blushLight,
  },
  sparkleText: {
    fontSize: 38,
    color: colors.burgundy,
  },
  fullButton: {
    alignSelf: 'stretch',
    marginTop: spacing.m,
  },
  topGap: {
    marginTop: spacing.xl,
  },
  prototypeNote: {
    color: colors.muted,
    fontFamily: typography.ui,
    fontSize: 11,
    marginTop: spacing.m,
    textAlign: 'center',
  },
  form: {
    marginTop: spacing.xl,
    marginBottom: spacing.l,
    gap: spacing.m,
  },
  field: {
    gap: 7,
  },
  fieldLabel: {
    fontFamily: typography.ui,
    color: colors.muted,
    fontSize: 12,
    letterSpacing: 0.5,
  },
  input: {
    minHeight: 50,
    borderRadius: radius.m,
    backgroundColor: colors.paper,
    borderWidth: 1,
    borderColor: colors.line,
    paddingHorizontal: spacing.m,
    color: colors.graphite,
    fontFamily: typography.ui,
    fontSize: 15,
  },
  multiline: {
    minHeight: 104,
    paddingTop: spacing.m,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.s,
  },
  segment: {
    flexDirection: 'row',
    backgroundColor: colors.paperDeep,
    borderRadius: radius.l,
    padding: 4,
    marginBottom: spacing.xl,
  },
  segmentItem: {
    flex: 1,
    paddingVertical: 11,
    alignItems: 'center',
    borderRadius: radius.m,
  },
  segmentActive: {
    backgroundColor: colors.paper,
  },
  segmentText: {
    color: colors.muted,
    fontFamily: typography.ui,
    fontSize: 12,
  },
  segmentTextActive: {
    color: colors.burgundy,
    fontWeight: '700',
  },
  stack: {
    position: 'relative',
    paddingTop: 20,
    minHeight: 220,
  },
  stackGhost: {
    position: 'absolute',
    left: 12,
    right: 12,
    height: 176,
    backgroundColor: '#F0E5D7',
    borderRadius: radius.l,
    borderWidth: 1,
    borderColor: colors.line,
  },
  albumNote: {
    marginTop: spacing.l,
    color: colors.muted,
    fontFamily: typography.editorial,
    fontStyle: 'italic',
    textAlign: 'center',
    fontSize: 16,
    lineHeight: 23,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.m,
    backgroundColor: colors.paper,
    borderRadius: radius.l,
    borderWidth: 1,
    borderColor: colors.line,
    padding: spacing.l,
    marginBottom: spacing.s,
  },
  settingTitle: {
    color: colors.graphite,
    fontFamily: typography.ui,
    fontWeight: '700',
    fontSize: 15,
  },
  settingText: {
    color: colors.muted,
    fontFamily: typography.ui,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 5,
  },
  infoCard: {
    padding: spacing.l,
    borderRadius: radius.l,
    backgroundColor: colors.paperDeep,
    marginTop: spacing.m,
  },
  infoTitle: {
    color: colors.burgundy,
    fontFamily: typography.editorial,
    fontSize: 20,
  },
  infoText: {
    color: colors.muted,
    fontFamily: typography.ui,
    fontSize: 13,
    lineHeight: 20,
    marginTop: spacing.s,
  },
  envelopeStatic: {
    width: '82%',
    height: 190,
    position: 'relative',
    marginBottom: spacing.xl,
  },
  envelopeFlap: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: 108,
    backgroundColor: colors.paper,
    borderTopLeftRadius: radius.l,
    borderTopRightRadius: radius.l,
    borderWidth: 1,
    borderColor: colors.line,
  },
  envelopeFront: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 138,
    backgroundColor: '#F4EADC',
    borderRadius: radius.l,
    borderWidth: 1,
    borderColor: colors.line,
    ...shadow,
  },
  envelopeSeal: {
    position: 'absolute',
    top: -23,
    left: '50%',
    marginLeft: -23,
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: colors.blush,
    alignItems: 'center',
    justifyContent: 'center',
  },
  envelopeSealText: {
    color: colors.white,
    fontSize: 24,
  },
});
