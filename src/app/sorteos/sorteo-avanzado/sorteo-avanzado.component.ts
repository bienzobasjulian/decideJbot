import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { UUID } from 'angular2-uuid';
import Swal from 'sweetalert2';
import { AuthService } from 'src/app/auth/auth.service';
import { SorteosService } from '../sorteos.service';
import { TOUCH_BUFFER_MS } from '@angular/cdk/a11y/input-modality/input-modality-detector';
import { Sorteo } from '../interfaces/sorteo.interface';
import { Resultado } from '../interfaces/resultado.interface';
import { Clipboard } from '@angular/cdk/clipboard';



@Component({
  selector: 'app-sorteo-avanzado',
  templateUrl: './sorteo-avanzado.component.html',
  styleUrls: ['./sorteo-avanzado.component.css'], 
  providers : [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: {displayDefaultIndicatorType: false},
    }
  ]
})
export class SorteoAvanzadoComponent implements OnInit {

  @ViewChild('inputNewParticipante') inputNewParticipante!: ElementRef;
  @ViewChild('inputNumPremios') inputNumPremios!: ElementRef;
  @ViewChild('inputUrlResultado') inputUrlResultado!: ElementRef;

  pasoActual : number = 0;
  uid : string = UUID.UUID();
  titulo = "Sorteo avanzado #" + this.uid ;
  participantes: string[] = [];
  numPremios!: number;
  fecha: Date = new Date();
  urlResultado : string = 'https://bienzobasjulian.github.io/DecideJbot-WEB-Angular-/#/';

  generarSinFecha = false;

  newParticipante: string = '';
  

  constructor(private _formBuilder : FormBuilder,
    private sorteosService: SorteosService,
    private authService: AuthService,
    private clipboard: Clipboard ) { }

  ngOnInit(): void {
    
  }

  comenzarSorteoAvanzado(){
    this.pasoActual = 1;
   
  }

  backStep(){
    this.pasoActual--;
  }

  goStepParticipantes(){
    this.pasoActual = 2;
    
    if (this.titulo.length == 0){
      this.titulo = "Sorteo avanzado #" + this.uid ;
    }

    console.log(this.titulo);
  }

  goStepPremios(){
     //Si no hay participantes...
     if (this.participantes.length == 0) {
       let mensajeError = 'Por lo menos debe haber un participante';
       this.showAlert(mensajeError);
     }
     else {
      this.pasoActual = 3;
     }
  }

  goStepFecha(){
    if (this.numPremios == 0 || this.numPremios == null) {
      //Si no se indica el nº de premios, se repartirán tantos premios como participantes haya.
      this.numPremios = this.participantes.length;
    }
    else if(this.numPremios > this.participantes.length){
       //Si hay más premios que participantes...
       let mensajeError = "No puede haber más premios que participantes";
       this.showAlert(mensajeError);
    }
    else{

      this.pasoActual = 4;
    }
  }

  goStepConfirm(){
    this.generarSinFecha = false;
    this.pasoActual = 5;
  }

  goStepConfirmSinFecha(){
    this.generarSinFecha = true;
    this.pasoActual = 5;
  }

  goStepResultado(){
    this.createSorteo();
    this.pasoActual = 6;

    
  }

  createSorteo(){
    //Comprobar si hay sesión iniciada
    let user = this.authService.getUser();

    let uidUser;

    if (user) {
       uidUser = user.uid;
    }
    else{
      uidUser = undefined;
    }

    if (this.generarSinFecha){
      this.fecha = new Date();
    }

    let sorteo : Sorteo = {
      id: this.uid,
      titulo: this.titulo,
      participantes: this.participantes,
      numPremios  : this.numPremios,
      fechaProgramada : this.fecha,
    }

    this.sorteosService.saveSorteoAvanzado(sorteo, uidUser)

    let uidResultado = UUID.UUID();

    let resultado : Resultado = {
      id: uidResultado,
      sorteo: sorteo,
      ganadores: []
    }

    this.sorteosService.createResultado(resultado, uidUser);
    this.urlResultado = this.urlResultado + "sorteos/resultado/" + uidResultado;
  


     

  }

  showAlert(mensajeError: string) {
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
    });
  }




  addParticipante() {
    let valorParticipante = this.newParticipante;

    //Si el participante que se quiere añadir no es un valor vacío y no está incluído en la lista de participantes...
    if (
      valorParticipante.trim().length > 0 &&
      !this.participantes.includes(valorParticipante)
    ) {
      this.participantes.push(valorParticipante);
    }

    this.newParticipante = '';
  }


  eliminarParticipante(i: number) {
    this.participantes.splice(i, 1);

    if (this.participantes.length == 0) {
      
    }
  }


  mezclarParticipantes() {
    this.participantes = this.participantes.sort(() => Math.random() - 0.5);
  }

  removeAllParticipantes() {
    this.participantes = [];
  }

  copyUrl(){
    this.inputUrlResultado.nativeElement.select();
    this.clipboard.copy(this.urlResultado);
    
  }
  

}
