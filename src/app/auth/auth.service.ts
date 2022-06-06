import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import { AngularFireModule } from '@angular/fire/compat';
import { User } from '@firebase/auth';
import { first } from 'rxjs';
import { getAuth } from "firebase/auth";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public user !: User;

 

  constructor(private angularFireAuth: AngularFireAuth) { }

   register(email: string, password: string) {
  
      return  this.angularFireAuth.createUserWithEmailAndPassword(email, password);

  }

  login(email: string, password: string)  {
    return this.angularFireAuth.signInWithEmailAndPassword(email,password);
     
      
  }

  loginWithGoogle(email: string, password: string) {
   

      return  this.angularFireAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider());

   
  }

  getUserLogged() {
   
    return this.angularFireAuth.authState;
  }

  getCurrentUser() {
    return this.angularFireAuth.authState.pipe(first()).toPromise();
  }

  getUser(){
  const auth = getAuth();
  const user = auth.currentUser;

  return user;
  }

  

  logOut(){
    this.angularFireAuth.signOut();
  }
}


