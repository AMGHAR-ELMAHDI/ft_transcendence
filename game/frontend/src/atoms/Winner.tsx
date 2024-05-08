import { atom } from "recoil";

export const WinnerI = atom({
	key: 'WinnerI', // unique ID (with respect to other atoms/selectors)
	default: '', // valeur par défaut (alias valeur initials)
  });