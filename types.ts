
export enum Country {
  MOZAMBIQUE = 'Moçambique',
  ANGOLA = 'Angola',
  PORTUGAL = 'Portugal',
  BRAZIL = 'Brasil'
}

export enum FontType {
  TIMES_NEW_ROMAN = 'Times New Roman, serif',
  ARIAL = 'Arial, sans-serif',
  CALIBRI = 'Calibri, sans-serif'
}

export enum CVModel {
  CLASSIC = 'clássico',
  CLEAN = 'limpo',
  ELEGANT = 'elegante',
  MODERN = 'moderno',
  EXECUTIVE = 'executivo',
  MINIMALIST = 'minimalista'
}

export type BulletChar = 'none' | '•' | '♦' | '■' | '◉' | '▪' | '◆' | '⇨' | '—' | '◦' | '➢' | '►' | '☑' | '▶' | '✓' | '➤' | '★' | '·';

export interface LanguageSkill {
  id: string;
  name: string;
  speaking: string;
  writing: string;
  reading: string;
  comprehension: string;
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  period: string;
  description: string;
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  period: string;
  grade?: string;
}

export interface CustomSection {
  id: string;
  title: string;
  content: string;
}

export interface CVStyles {
  model: CVModel;
  fontFamily: FontType;
  fontSize: '10pt' | '11pt' | '12pt' | '14pt' | '16pt' | '18pt' | '20pt';
  underlineSections: boolean;
  lineHeight: number;
  primaryBullet: BulletChar;
  secondaryBullet: BulletChar;
}

export interface CVData {
  country: Country;
  styles: CVStyles;
  personalInfo: {
    fullName: string;
    birthDate: string;
    nationality: string;
    naturality?: string;
    maritalStatus: string;
    address: string;
    phone: string;
    email: string;
    idNumber?: string;
  };
  educations: Education[];
  professionalTraining: string;
  experiences: Experience[];
  languageSkills: LanguageSkill[];
  personalProfile: string;
  customSections: CustomSection[];
}
