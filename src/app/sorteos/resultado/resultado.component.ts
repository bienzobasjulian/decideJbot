import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Resultado } from '../interfaces/resultado.interface';
import { Sorteo } from '../interfaces/sorteo.interface';
import { SorteosService } from '../sorteos.service';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-resultado',
  templateUrl: './resultado.component.html',
  styleUrls: ['./resultado.component.css'],
})
export class ResultadoComponent implements OnInit {
  resultado!: Resultado;
  demo: any;
  hayResultados: boolean = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private sorteosService: SorteosService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    let resultadoObtenido;

    const id = this.activatedRoute.snapshot.paramMap.get('id');

    if (id) {
      //Obtener el resultado
      this.sorteosService.getResultadoPorId(id).then((response) => {
        //  console.log(response);

        if (!response) {
          //Si no existe el resultado, salimos de la página
          this.router.navigate(['/']);
        } else {
          // Si hay resultado...

          let resultado: Resultado;

          if (response.fecha){

            var fecha = new Date(response.fecha);

             resultado = {
              id: response!.id,
              ganadores: response!.ganadores,
              sorteo: response!.sorteo,
              fecha : response.fecha
              
            };

          }
          else{

            resultado = {
              id: response!.id,
              ganadores: response!.ganadores,
              sorteo: response!.sorteo,
              
            };
          }

          //Obtener el sorteo
          this.sorteosService
            .getSorteoOfReference(resultado.sorteo)
            .then((response) => {
              if (response) {
                if (response.fechaProgramada) {
                }

                let sorteo: Sorteo = {
                  id : response.id,
                  titulo: response.titulo,
                  participantes: response.participantes,
                  fechaProgramada: response.fechaProgramada,
                  numPremios: response.numPremios,
                };

                resultado.sorteo = sorteo;
                this.resultado = resultado;

                let fechaActual = new Date().valueOf();

                if (sorteo.fechaProgramada) {
                  let timeFechaProgramada = sorteo.fechaProgramada['seconds'];

                  let miFechaActual = new Date();

                  let fechaProgramada = new Date(timeFechaProgramada * 1000);

                  if (miFechaActual >= fechaProgramada) {
                    if (resultado.ganadores.length === 0) {
                      //Si no hay ganadores, se generan y se guardan
                      resultado.fecha = new Date();
                      // console.log(resultado.fecha);
                      this.generarResultados(sorteo);
                    } else {
                      //Si hay ganadores, se muestran
                      this.hayResultados = true;
                    }
                  } else {
                   

                    let countDownDate = fechaProgramada.getTime();

                    let x = setInterval(() => {
                      var now = new Date().getTime();
                      var distance = countDownDate - now;
                      var days = Math.floor(distance / (1000 * 60 * 60 * 24));
                      var hours = Math.floor(
                        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
                      );
                      var minutes = Math.floor(
                        (distance % (1000 * 60 * 60)) / (1000 * 60)
                      );
                      var seconds = Math.floor((distance % (1000 * 60)) / 1000);

                      this.demo =
                        days +
                        ' días ' +
                        hours +
                        'h ' +
                        minutes +
                        'm ' +
                        seconds +
                        's';

                      if (distance < 0) {
                        clearInterval(x);
                        this.generarResultados(sorteo);
                      }
                    });
                  }
                }
              }
            });
        }
      });
    } else {
      this.router.navigate(['/']);
    }
  }

  toTimeStamp(fechaActual: string) {
    var datum: number = Date.parse(fechaActual);
    return datum / 1000;
  }

  generarResultados(sorteo: Sorteo) {
    

    var index = 0;
    if (sorteo.numPremios) {
      for (index; index < sorteo.numPremios; index++) {
        var rand = Math.floor(Math.random() * sorteo.participantes.length);
        var ganador = sorteo.participantes[rand];

        if (this.resultado.ganadores.includes(ganador)) {
          //Si el ganador está en la lista...
          index--;
        } else {
          this.resultado.ganadores[index] = ganador;
        }
      }

      this.hayResultados = true;
      this.resultado.fecha = new Date();
      this.saveResultado();
    }
  }

  saveResultado() {
    //Comprobar si hay sesión iniciada
    let user = this.authService.getUser();

    let uidUser;

    if (user) {
      uidUser = user.uid;
    } else {
      uidUser = undefined;
    }

    console.log(this.resultado.sorteo.id);

    this.sorteosService.updateResultado(this.resultado, uidUser);
  }
}
