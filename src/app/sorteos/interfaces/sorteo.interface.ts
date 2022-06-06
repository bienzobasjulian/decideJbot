import { User } from "@firebase/auth";
import { DocumentReference } from "firebase/firestore";

export interface Sorteo {
    id?: string;
    titulo ?: string;
    participantes : string[];
    usuario ?: DocumentReference;
    fechaProgramada ?: Date | Object | any;
    numPremios ?: number;
}