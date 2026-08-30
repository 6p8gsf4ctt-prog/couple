export type ScreenName =
  | 'home'
  | 'prepare'
  | 'library'
  | 'surprise'
  | 'custom'
  | 'edit'
  | 'ready'
  | 'sent'
  | 'receive'
  | 'revealed'
  | 'useConfirm'
  | 'used'
  | 'carnet'
  | 'settings';

export type ChequeStatus = 'draft' | 'ready' | 'offered' | 'revealed' | 'used';

export type ChequeDraft = {
  title: string;
  message: string;
  to: string;
  from: string;
  validity?: string;
  category?: string;
};

export type Idea = {
  title: string;
  category: string;
  message: string;
};
