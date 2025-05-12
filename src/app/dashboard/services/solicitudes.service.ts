import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, Observable, of, tap, throwError } from 'rxjs';
import { environment } from '../../../environments/environments';
import { AuthService } from '../../auth/services/auth.service';
import { Solicitud, Solicitudes } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class SolicitudesService {
  private readonly baseUrlAdmin: string = environment.baseUrlAdmin;


  private _solicitudSeleccionada: Solicitud | null = null;
  get solicitudSeleccionada() { return this._solicitudSeleccionada; }

  private _todosLasSolicitudes = signal<Solicitud[] | null>(null);
  public todosLasSolicitudes = computed(() => this._todosLasSolicitudes());

  constructor(private _http: HttpClient, private _authService: AuthService) {

  }


  obtenerSolicitudes(): Observable<void> {
    const token = this._authService.currentUser()?.token;
    const usuario = this._authService.currentUser()?.usuario;

    if (!token || !usuario) {
      throw new Error('Token o usuario no disponible');
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    const url = `${this.baseUrlAdmin}/ConsultarSolicitudesPorUsuario?Usuario=${usuario}`;

    return this._http.get<Solicitudes>(url, { headers })
      .pipe(
        map(({ result }) => {
          this._todosLasSolicitudes.set(result);
          return;
        }),
        catchError(err => {
          return throwError(() => err.error.message);

        })
      )
  }


  Actualizar(id: number, nombre: string, direccionSolicitante: string,
    descripcion: string, fechaSolucitud: string,
    tipoCompra: number, estado: number): Observable<boolean> {

    const token = this._authService.currentUser()?.token;
    const usuario = this._authService.currentUser()?.usuario;

    if (!token || !usuario) {
      throw new Error('Token o usuario no disponible');
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    const solicitud = {
      id,
      nombre,
      direccionSolicitante,
      descripcion,
      fechaSolucitud,
      tipoCompra,
      estado,
      usuario
    };

    const url = `${this.baseUrlAdmin}/ActualizarSolicitudPorUsuario`;

    return this._http.put<boolean>(url, solicitud, { headers }).pipe(
      map((resp) => {
        // Si deseas actualizar solicitudes después de registrar, hazlo aquí.
        return resp;
      }),
      catchError(err => {
        return throwError(() => err?.error?.message ?? 'Error desconocido');
      })
    );
  }


  registrarSolicitud(nombre: string, direccionSolicitante: string,
    descripcion: string, fechaSolucitud: string,
    tipoCompra: number, estado: number): Observable<boolean> {

    const token = this._authService.currentUser()?.token;
    const usuario = this._authService.currentUser()?.usuario;

    if (!token || !usuario) {
      throw new Error('Token o usuario no disponible');
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    const solicitud = {
      nombre,
      direccionSolicitante,
      descripcion,
      fechaSolucitud,
      tipoCompra,
      estado,
      usuario
    };

    const url = `${this.baseUrlAdmin}/RegistrarSolicitudPorUsuario`;

    return this._http.post<boolean>(url, solicitud, { headers }).pipe(
      map((resp) => {
        // Si deseas actualizar solicitudes después de registrar, hazlo aquí.
        return resp;
      }),
      catchError(err => {
        return throwError(() => err?.error?.message ?? 'Error desconocido');
      })
    );
  }

  seleccionarSolicitud(solicitud: Solicitud): void {
    this._solicitudSeleccionada = solicitud;
  }

  Eliminar(id: number): Observable<boolean> {

    const token = this._authService.currentUser()?.token;
    const usuario = this._authService.currentUser()?.usuario;

    if (!token || !usuario) {
      throw new Error('Token o usuario no disponible');
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    const url = `${this.baseUrlAdmin}/EliminarSolicitudPorUsuario?idSolicitud=${id}&Usuario=${usuario}`;

    return this._http.delete<boolean>(url, { headers }).pipe(
      map((resp) => {
        return resp;
      }),
      catchError(err => {
        return throwError(() => err?.error?.message ?? 'Error desconocido');
      })
    );
  }
}
