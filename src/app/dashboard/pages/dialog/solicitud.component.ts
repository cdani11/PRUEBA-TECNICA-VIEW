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
import { obtenerTiposCompra, obtenerEstados } from '../../interfaces';
import { CommonModule } from '@angular/common';
import { SolicitudesService } from '../../services/solicitudes.service';
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
  tiposCompra: { descripcion: string; valor: number }[] = [];
  estados: { descripcion: string; valor: number }[] = [];
  habilitarCargando: boolean = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AgregarSolicitudDialogComponent>,
    private _solicitudesService: SolicitudesService,
    private _snackBar: MatSnackBar,
  ) {
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      direccionSolicitante: ['', Validators.required],
      descripcion: ['', Validators.required],
      fechaSolicitud: ['', Validators.required],
      tipoCompra: [null, Validators.required],
      estado: [null, Validators.required]
    });
  }
  ngOnInit(): void {
    setTimeout(() => {
      this.estados = obtenerEstados();
      this.tiposCompra = obtenerTiposCompra();
      this.setearDatosSolicitudes();
    });
  }

  guardar() {
    if (this.form.valid) {
      this.habilitarCargando = true;
      this.form.disable();
      const { nombre, direccionSolicitante, descripcion, fechaSolicitud, tipoCompra, estado } = this.form.value;

      const solicitud = this._solicitudesService.solicitudSeleccionada!;
      if (solicitud) {
        const idSolicitud = solicitud.id;
        this._solicitudesService.Actualizar(idSolicitud, nombre, direccionSolicitante, descripcion, fechaSolicitud, tipoCompra, estado)
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
              this._solicitudesService.obtenerSolicitudes().subscribe();;
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
        this._solicitudesService.registrarSolicitud(nombre, direccionSolicitante, descripcion, fechaSolicitud, tipoCompra, estado)
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
              this._solicitudesService.obtenerSolicitudes().subscribe();
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
    const solicitud = this._solicitudesService.solicitudSeleccionada;
    if (!solicitud) return;

    this.form.patchValue({
      nombre: solicitud.nombre!,
      direccionSolicitante: solicitud.direccionSolicitante,
      descripcion: solicitud.descripcion,
      fechaSolicitud: solicitud.fechaEsperada,
      tipoCompra: solicitud.tipoCompra,
      estado: solicitud.estadoSolicitud
    });
  }
}
