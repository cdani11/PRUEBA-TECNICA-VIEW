import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { Component, OnInit } from '@angular/core';
import { obtenerCategorias } from '../../interfaces';
import { CommonModule } from '@angular/common';
import { ProductoService } from '../../services/producto.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressBarModule } from '@angular/material/progress-bar';


@Component({
  selector: 'app-agregar-solicitud-dialog',
  templateUrl: './solicitud.component.html',
  styleUrl: './solicitud.component.css',
  imports: [
    MatDatepickerModule,
    ReactiveFormsModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    CommonModule,
    MatProgressBarModule
  ]
})
export class AgregarSolicitudDialogComponent implements OnInit {
  form: FormGroup;
  categorias: { descripcion: string; valor: number }[] = [];
  habilitarCargando: boolean = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AgregarSolicitudDialogComponent>,
    private _productoService: ProductoService,
    private _snackBar: MatSnackBar,
  ) {
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      categoria: ['', Validators.required],
      precio: [null, [Validators.required, Validators.min(0.01)]],
      stock: [null, [Validators.required, Validators.min(1)]]
    });
  }
  ngOnInit(): void {
    setTimeout(() => {
      this.categorias = obtenerCategorias();
      this.setearDatosSolicitudes();
    });
  }

  guardar() {
    if (this.form.valid) {
      this.habilitarCargando = true;
      this.form.disable();
      const { nombre, descripcion, categoria, precio, stock } = this.form.value;

      const producto = this._productoService.productoSeleccionado!;
      if (producto) {
        const idProducto = producto.id;
        this._productoService.Actualizar(idProducto, nombre, descripcion, categoria, null, precio, stock)
          .subscribe({
            next: (success) => {
              if (success) {
                this._snackBar.open('Registro guardado correctamente', 'Cerrar', {
                  duration: 3000,
                  horizontalPosition: 'center',
                  verticalPosition: 'top',
                  panelClass: ['snackbar-success']
                });
              }
              this.dialogRef.close(true);
              this.form.reset();
              this._productoService.obtenerProductos().subscribe();
            },
            error: (err) => {
              this._snackBar.open(`Error: ${err}`, 'Cerrar', {
                duration: 4000,
                horizontalPosition: 'center',
                verticalPosition: 'top',
                panelClass: ['snackbar-error']
              });
            }
          });
      } else {
        this._productoService.registrarProducto(nombre, descripcion, categoria, null, precio, stock)
          .subscribe({
            next: (success) => {
              if (success) {
                this._snackBar.open('Registro guardado correctamente', 'Cerrar', {
                  duration: 3000,
                  horizontalPosition: 'center',
                  verticalPosition: 'top',
                  panelClass: ['snackbar-success']
                });
              }
              this.dialogRef.close(true);
              this.form.reset();
              this._productoService.obtenerProductos().subscribe();
            },
            error: (err) => {
              this._snackBar.open(`Error: ${err}`, 'Cerrar', {
                duration: 4000,
                horizontalPosition: 'center',
                verticalPosition: 'top',
                panelClass: ['snackbar-error']
              });
            }
          });
      }



    }
  }

  setearDatosSolicitudes(): void {
    const producto = this._productoService.productoSeleccionado;
    if (!producto) return;

    this.form.patchValue({
      nombre: producto.nombre!,
      descripcion: producto.descripcion,
      categoria: producto.categoria,
      //imagen: producto.imagen,
      precio: producto.precio,
      stock: producto.stock,
    });
  }
}
