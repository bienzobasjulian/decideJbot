import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  public isLogged = false;
  
  constructor(private authService : AuthService,
    private router : Router) { }

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

  async register(){
    const {email, password} = this.usuario;

   const response = await this.authService.register(email, password).catch(error => {
        alert("Error al registrar");
    })

    if (response){
      alert("Registrado correctamente");
    }
  }

}
