
import { TestBed } from '@angular/core/testing';
import { PropertyService } from './property-service';
import { of } from 'rxjs';
import { Datasource } from './datasource/datasource.interface';
import { provideZonelessChangeDetection } from '@angular/core';
import { PaginationResult } from '../interfaces/Pagination';

describe('PropertyService', () => {
  let service: PropertyService;
  let mockDatasource: any;
  let paginationResult: PaginationResult = {
    total: 5,
    page_size: 10,
    page: 23,
    properties: []
  }

  beforeEach(() => {
    mockDatasource = {
      getPropertiesByPredicates: jasmine.createSpy().and.returnValue(of(paginationResult)),
    };

    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        PropertyService,
        { provide: Datasource, useValue: mockDatasource },
      ]
    });

    service = TestBed.inject(PropertyService);
  });

  it('should reset pagination when predicates are updated', () => {

    // Actualiza los predicados
    service.updateList([{ field: 'price', type: 'greater_than', value: '100000' }]);

    // Verifica que la paginación se reseteó
    expect(service.page$.value).toBe(0);
    expect(service.pageSize$.value).toBe(10);
  });
});