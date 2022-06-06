import { JsonPipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { reduce } from 'rxjs';
import Swal from 'sweetalert2';
import { Sorteo } from '../interfaces/sorteo.interface';
import { SorteosService } from '../sorteos.service';
import { Resultado } from '../interfaces/resultado.interface';
import html2canvas from 'html2canvas';
import { AuthService } from '../../auth/auth.service';
import { getAuth } from 'firebase/auth';

@Component({
  selector: 'app-sorteo-simple',
  templateUrl: './sorteo-simple.component.html',
  styleUrls: ['./sorteo-simple.component.css'],
})
export class SorteoSimpleComponent implements OnInit {
  @ViewChild('inputNewParticipante') inputNewParticipante!: ElementRef;
  @ViewChild('inputNumPremios') inputNumPremios!: ElementRef;
  @ViewChild('inputTitleSorteo') inputTitleSorteo!: ElementRef;

  constructor(
    private sorteosService: SorteosService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {}

  title: string = 'Sorteo simple';
  descripcion: string =
    'Crea un sorteo índicando únicamente los participantes y el número de premios.';
  participantes: string[] = [];
  newParticipante: string = '';
  numPremios!: number;
  hayError: boolean = false;
  mensajeError: string = '';
  ganadores: string[] = [];
  showDivResultados: boolean = false;
  hayResultados: boolean = false;
  resultado!: Resultado;
  activarCuentaAtras = true;
  sorteo: Sorteo = {
    titulo: this.title,
    participantes: this.participantes,
  };

  mostrarCarga: boolean = false;
  tiempoCarga: number = 5;
  fechaSorteo: Date = new Date();
  sorteosLocales: Sorteo[] = [];
  sorteosExternos: Sorteo[] = [];

  stateSaveButtons: boolean = false;
  stateMainButtons: boolean = true;
  mostrarTablaSorteosLocales: boolean = false;
  mostrarTablaSorteosExternos: boolean = false;
  editInfoSorteo: boolean = false;

  showEditInfoSorteo() {
    this.editInfoSorteo = true;
  }

  saveTitleSorteo() {
    if (this.title.trim().length === 0) {
      this.title = 'Sorteo simple';
    }

    this.editInfoSorteo = false;
  }
  showSaveButtons() {
    this.stateMainButtons = false;
    this.stateSaveButtons = true;
  }

  showMainButtons() {
    this.stateSaveButtons = false;
    this.stateMainButtons = true;
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
      this.stateSaveButtons = false;
      this.stateMainButtons = true;
    }
  }

  setFocusOnNewParticipante() {
    this.inputNewParticipante.nativeElement.focus();
  }

  setFocusOnNumPremios() {
    this.inputNumPremios.nativeElement.focus();
  }

  removeAllParticipantes() {
    this.participantes = [];
  }

  mezclarParticipantes() {
    this.participantes = this.participantes.sort(() => Math.random() - 0.5);
  }

  sortear() {
    this.hayError = false;
    this.mensajeError = '';
    this.tiempoCarga = 5;
    this.hayResultados = false;
    this.showDivResultados = false;
    this.mostrarCarga = false;
    this.ganadores = [];

    if (this.numPremios == 0 || this.numPremios == null) {
      //Si no se indica el nº de premios, se repartirán tantos premios como participantes haya.
      this.numPremios = this.participantes.length;
    }

    //Si no hay participantes...
    if (this.participantes.length == 0) {
      this.hayError = true;
      this.mensajeError = 'Por lo menos debe haber un participante';
      this.showAlert(this.mensajeError);
    } else if (this.numPremios > this.participantes.length) {
      //Si hay más premios que participantes...
      this.hayError = true;
      this.mensajeError = 'No puede haber más premios que participantes';
      this.showAlert(this.mensajeError);
    } else {
      //Si está todo OK...
      this.showDivResultados = true; //Para mostrar el div.row de los resultados
      this.mostrarCarga = true; //Para mostrar la carga de los resultados
      
      if (this.activarCuentaAtras){
        this.cuentaAtras();
      }
      else{
        this.generarResultados();
      }
      
    }
  }

  cuentaAtras() {
    setTimeout(() => {
      this.tiempoCarga--;
      this.procesoCuentaAtras();
    }, 1000);
  }

  procesoCuentaAtras() {
    if (this.tiempoCarga == 0) {
      this.generarResultados();
    } else {
      this.cuentaAtras();
    }
  }

  generarResultados() {
    this.mostrarCarga = false;

    var i = 0;
    for (i; i < this.numPremios; i++) {
      var rand = Math.floor(Math.random() * this.participantes.length);
      var ganador = this.participantes[rand];

      if (this.ganadores.includes(ganador)) {
        //Si el ganador está en la lista...
        i--;
      } else {
        this.ganadores[i] = ganador;
      }
    }

    this.hayResultados = true;
    this.fechaSorteo = new Date();

    const idResultado: string =
      'SS' +
      this.fechaSorteo.getDay() +
      this.fechaSorteo.getMonth() +
      this.fechaSorteo.getFullYear() +
      this.fechaSorteo.getHours() +
      this.fechaSorteo.getMinutes() +
      this.fechaSorteo.getSeconds() +
      this.fechaSorteo.getMilliseconds();

    this.resultado = {
      id: idResultado,
      fecha: this.fechaSorteo,
      ganadores: this.ganadores,
      sorteo: this.sorteo,
    };
  }

  saveResultadosImg() {
    var divResultados: HTMLElement =
      document.getElementById('containerGanadores')!;
    html2canvas(divResultados).then(function (canvas) {
      var a = document.createElement('a');
      a.href = canvas
        .toDataURL('image/jpeg')
        .replace('image/jpeg', 'image/octet-stream');
      a.download = 'resultados.jpg';
      a.click();
    });
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
      willClose: () => {
        this.hayError = false;
        this.mensajeError = '';
      },
    });
  }

  saveSorteoLocalmente() {
    let sorteo: Sorteo = {
      titulo: this.title,
      participantes: this.participantes,
    };
    var sorteos: Sorteo[] = [];

    if (localStorage.getItem('sorteos') == null) {
      localStorage.setItem('sorteos', '[]');
    }

    sorteos = JSON.parse(localStorage.getItem('sorteos') || '');

    if (sorteos.includes(sorteo)) {
      alert('Este sorteo ya está guardado');
    } else {
      sorteos.push(sorteo);
      this.sorteosLocales = sorteos;

      localStorage.setItem('sorteos', JSON.stringify(sorteos));
      alert('Sorteo guardado localmemte');
    }
  }

  saveSorteoExternamente() {
    //Comprobar si hay sesión iniciada
    let user = this.authService.getUser();

    if (user) {
      let uidUser = user.uid;

      let sorteo: Sorteo = {
        titulo: this.title,
        participantes: this.participantes,
      };

      this.sorteosService.saveSorteoExterno(sorteo, uidUser);
    } else {
      alert('Necesitas iniciar sesión para hacer esto');
    }
  }

  getSorteosLocales() {
    this.sorteosLocales = this.sorteosService.getSorteosOfLocal();
    if (this.sorteosLocales.length > 0) {
      this.mostrarTablaSorteosLocales = true;
    }
  }

  getSorteosExternos() {
    //Comprobar si hay sesión iniciada
    let user = this.authService.getUser();

    if (user) {
      let uidUser = user.uid;

      this.sorteosService.getSorteosExternos(uidUser).then((datos) => {
        for (let i = 0; i < datos.length; i++) {
          let sorteo: Sorteo = {
            titulo: datos[i].titulo,
            participantes: datos[i].participantes,
          };

          this.sorteosExternos.push(sorteo);
        }

        

        if (this.sorteosExternos.length > 0) {
          this.mostrarTablaSorteosExternos = true;
        }
      });
    } else {
      alert("Para mostrar sorteos almacenados externamente, se requiere iniciar sesión")
    }
  }

  showAllSorteos(){
    this.getSorteosLocales();

    this.getSorteosExternos();
  }

  addParticipantes(participantesSeleccionados: string[]) {
    participantesSeleccionados.forEach((item, index) => {
      var valorParticipante = participantesSeleccionados[index];

      if (!this.participantes.includes(valorParticipante)) {
        this.participantes.push(valorParticipante);
      }
    });
  }

  showReplaceModal(participantesSeleccionados: string[]) {
    Swal.fire({
      title: '¿Reemplazar participantes?',
      text: 'Los participantes anteriores se perderán.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, reemplazar',
      cancelButtonText: 'No, cancelar',
      confirmButtonColor: '#4caf50',
      cancelButtonColor: 'red',
    }).then((result) => {
      if (result.isConfirmed) {
        this.replaceParticipantes(participantesSeleccionados);
      }
    });
  }

  replaceParticipantes(participantesSeleccionados: string[]) {
    this.participantes = participantesSeleccionados;
  }

  showDeleteSorteoLocalModal(index: number) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'El sorteo se borrará del navegador actual',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'No, cancelar',
      confirmButtonColor: '#4caf50',
      cancelButtonColor: 'red',
    }).then((result) => {
      if (result.isConfirmed) {
        this.deleteSorteoLocal(index);
      }
    });
  }

  deleteSorteoLocal(index: number) {
    var sorteos: Sorteo[] = [];
    sorteos = JSON.parse(localStorage.getItem('sorteos') || '');

    sorteos.splice(index, 1), (this.sorteosLocales = sorteos);

    localStorage.setItem('sorteos', JSON.stringify(sorteos));
  }

  showDeleteAllLocalesModal() {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Todos los sorteos almacenados localmente se eliminarán del navegador actual',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'No, cancelar',
      confirmButtonColor: '#4caf50',
      cancelButtonColor: 'red',
    }).then((result) => {
      if (result.isConfirmed) {
        this.deleteAllLocales();
      }
    });
  }

  deleteAllLocales() {
    localStorage.removeItem('sorteos');
    this.sorteosLocales = [];
  }

  showSaveInfoModal() {
    Swal.fire({
      icon: 'question',
      title: '¿Dónde se almacenan mis sorteos?',
      html:
        '<b>Almacenamiento local: </b>Almacenamiento en el navegador. (No es necesario inciar sesión. Los datos se guardan en un único navegador) ' +
        '<p> <b>Almacenamiento externo: </b> Almacenamiento en base de datos. (Inicio de sesión necesario. Datos más seguros. Datos compartidos con la aplicación móvil) </p>' +
        '<p> <b>Almacenamiento mixto: </b> Los datos se almacenan en el navegador y en la base de datos. </p>',
    });
  }

  //TODO: btnCopy

  //TODO: Exportar / Descargar / Guardar
}
