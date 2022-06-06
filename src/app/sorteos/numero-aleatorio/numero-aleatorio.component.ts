import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-numero-aleatorio',
  templateUrl: './numero-aleatorio.component.html',
  styleUrls: ['./numero-aleatorio.component.css']
})
export class NumeroAleatorioComponent implements OnInit {


  @ViewChild('inputValorMinimo') inputValorMinimo!: ElementRef;
  @ViewChild('inputValorMaximo') inputValorMaximo!: ElementRef;
  @ViewChild('inputValorGenerar') inputValorGenerar!: ElementRef;
  @ViewChild('inputPermitirRepetidos') inputPermitirRepetidos!: ElementRef;


  constructor() { }

  ngOnInit(): void {

    
  }

  valorMinimo!: number; 
  valorMaximo!: number; 
  numerosAGenerar!: number
  permitirRepetidos : boolean = false;
  numeros : number[]  = [];



  setFocusInMin(){
    this.inputValorMinimo.nativeElement.focus();
  }

  setFocusInMax(){
    this.inputValorMaximo.nativeElement.focus();
  }

  setFocusInNumerosAGenerar(){
    this.inputValorGenerar.nativeElement.focus();
  }

  changePermitirRepetidosValue(){
    this.permitirRepetidos = !this.permitirRepetidos;
  }

  verifyForm() : boolean {

    var formIsValid = false;

   



    if (this.valorMinimo == undefined || this.valorMaximo == undefined || this.numerosAGenerar ==  undefined){
      this.showAlert("Completa todos los campos");
      return formIsValid;
      
    }
    else if ( this.valorMaximo < this.valorMinimo){
      this.showAlert("El nº mínimo debe ser menor al nº máximo");
      return formIsValid;
    }

    if (!this.permitirRepetidos){
      const numerosDisponibles = this.valorMaximo - this.valorMinimo +1;

      if (numerosDisponibles < this.numerosAGenerar){
        this.showAlert("No se pueden generar " + this.numerosAGenerar + " números. El máximo de números a generar son " + numerosDisponibles);
        return formIsValid;
      }
    }

    formIsValid = true; 
    return formIsValid;
  }

  generarNumeros(){
    if (this.verifyForm()){
      
      this.numeros = [];
      

      
      let numerosExcluidos : number[] = [];

      var numerosAdded = 0;

      while (numerosAdded < this.numerosAGenerar){

        var max = this.valorMaximo;
        var min = this.valorMinimo;

        var numero = Math.floor((Math.random() * (max+1 - min)) +min);

        if (!numerosExcluidos.includes(numero)){
          this.numeros.push(numero);

          if (!this.permitirRepetidos){
            numerosExcluidos.push(numero);
          }

          numerosAdded++;
        }
      }

      
    }
  }

  showAlert(mensajeError : string){
    Swal.fire({
      text: mensajeError,
      icon: 'error',
      showCloseButton: true,
      timer: 3000,
      background: 'red',
      confirmButtonColor: '#4caf50',
      color: 'white',
      iconColor: 'white'
     
    })
  }



}
