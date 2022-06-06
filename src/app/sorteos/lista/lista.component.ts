import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { Resultado } from '../interfaces/resultado.interface';
import { Sorteo } from '../interfaces/sorteo.interface';
import { SorteosService } from '../sorteos.service';

@Component({
  selector: 'app-lista',
  templateUrl: './lista.component.html',
  styleUrls: ['./lista.component.css']
})
export class ListaComponent implements OnInit {

  resultados : Resultado[] = [];

  constructor(private sorteosService: SorteosService,
    private authService: AuthService) { }

  ngOnInit(): void {
    this.getResultadosExternos()
  }

  getResultadosExternos(){
    //Comprobar si hay sesión iniciada
    
    let user = this.authService.getUser();
    

    if (user){
      
      let uidUser = user.uid;

      this.sorteosService.getResultados(uidUser).then((response) => {
       
        for (let i = 0; i< response.length; i++){
          let resultado : Resultado = {
            id: response[i].id,
            ganadores : response[i].ganadores,
            sorteo: response[i].sorteo
          }

          //Obtener el sorteo

          this.sorteosService.getSorteoOfReference(resultado.sorteo)
          .then((sorteoResponse) => {
            if (sorteoResponse){
              
              let sorteo: Sorteo = {
                id : sorteoResponse.id,
                titulo: sorteoResponse.titulo,
                participantes: sorteoResponse.participantes,
                fechaProgramada: sorteoResponse.fechaProgramada,
                numPremios: sorteoResponse.numPremios
              };

              resultado.sorteo = sorteo;

            }
          })

          this.resultados.push(resultado);
        }
        
      });


    }
  }





}
