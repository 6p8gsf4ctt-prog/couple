import { Idea } from '../types';

export const ideas: Idea[] = [
  { title: 'Un dîner improvisé', category: 'Romantique', message: 'Rien que nous deux, sans programme.' },
  { title: 'Une soirée cinéma', category: 'Maison', message: 'Tu choisis le film, je m’occupe du reste.' },
  { title: 'Un petit déjeuner au lit', category: 'Petites attentions', message: 'Un matin lent, rien qu’à nous.' },
  { title: 'Une escapade surprise', category: 'Aventure', message: 'Je prépare tout, tu viens avec moi.' },
  { title: 'Une promenade sans destination', category: 'Sorties', message: 'On marche jusqu’à avoir envie de s’arrêter.' },
  { title: 'Une soirée rien que pour toi', category: 'Intime / Couple', message: 'À utiliser quand tu en as envie.' },
];

export const categories = [
  'Romantique',
  'Sorties',
  'Aventure',
  'Maison',
  'Petites attentions',
  'Intime / Couple',
];
