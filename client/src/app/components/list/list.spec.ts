import { ComponentFixture, TestBed } from '@angular/core/testing';

import { List } from './list';
import { provideZonelessChangeDetection } from '@angular/core';
import { Status, StatusResponse } from '../../interfaces/StatusResponse';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { PropertyService } from '../../services/property-service';
import { Property } from '../../interfaces/Property';

describe('List', () => {
  let component: List;
  let fixture: ComponentFixture<List>;
  let mockPropertyService: any;
  let mockProperties$: BehaviorSubject<StatusResponse<Property[]>>;


  beforeEach(async () => {

    mockProperties$ = new BehaviorSubject({ status: Status.LOADING } as StatusResponse<Property[]>);

    mockPropertyService = {
      properties$: mockProperties$
    }

    await TestBed.configureTestingModule({
      imports: [List],
      providers: [
        provideZonelessChangeDetection(),
        {
          provide: PropertyService,
          useValue: mockPropertyService
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(List);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should show loading state', () => {
    expect(component).toBeTruthy();
  });

  it('should display spinner when status is LOADING', () => {
    const spinner = fixture.nativeElement.querySelector('mat-spinner');
    expect(spinner).toBeTruthy();
  })

  it('should display error when status is ERROR', () => {
    mockProperties$.next({ status: Status.ERROR });
    fixture.detectChanges();

    const errorContainer = fixture.nativeElement.querySelector('.status-container');
    expect(errorContainer).toBeTruthy();

    const paragraph = errorContainer.querySelector('p');
    expect(paragraph?.textContent).toContain('Ha ocurrido un error al cargar los predios');
  })

  it('should display message when data is empty', () => {
    mockProperties$.next({ status: Status.SUCCESS, data: [] });
    fixture.detectChanges();
    
    const errorContainer = fixture.nativeElement.querySelector('.no-properties');
    expect(errorContainer).toBeTruthy();

    const paragraph = errorContainer.querySelector('p');
    expect(paragraph?.textContent).toContain('No Se han encontrado predios.');
  })
});
