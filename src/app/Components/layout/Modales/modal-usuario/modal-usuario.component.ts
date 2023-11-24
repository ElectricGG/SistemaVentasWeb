import { Component, OnInit, Inject } from '@angular/core'; //Inject = permite recibir informacion desde otro componente

import { FormBuilder, FormGroup, Validators } from "@angular/forms"; //para trabajar con formularios reactivos
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog"; //Para recibir los datos desde el componente que abre el modal
import { Rol } from 'src/app/Interfaces/rol';
import { Usuario } from 'src/app/Interfaces/usuario';
import { UsuarioService } from 'src/app/Services/usuario.service';
import { UtilidadService } from 'src/app/Reutilizable/utilidad.service';
import { RolService } from 'src/app/Services/rol.service';

@Component({
  selector: 'app-modal-usuario',
  templateUrl: './modal-usuario.component.html',
  styleUrls: ['./modal-usuario.component.css']
})
export class ModalUsuarioComponent implements OnInit{

  formularioUsuario:FormGroup; // Representa los campos del formulario asociados al componente
  ocultarPassword:boolean = true;
  tituloAccion:string="Agregar";
  botonAccion:string="Guardar";
  listaRoles:Rol[] = []; //variable que se usa en los select del html

  constructor(
    private modalActual: MatDialogRef<ModalUsuarioComponent>, //Indica que el componente que se está utilizando como contenido dentro del cuadro de diálogo y proporciona metodos para controlar el cuadro de dialogo.
    @Inject(MAT_DIALOG_DATA) public datosUsuario: Usuario, //@Inject(MAT_DIALOG_DATA) = Angular se encarga de inyectar los datos pasados al componente de diálogo cuando se abre el diálogo modal.
    private fb: FormBuilder, //es un servicio proporcionado por Angular que simplifica la creación y administración de formularios en Angular. Permite crear instancias de FormGroup y FormControl de una manera más concisa y legible que hacerlo manualmente.
    private _rolServicio: RolService,
    private _usuarioServicio: UsuarioService,
    private _utillidadServicio:UtilidadService //injecta UtilidadService para poder usar sus metodos como el mostrarAlerta
  ) {
    
    //asignacion del formGroup
    this.formularioUsuario = this.fb.group({ //creacion del formulario de angular
      nombreCompleto: ['',Validators.required],
      correo: ['',Validators.required],
      idRol: ['',Validators.required],
      clave: ['',Validators.required],
      esActivo: ['1',Validators.required]
    });

    if(this.datosUsuario != null){ // si hay trae datos al abrir el modal, entonces es una edicion
      this.tituloAccion = "Editar";
      this.botonAccion = "Actualizar";
    }

    this._rolServicio.lista().subscribe({ //lista los roles de la base de datos en la variable declarada fuera del constructor
      next: (data) => {
        if(data.status){
          this.listaRoles = data.value;
        }
      },
      error:(e)=>{
      }
    });
  }

  ngOnInit(): void {
    if(this.datosUsuario != null){ // si hay trae datos al abrir el modal

      this.formularioUsuario.patchValue({ //establece los valores de los controles del formulario del componente actual
        nombreCompleto: this.datosUsuario.nombreCompleto,
        correo: this.datosUsuario.correo,
        idRol: this.datosUsuario.idRol,
        clave: this.datosUsuario.clave,
        esActivo: this.datosUsuario.esActivo.toString()
      });
    }
  }

  guardarEditar_Usuario(){

    const _usuario:Usuario = {
      idUsuario: this.datosUsuario == null ? 0 : this.datosUsuario.idUsuario, //si es null entonces es un nuevo usuario a crea y se coloca 0, si no es null entonces se obtiene los datos para editar
      nombreCompleto: this.formularioUsuario.value.nombreCompleto,
      correo: this.formularioUsuario.value.correo,
      idRol: this.formularioUsuario.value.idRol,
      rolDescripcion: '',
      clave: this.formularioUsuario.value.clave,
      esActivo: parseInt(this.formularioUsuario.value.esActivo)
    }

    if(this.datosUsuario == null){ //LOGICA PARA CREAR USUARIO
      this._usuarioServicio.guardar(_usuario).subscribe({ //subscribe obtiene la informacion de la ejecucion
        next: (data)=>{
          if(data.status){
            this._utillidadServicio.mostrarAlerta("El usuario fue registrado.","Exito");
            this.modalActual //modalActual hace referencia al componente actual y el metodo close() indica que se cerrara el componente(modal)
                .close("true"); //el parametro "true" sirve para enviar informacion al boton que abrio el modal cuando este se cierre.
          }
          else{
            this._utillidadServicio.mostrarAlerta("No se pudo registrar el usuario","Error");
          }
        },
        error:(e) =>{}
      });
    }
    else{
      this._usuarioServicio.editar(_usuario).subscribe({ //subscribe obtiene la informacion de la ejecucion
        next: (data)=>{
          if(data.status){
            this._utillidadServicio.mostrarAlerta("El usuario fue actualizado.","Exito");
            this.modalActual //modalActual hace referencia al componente actual y el metodo close() indica que se cerrara el componente(modal)
                .close("true"); //el parametro "true" sirve para enviar informacion al boton que abrio el modal cuando este se cierre.
          }
          else{
            this._utillidadServicio.mostrarAlerta("No se pudo actualizar el usuario","Error");
          }
        },
        error:(e) =>{}
      });
    }

  }

}
