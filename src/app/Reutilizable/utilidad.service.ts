import { Injectable } from '@angular/core';

import { MatSnackBar } from "@angular/material/snack-bar";
import { Sesion } from "../Interfaces/sesion";

@Injectable({
  providedIn: 'root'
})
export class UtilidadService {

  constructor(
    private _snackBar:MatSnackBar
  ) { }

  mostrarAlerta(mensaje:string, tipo:string){
    this._snackBar.open(mensaje, tipo, {
      horizontalPosition: "end",
      verticalPosition:"top",
      duration:3000
    });
  }

  guardarSesionUsuario(usuarioSession:Sesion){ //Guardar Sesion del usuario
    localStorage.setItem("usuario", JSON.stringify(usuarioSession));
  }

  obtenerSesionUsuario(){
    const dataCadena = localStorage.getItem("usuario");

    const usuario = JSON.parse(dataCadena!); // ! = ignora la posibilidad de que sea nulo

    return usuario;
  }

  eliminarSesionUsuario(){
    localStorage.removeItem("usuario");
  }
}
