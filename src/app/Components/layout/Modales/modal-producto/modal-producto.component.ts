import { Component,OnInit, Inject } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from "@angular/forms"; //para trabajar con formularios reactivos
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog"; //Para recibir los datos desde el componente que abre el modal

import { Categoria } from 'src/app/Interfaces/categoria';
import { Producto } from 'src/app/Interfaces/producto';
import { CategoriaService } from 'src/app/Services/categoria.service';
import { ProductoService } from 'src/app/Services/producto.service';
import { UtilidadService } from 'src/app/Reutilizable/utilidad.service';

@Component({
  selector: 'app-modal-producto',
  templateUrl: './modal-producto.component.html',
  styleUrls: ['./modal-producto.component.css']
})
export class ModalProductoComponent implements OnInit{

  formularioProducto:FormGroup; // Representa los campos del formulario asociados al componente
  tituloAccion:string="Agregar";
  botonAccion:string="Guardar";
  listaCategorias:Categoria[] = []; //variable que se usa en los select del html

  constructor(
    private modalActual: MatDialogRef<ModalProductoComponent>, //Indica que el componente que se está utilizando como contenido dentro del cuadro de diálogo y proporciona metodos para controlar el cuadro de dialogo.
    @Inject(MAT_DIALOG_DATA) public datosProducto: Producto, //@Inject(MAT_DIALOG_DATA) = Angular se encarga de inyectar los datos pasados al componente de diálogo cuando se abre el diálogo modal.
    private fb: FormBuilder, //es un servicio proporcionado por Angular que simplifica la creación y administración de formularios en Angular. Permite crear instancias de FormGroup y FormControl de una manera más concisa y legible que hacerlo manualmente.
    private _categoriaService: CategoriaService,
    private _productoServicio: ProductoService,
    private _utilidadServicio: UtilidadService
  ) {

    this.formularioProducto = this.fb.group({ //creacion del formulario de angular
      nombre: ["", Validators.required],
      idCategoria: ["", Validators.required],
      stock: ["", Validators.required],
      precio: ["", Validators.required],
      esActivo: ["1", Validators.required]
    });

    if(this.datosProducto != null){ // si hay trae datos al abrir el modal, entonces es una edicion
      this.tituloAccion = "Editar";
      this.botonAccion = "Actualizar";
    }

    this._categoriaService.lista().subscribe({ //lista las categorias de la base de datos en la variable declarada fuera del constructor
      next: (data) => {
        if(data.status){
          this.listaCategorias = data.value;
        }
      },
      error:(e)=>{
      }
    });
  }

  ngOnInit(): void {
    if(this.datosProducto != null){ // si hay trae datos al abrir el modal

      this.formularioProducto.patchValue({ //establece los valores de los controles del formulario del componente actual
        nombre: this.datosProducto.nombre,
        idCategoria: this.datosProducto.idCategoria,
        stock: this.datosProducto.stock,
        precio: this.datosProducto.precio,
        esActivo: this.datosProducto.esActivo.toString()
      });
    }
  }

  guardarEditar_Producto(){

    const _producto:Producto = {
      idProducto: this.datosProducto == null ? 0 : this.datosProducto.idProducto, //si es null entonces es un nuevo producto a crea y se coloca 0, si no es null entonces se obtiene los datos para editar
      nombre: this.formularioProducto.value.nombre,
      idCategoria: this.formularioProducto.value.idCategoria,
      descripcionCategoria: "",
      precio: this.formularioProducto.value.precio,
      stock: this.formularioProducto.value.stock,
      esActivo: parseInt(this.formularioProducto.value.esActivo)
    }

    if(this.datosProducto == null){ //LOGICA PARA CREAR producto
      this._productoServicio.guardar(_producto).subscribe({ //subscribe obtiene la informacion de la ejecucion
        next: (data)=>{
          if(data.status){
            this._utilidadServicio.mostrarAlerta("El producto fue registrado.","Exito");
            this.modalActual //modalActual hace referencia al componente actual y el metodo close() indica que se cerrara el componente(modal)
                .close("true"); //el parametro "true" sirve para enviar informacion al boton que abrio el modal cuando este se cierre.
          }
          else{
            this._utilidadServicio.mostrarAlerta("No se pudo registrar el producto","Error");
          }
        },
        error:(e) =>{}
      });
    }
    else{
      this._productoServicio.editar(_producto).subscribe({ //subscribe obtiene la informacion de la ejecucion
        next: (data)=>{
          if(data.status){
            this._utilidadServicio.mostrarAlerta("El producto fue actualizado.","Exito");
            this.modalActual //modalActual hace referencia al componente actual y el metodo close() indica que se cerrara el componente(modal)
                .close("true"); //el parametro "true" sirve para enviar informacion al boton que abrio el modal cuando este se cierre.
          }
          else{
            this._utilidadServicio.mostrarAlerta("No se pudo actualizar el producto","Error");
          }
        },
        error:(e) =>{}
      });
    }

  }

  
}
