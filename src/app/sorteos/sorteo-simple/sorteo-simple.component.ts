import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sorteo-simple',
  templateUrl: './sorteo-simple.component.html',
  styleUrls: ['./sorteo-simple.component.css'],
})
export class SorteoSimpleComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}

  participantes: string[] = [];
  newParticipante: string = '';

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

  
}
