export interface CharacterParams {
  race: string;
  age: string;
  faceShape: string;
  faceDetails: string;
  hairShape: string;
  hairLength: string;
  hairColor: string;
  eyebrows: string;
  eyes: string;
  nose: string;
  mouth: string;
  skinColor: string;
  bodyShape: string;
  bodyDetails: string;
  chest: string;
  waist: string;
  hips: string;
  height: string;
  outfit: string;
  background: string;
  pose: string;
  artStyle: string;
}

export const INITIAL_PARAMS: CharacterParams = {
  race: '',
  age: '',
  faceShape: '',
  faceDetails: '',
  hairShape: '',
  hairLength: '',
  hairColor: '',
  eyebrows: '',
  eyes: '',
  nose: '',
  mouth: '',
  skinColor: '',
  bodyShape: '',
  bodyDetails: '',
  chest: '',
  waist: '',
  hips: '',
  height: '',
  outfit: '',
  background: 'White Background',
  pose: 'Standing Straight',
  artStyle: 'Realistic',
};