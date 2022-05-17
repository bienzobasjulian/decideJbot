import { Component, Input, OnInit } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    this.showAlert();
  }

  @Input() hayError : boolean = false;
  @Input() mensajeError : string = '';

  showAlert(){
     
    Swal.fire({
      text: this.mensajeError,
      icon: 'error',
      showCloseButton: true,
      timer: 3000,
      background: 'red',
      color: 'white',
      iconColor: 'white',
      willClose: () => { this.hayError = false; this.mensajeError = '';}
     
    })

    
  }

}


