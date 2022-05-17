import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import Swal from 'sweetalert2';

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
  numPremios: number | null = null  ;
  hayError : boolean = false;
  mensajeError : string = '';

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

  sortear(){

    this.hayError = false;
    this.mensajeError = '';

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


  }

  showAlert(mensajeError : string){
    Swal.fire({
      text: mensajeError,
      icon: 'error',
      showCloseButton: true,
      timer: 3000,
      background: 'red',
      
      color: 'white',
      iconColor: 'white',
      willClose: () => { this.hayError = false; this.mensajeError = '';}
     
    })
  }

  //TODO: btnCopy

  //TODO: Exportar / Descargar / Guardar

  


}
