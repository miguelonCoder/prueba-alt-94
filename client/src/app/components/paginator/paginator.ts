import { Component, inject } from '@angular/core';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { PropertyService } from '../../services/property-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-paginator',
  imports: [MatPaginatorModule, CommonModule],
  templateUrl: './paginator.html',
  styleUrl: './paginator.scss'
})
export class Paginator {
  service = inject(PropertyService);
  
  handleChangePage(event: PageEvent) {
    if (event.pageSize === 0) {
      return;
    }
    // Reset the page to 1 if the page size changes
    if (event.pageSize !== this.service.pageSize$.value) {
      this.service.page$.next(1);
    }
    // Update the page size
    this.service.pageSize$.next(event.pageSize);
    // Update the current page  
    this.service.updatePage(event.pageIndex );
  }
}
