import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';

import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { MatDialog } from "@angular/material/dialog";

import { ModalUsuarioComponent } from '../../Modales/modal-usuario/modal-usuario.component';
import { Usuario } from 'src/app/Interfaces/usuario';
import { UsuarioService } from 'src/app/Services/usuario.service';
import { UtilidadService } from 'src/app/Reutilizable/utilidad.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent implements OnInit, AfterViewInit {
  
  columnsTabla:string[] = ['nombreCompleto', 'correo', 'rolDescripcion', 'estado', 'acciones']; //nombre de las columnas para la tabla
  dataInicio:Usuario[]=[];
  dataListaUsuario = new MatTableDataSource(this.dataInicio);
  @ViewChild(MatPaginator) paginacionTabla! : MatPaginator;

  constructor(
    private dialog:MatDialog,
    private _usuarioServicio:UsuarioService,
    private _utilidadServicio: UtilidadService
  ) {

    
  }
  ngAfterViewInit(): void {
    this.dataListaUsuario.paginator = this.paginacionTabla;
  }
  
  ngOnInit(): void {
    this.obtenerUsuarios();
  }

  obtenerUsuarios(){
    this._usuarioServicio.lista().subscribe({ 
      next: (data) => {
        if(data.status){
          this.dataListaUsuario.data = data.value;
        }else{
          this._utilidadServicio.mostrarAlerta("No se encontraron datos", "Oops!");
        }
      },
      error:(e)=>{
      }
    });
  }

  aplicarFiltroTabla(event: Event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataListaUsuario.filter = filterValue.trim().toLocaleLowerCase();
  }

  nuevoUsuario(){
    this.dialog.open(ModalUsuarioComponent, {
      disableClose: true
    }).afterClosed().subscribe(resultado => { //despues de cerrarse el modal de usuario, espera la respuesta al cerrarse si se grabo o no para listar nuevamente
      if(resultado === "true"){
        this.obtenerUsuarios();
      }
    });
  }

  editarUsuario(usuario:Usuario){
    this.dialog.open(ModalUsuarioComponent, {
      disableClose: true,
      data: usuario
    }).afterClosed().subscribe(resultado => { //despues de cerrarse el modal de usuario, espera la respuesta al cerrarse si se edito o no para listar nuevamente
      if(resultado === "true"){
        this.obtenerUsuarios();
      }
    });
  }

  eliminarUsuario(usuario:Usuario){
    Swal.fire({
      title: '¿Desea eliminar el usuario?',
      text: usuario.nombreCompleto,
      icon: 'warning',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Si, eliminar',
      showCancelButton: true,
      cancelButtonColor: '#d33',
      cancelButtonText: 'No, volver'
    }).then((resultado) => {
      if(resultado.isConfirmed){
        this._usuarioServicio.eliminar(usuario.idUsuario).subscribe({
          next:(data)=>{
            if(data.status){
              this._utilidadServicio.mostrarAlerta("El usuario fue eliminado", "¡Listo!");
              this.obtenerUsuarios();
            }else{
              this._utilidadServicio.mostrarAlerta("No se pudo eliminar el usuario", "Error");
            }
          },
          error:(e) => {}
        });
      }
    });


  }

}
