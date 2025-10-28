import { Component, effect, inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../../shared/page/dialog.component';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { AgregarSolicitudDialogComponent } from './dialog/solicitud.component';
import { ProductoService } from '../services/producto.service';
import { Producto, Categoria, CategoriaDescripcion } from '../interfaces';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressBarModule } from '@angular/material/progress-bar';


@Component({
  selector: 'app-login-page',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTableModule,
    MatIconModule,
    MatProgressBarModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export default class dashboardPageComponent implements OnInit {


  mostrarLoadding: boolean = false;
  dataSource: MatTableDataSource<Producto>;

  constructor(
    private _formBuilder: FormBuilder,
    private _router: Router,
    private _dialog: MatDialog,
    private _productoService: ProductoService,
    private _snackBar: MatSnackBar,
  ) {
    this.dataSource = new MatTableDataSource<Producto>();
    console.log('llego al contructor del login');

    effect(async () => await this.effectGridProductos());

  }

  displayedColumns: string[] = [
    'nombre',
    'descripcion',
    'categoria',
    'precio',
    'stock',
    'acciones'
  ];

  editar(row: Producto) {

    this._productoService.seleccionarProducto(row);
    const dialogRef = this._dialog.open(AgregarSolicitudDialogComponent, {
      width: '500px'
    });

    dialogRef.afterClosed().subscribe(result => { });
  }

  eliminar(row: Producto) {
    this.mostrarLoadding = true;
    this._productoService.Eliminar(row.id)
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
          this.mostrarLoadding = false;
          this._productoService.obtenerProductos().subscribe();
        },
        error: (err) => {
          this._snackBar.open(`Error: ${err}`, 'Cerrar', {
            duration: 4000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass: ['snackbar-error']
          });
          this.mostrarLoadding = false;
        }
      });
  }

  ngOnInit(): void {
    this._productoService.obtenerProductos().subscribe();
  }

  async effectGridProductos(): Promise<void> {
    const productos = this._productoService.todosLosProductos();
    if (!productos) return;
    this.dataSource.data = productos;
  }

  obtenerCategoriaDescripcion(data: Categoria): string {
    const datos = CategoriaDescripcion[data];
    return datos;
  }

  abrirDialogo() {
    const dialogRef = this._dialog.open(AgregarSolicitudDialogComponent, {
      width: '500px'
    });

    dialogRef.afterClosed().subscribe(result => { });
  }

}
