import { Observable } from "rxjs";
import { Property } from "../../interfaces/Property";
import { Predicate } from "../../interfaces/Predicate";
import { PaginationResult } from "../../interfaces/Pagination";
import { PropertyDetail } from "../../interfaces/PropertyDetail";

export abstract class Datasource {
  abstract getProperties(): Observable<Property[]>
  abstract getProperty(id: number): Observable<PropertyDetail>
  abstract getPropertiesByPredicates(page: number, pageSize: number, predicates: Predicate[]): Observable<PaginationResult>;
}