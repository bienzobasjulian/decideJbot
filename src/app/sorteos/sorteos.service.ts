import { Injectable } from '@angular/core';
import { UUID } from 'angular2-uuid';
import { Sorteo } from './interfaces/sorteo.interface';
import { collection, doc, getDoc, getDocs, getFirestore, query, setDoc, where, DocumentReference, DocumentData, DocumentSnapshot } from 'firebase/firestore';
import { environment } from '../../environments/environment.prod';
import { initializeApp } from 'firebase/app';
import { Resultado } from './interfaces/resultado.interface';




@Injectable({
  providedIn: 'root'
})
export class SorteosService {
  



   app = initializeApp(environment.firebaseConfig);
   db = getFirestore(this.app);
    sorteosExternos : Sorteo[] = [];


  constructor() { }

  getSorteosOfLocal(){

   return JSON.parse(localStorage.getItem('sorteos') || "") ;

  }

  saveSorteoAvanzado(sorteo: Sorteo, uidUser : string | undefined){

    if (sorteo.id != undefined){

      if (uidUser != undefined){
        let userRef = doc(this.db, "Usuarios", uidUser );
  
       
        setDoc(doc(this.db, "sorteos", sorteo.id ), {
          id: sorteo.id,
        titulo: sorteo.titulo,
        participantes: sorteo.participantes,
        numPremios : sorteo.numPremios,
        fechaProgramada : sorteo.fechaProgramada,
        usuario : userRef
  
      });
       
  
        
  
      }
      else{

        setDoc(doc(this.db, "sorteos", sorteo.id ), {
          id: sorteo.id,
        titulo: sorteo.titulo,
        participantes: sorteo.participantes,
        numPremios : sorteo.numPremios,
        fechaProgramada : sorteo.fechaProgramada,
  
      });

      }
    }

    
  }

  createResultado(resultado : Resultado, uidUser : string | undefined){
    if (uidUser != undefined){
      let userRef = doc(this.db, "Usuarios", uidUser );
      
      if(resultado.sorteo.id != undefined){

        let sorteoRef = doc(this.db, "sorteos", resultado.sorteo.id );

        setDoc(doc(this.db, "resultados", resultado.id), {
          id: resultado.id,
          sorteo : sorteoRef,
          ganadores: resultado.ganadores,
          usuario : userRef
      });

      }

      
    }
    else{

      if(resultado.sorteo.id != undefined){

        let sorteoRef = doc(this.db, "sorteos", resultado.sorteo.id );

        setDoc(doc(this.db, "resultados", resultado.id), {
          id: resultado.id,
          sorteo : sorteoRef,
          ganadores: resultado.ganadores,
         
      });

      }

    }
  }

  updateResultado(resultado : Resultado, uidUser : string | undefined){

   

    if(uidUser != undefined){
     
      let userRef = doc(this.db, "Usuarios", uidUser );

      console.log(resultado.sorteo.id);

      if(resultado.sorteo.id != undefined){
       
        let sorteoRef = doc(this.db, "sorteos", resultado.sorteo.id );

        setDoc(doc(this.db, "resultados", resultado.id), {
          id: resultado.id,
          sorteo : sorteoRef,
          ganadores: resultado.ganadores,
          usuario : userRef,
          fecha: resultado.fecha
      });

      

      }

    }



    

  }

  async getResultadoPorId(id : string){

   
    const resultadoRef = doc(this.db, "resultados", id);

    const resultadoSnap = await getDoc(resultadoRef);

    if(( resultadoSnap).exists()){
      
      

     
      let resultadoObtenido : Resultado = {
            id: id,
            sorteo: resultadoSnap.data()['sorteo'],
            ganadores : resultadoSnap.data()['ganadores'],
            fecha : resultadoSnap.data()['fecha']
      }

      return resultadoObtenido;

    }

    return;
    
  }

  async getSorteoOfReference(sorteoRef : any) {

    let sorteoSnap : DocumentSnapshot<DocumentData> =  await getDoc(sorteoRef);

    if (sorteoSnap.exists()){
      console.log(sorteoSnap.data());

     let sorteo : Sorteo = {
       id: sorteoSnap.data()['id'],
       titulo : sorteoSnap.data()['titulo'],
       participantes : sorteoSnap.data()['participantes'],
       fechaProgramada : sorteoSnap.data()['fechaProgramada'],
       numPremios :sorteoSnap.data()['numPremios']
     }

     return sorteo;
    }
    
    return ;
  }

  

  saveSorteoExterno(sorteo: Sorteo, uidUser : string){

    let id = UUID.UUID();
    
    sorteo.id = id;

    let userRef = doc(this.db, "Usuarios", uidUser );

    

   
    setDoc(doc(this.db, "sorteos", id), {
        id: id,
      titulo: sorteo.titulo,
      participantes: sorteo.participantes,
      usuario : userRef

    });

    

   

  }

  async getSorteosExternos(uidUser : string)  {


    let userRef = doc(this.db, "Usuarios", uidUser );
    //const query = query(collection(this.db, "sorteos"), where ("usuario", "==", userRef));

    const q = query(collection(this.db, "sorteos"), where ("usuario", "==", userRef));

    const resultado = await getDocs(q);

   

    let sorteosExternos : Sorteo[] = [];

  

    resultado.forEach((doc) => {
     
     let sorteo : Sorteo = {
       titulo : doc.data()['titulo'],
       participantes : doc.data()['participantes'],
     }

     this.sorteosExternos.push(sorteo);

    
     
    });

    return this.sorteosExternos;

  }

  async getResultados(uidUser : string){

    

    let userRef = doc(this.db, "Usuarios", uidUser );

    const q = query(collection(this.db, "resultados"), where ("usuario", "==", userRef));

    const response = await getDocs(q);

    let resultados : Resultado[] = [];

    response.forEach((doc) => {
      let resultado : Resultado = {
        id: doc.data()['id'],
        sorteo : doc.data()['sorteo'],
        ganadores : doc.data()['ganadores'],
        usuario : doc.data()['usuario']
      }

      resultados.push(resultado);
    });

    return resultados;


  }
}
