import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, retry } from 'rxjs';
import { Datasource } from './datasource.interface';
import { Property } from '../../interfaces/Property';
import { PaginationResult } from '../../interfaces/Pagination';
import { PropertyDetail } from '../../interfaces/PropertyDetail';

@Injectable({
  providedIn: 'root'
})
export class HttpSourceService extends Datasource {
  private apiUrl = 'http://localhost:8000'; // Usa la variable de entorno API_URL o valor por defecto
    private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    })
  };

  private http = inject(HttpClient)

  getProperties(): Observable<Property[]> {
    return this.http.get<Property[]>(`${this.apiUrl}/properties`)
      .pipe(
        retry(3),
        catchError((error) => {
          console.log('Error fetching properties:', error);
          throw error;
        })
      )
  }

  getProperty(id: number): Observable<PropertyDetail> {
    return this.http.get<PropertyDetail>(`${this.apiUrl}/properties/${id}`, this.httpOptions)
          .pipe(
        retry(3),
        catchError((error) => {
          console.log('Error fetching property:', error);
          throw error;
        })
      )
  }

  getPropertiesByPredicates(page: number, pageSize: number, predicates: any[]): Observable<PaginationResult> {
    const params = {
      page: page,
      page_size: pageSize,
      predicates: predicates
    };

    console.log(params)

    return this.http.post<PaginationResult>(`${this.apiUrl}/properties/page`, params, this.httpOptions)
      .pipe(
      retry(3),
      catchError((error) => {
        console.log('Error fetching properties by predicates:', error);
        throw error;
      })
      );
  }
}