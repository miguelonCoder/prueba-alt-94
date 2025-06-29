import { Component, inject } from '@angular/core';
import { HeaderList } from '../header-list/header-list';
import { Card } from '../card/card';
import { CommonModule } from '@angular/common';
import { PropertyService } from '../../services/property-service';
import { toSignal } from '@angular/core/rxjs-interop';
import { Status } from '../../interfaces/StatusResponse';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-list',
  imports: [HeaderList, Card, CommonModule, MatProgressSpinnerModule],
  templateUrl: './list.html',
  styleUrl: './list.scss'
})
export class List {
  service = inject(PropertyService)
  statusOption = Status
  properties = toSignal(this.service.properties$, { initialValue: {
    status: Status.LOADING,
    data: []
  } });
}
