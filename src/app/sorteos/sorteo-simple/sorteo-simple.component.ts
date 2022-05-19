import { JsonPipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { reduce } from 'rxjs';
import Swal from 'sweetalert2';
import { Sorteo } from '../interfaces/sorteo.interface';

@Component({
  selector: 'app-sorteo-simple',
  templateUrl: './sorteo-simple.component.html',
  styleUrls: ['./sorteo-simple.component.css'],
})
export class SorteoSimpleComponent implements OnInit {

  @ViewChild('inputNewParticipante') inputNewParticipante!: ElementRef; 
  @ViewChild('inputNumPremios') inputNumPremios!: ElementRef;
  constructor() {}

  ngOnInit(): void {}

  participantes: string[] = [];
  newParticipante: string = '';
  numPremios!: number   ;
  hayError : boolean = false;
  mensajeError : string = '';
  ganadores : string[] = [];
  showDivResultados : boolean = false;
  hayResultados : boolean = false;
  mostrarCarga : boolean = false;
  tiempoCarga : number = 5;
  fechaSorteo : Date = new Date();

  stateSaveButtons : boolean = false;
  stateMainButtons : boolean = true;

  showSaveButtons(){

    this.stateMainButtons = false;
    this.stateSaveButtons = true;

  }

  showMainButtons(){
    this.stateSaveButtons = false;
    this.stateMainButtons = true;
  }

  addParticipante() {
    let valorParticipante = this.newParticipante;
    console.log(valorParticipante);
    //Si el participante que se quiere añadir no es un valor vacío y no está incluído en la lista de participantes...
    if (
      valorParticipante.trim().length > 0 &&
      !this.participantes.includes(valorParticipante)
    ) {
      this.participantes.push(valorParticipante);
    }

    this.newParticipante = '';
  }

  eliminarParticipante(i : number){
    this.participantes.splice(i, 1);

    if (this.participantes.length == 0){
      this.stateSaveButtons = false;
      this.stateMainButtons = true;
    }
  }

  setFocusOnNewParticipante(){
    this.inputNewParticipante.nativeElement.focus();
  }

  setFocusOnNumPremios(){
    this.inputNumPremios.nativeElement.focus();
  }

  removeAllParticipantes(){
    this.participantes = [] ;
  }

  mezclarParticipantes(){
    this.participantes = this.participantes.sort(() => Math.random()-0.5);
    
  }

  sortear(){

    this.hayError = false;
    this.mensajeError = '';
    this.tiempoCarga = 5;
    this.hayResultados = false;
    this.showDivResultados = false;
    this.mostrarCarga  = false;
    this.ganadores = [];

    console.log(this.hayError);

      if (this.numPremios == 0 || this.numPremios == null) {
        //Si no se indica el nº de premios, se repartirán tantos premios como participantes haya.
        this.numPremios = this.participantes.length;
      }

     //Si no hay participantes... 
     if (this.participantes.length == 0){
       this.hayError = true;
       this.mensajeError = 'Por lo menos debe haber un participante';
       this.showAlert(this.mensajeError);
     }
     else if (this.numPremios > this.participantes.length){ //Si hay más premios que participantes... 
      this.hayError = true;
      this.mensajeError = 'No puede haber más premios que participantes';
      this.showAlert(this.mensajeError);
     }
     else {
       //Si está todo OK... 
       this.showDivResultados = true; //Para mostrar el div.row de los resultados
       this.mostrarCarga = true; //Para mostrar la carga de los resultados

       this.cuentaAtras();
       

     }


  }

  cuentaAtras(){
    setTimeout(()=> {
      this.tiempoCarga--;
      this.procesoCuentaAtras();
    }, 1000);
  }

  procesoCuentaAtras(){

    if( this.tiempoCarga == 0){
      this.generarResultados();

    }else{
      this.cuentaAtras();
    }
  }

  generarResultados(){
        this.mostrarCarga = false;
        

       
        var i = 0;
        for (i; i < this.numPremios; i++){

          var rand = Math.floor(Math.random()*this.participantes.length);
          var ganador = this.participantes[rand];

          if (this.ganadores.includes(ganador)) //Si el ganador está en la lista...
          {
           i--;
          }
          else
          {
            this.ganadores[i] = ganador;
          }


          
        }
        
        this.hayResultados = true;
        this.fechaSorteo = new Date();
  }

  showAlert(mensajeError : string)
  {
    Swal.fire({
      text: mensajeError,
      icon: 'error',
      showCloseButton: true,
      timer: 3000,
      background: 'red',
      confirmButtonColor: '#4caf50',
      color: 'white',
      iconColor: 'white',
      timerProgressBar: true,
      willClose: () => { this.hayError = false; this.mensajeError = '';}
     
    })
  }

 

  saveSorteoLocalmente(){
    let sorteo : Sorteo = {
      participantes : this.participantes
    }
    var sorteos : Sorteo[] = [];
    

    if (localStorage.getItem('sorteos') == null){
      localStorage.setItem('sorteos', '[]');
    }

    sorteos = JSON.parse(localStorage.getItem('sorteos') || "") ;

    if (sorteos.includes(sorteo)){
      alert("Este sorteo ya está guardado");
    }
    else{
      sorteos.push(sorteo);

      localStorage.setItem('sorteos', JSON.stringify(sorteos) );
      alert("Sorteo guardado localmemte");
    }
    
   

  

    
  
    

    


  }

  

  

  //TODO: btnCopy

  //TODO: Exportar / Descargar / Guardar

  


}
