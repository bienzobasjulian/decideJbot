import { DocumentReference } from "firebase/firestore";
import { Sorteo } from "./sorteo.interface";

export interface Resultado {
    id: string;
    fecha? : Date;
    ganadores : String[];
    sorteo : Sorteo;
    usuario ?: DocumentReference;
}