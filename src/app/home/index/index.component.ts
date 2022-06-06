import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { Resultado } from 'src/app/sorteos/interfaces/resultado.interface';
import { SorteosService } from 'src/app/sorteos/sorteos.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {

  misResultados : Resultado[] = [];

  constructor(private sorteosService: SorteosService,
    private authService: AuthService) { }

  ngOnInit(): void {
    this.getResultados();
  }

  getResultados(){
     //Comprobar si hay sesión iniciada
    
     let user = this.authService.getUser();
   
 
     if (user){
      let uidUser = user.uid;
      
      this.sorteosService.getResultados(uidUser).then((response) => {

        for (let i = 0; i < response.length; i++){
          let resultado : Resultado = {
            id: response[i].id,
            ganadores : response[i].ganadores,
            sorteo: response[i].sorteo
          }

          this.misResultados.push(resultado);

        }

      });
     }

  }





}
