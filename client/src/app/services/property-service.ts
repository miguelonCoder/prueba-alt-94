import { Status, StatusResponse } from './../interfaces/StatusResponse';
import { inject, Injectable } from "@angular/core";
import { Datasource } from "./datasource/datasource.interface";
import { BehaviorSubject, catchError, combineLatest, debounceTime, map, Observable, of, startWith, switchMap, tap } from "rxjs";
import { Predicate } from '../interfaces/Predicate'
import { Property } from '../interfaces/Property';
import { PropertyDetail } from '../interfaces/PropertyDetail';


@Injectable({
  providedIn: 'root'
})
export class PropertyService {
  datasource = inject(Datasource);

  predicates$ = new BehaviorSubject<Predicate[]>([])
  page$ = new BehaviorSubject<number>(0);
  pageSize$ = new BehaviorSubject<number>(10);
  total$ = new BehaviorSubject<number>(0);

  idProperty$ = new BehaviorSubject<number | null>(null);

  // Este observable mapea el valor del buscador a los predicados y convierte el flujo a
  // una peticion para la api, que devuelve el valor envuelto en un statusResponse
  // para manejar el estado entre loading, success y error
  // TODO: Con mas tiempo podria implementar un mejor manejador de errores
  properties$: Observable<StatusResponse<Property[]>> = combineLatest([
    this.page$,
    this.pageSize$,
    this.predicates$.pipe(
      debounceTime(200), // Espera 300ms antes de emitir el valor
      tap(() => {
        this.resetPagination()
      })
    )
  ]).pipe(
    switchMap(([page, pageSize, predicates]) => 
      this.datasource.getPropertiesByPredicates(page + 1, pageSize, predicates)
    ),
    tap(response => this.total$.next(response.total)),
    map(response => {return {
      status: Status.SUCCESS,
      data: response.properties
    }}),
    catchError(error => of({
      status: Status.ERROR
    })),
    startWith({status: Status.LOADING})
  )
  
  resetPagination(){
    this.page$.next(0);
    this.pageSize$.next(10);
  }

  //Esta es la función lanzada desde el componente de búsqueda
  updateList(predicates: Predicate[]) {
    this.predicates$.next(predicates);
  }

  updatePage(page: number) {
    this.page$.next(page);
  }

  // A partir de aqui inicia el perfil de la propiedad

  setIdProperty(id: number | null) {
    this.idProperty$.next(id);
  }

  // Este observable obtiene el detalle de la propiedad a partir del idProperty$
  // y lo envuelve en un StatusResponse para manejar el estado de la petición
  profile$: Observable<StatusResponse<PropertyDetail>> = this.idProperty$.pipe(
    switchMap(id => {
      if (id === null) {
        return of({
          status: Status.ERROR
        })
      }
      return this.datasource.getProperty(id).pipe(
        map(propertyDetail => {
          return {
            status: Status.SUCCESS,
            data: propertyDetail
          };
        }),
        catchError(error => of({
          status: Status.ERROR
        })),
        startWith({status: Status.LOADING}),
        tap((res)=> console.log(res))
      );
    }
  ));
  
}