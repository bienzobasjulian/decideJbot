import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private authService : AuthService,
    private router: Router) { }


  usuarioLogueado = this.authService.getUserLogged();
  
  public isLogged = false;


  async ngOnInit(): Promise<void> {

    const user = await this.authService.getCurrentUser();
    if (user){
     
      this.isLogged = true;
    }

    if (this.isLogged){
      this.router.navigate(['/']);
    }
     
  }

  usuario = {
    email: '',
    password: ''
  }

  



  async login(){

    const {email, password} = this.usuario;

    const response = await this.authService.login(email, password)
    .catch(error => {
      alert("Usuario o contraseña inválidos");
    });

    if (response){
      const user = this.authService.getUserLogged();

      if (user){
        this.router.navigate(['/']);
      }
    }
  
  }

  async loginWithGoogle(){
    const {email, password} = this.usuario;
     const response = await this.authService.loginWithGoogle(email, password)
     .catch(error => {
      alert("Fallo al loguearse con Google");
    });

    if (response){
      const user = this.authService.getUserLogged();

      if (user){
        this.router.navigate(['/']);
      }
    }


  }

  

}
