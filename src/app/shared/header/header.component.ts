import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  menuActivado : boolean = false;
  menuSorteosActivado : boolean = false;
  menuDecisionesActivado : boolean = false;

  toggleMenu (){
    this.menuActivado = !this.menuActivado;
  }

  toggleMenuSorteos(){

    
    this.menuDecisionesActivado = false;

    this.menuSorteosActivado = !this.menuSorteosActivado;
  }

  toggleMenuDecisiones(){
    this.menuSorteosActivado = false;

    this.menuDecisionesActivado = !this.menuDecisionesActivado;
  }



  

    

}
