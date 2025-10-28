import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, Observable, of, tap, throwError } from 'rxjs';
import { environment } from '../../../environments/environments';
import { AuthService } from '../../auth/services/auth.service';
import { Producto, Productos } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  private readonly baseUrlAdmin: string = environment.baseUrlAdmin;


  private _productoSeleccionado: Producto | null = null;
  get productoSeleccionado() { return this._productoSeleccionado; }

  private _todosLosProductos = signal<Producto[] | null>(null);
  public todosLosProductos = computed(() => this._todosLosProductos());

  constructor(private _http: HttpClient, private _authService: AuthService) {

  }


  obtenerProductos(): Observable<void> {
    const token = this._authService.currentUser()?.token;
    const usuario = this._authService.currentUser()?.usuario;

    if (!token || !usuario) {
      throw new Error('Token o usuario no disponible');
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    const url = `${this.baseUrlAdmin}`;

    return this._http.get<Productos>(url, { headers })
      .pipe(
        map(({ result }) => {
          this._todosLosProductos.set(result);
          return;
        }),
        catchError(err => {
          return throwError(() => err.error.message);

        })
      )
  }


  Actualizar(id: number, nombre: string, descripcion: string,
    categoria: number, imagen: string | null,
    precio: number, stock: number): Observable<boolean> {

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
      descripcion,
      categoria,
      imagen,
      precio,
      stock
    };

    const url = `${this.baseUrlAdmin}`;

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


  registrarProducto(nombre: string, descripcion: string,
    categoria: number, imagen: string | null,
    precio: number, stock: number): Observable<boolean> {

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
      descripcion,
      categoria,
      imagen,
      precio,
      stock
    };

    const url = `${this.baseUrlAdmin}`;

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

  seleccionarProducto(producto: Producto): void {
    this._productoSeleccionado = producto;
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
