import { atom } from "recoil";

export const PlayerId = atom({
	key: 'PlayerId', // unique ID (with respect to other atoms/selectors)
	default: 0, // valeur par défaut (alias valeur initials)
});