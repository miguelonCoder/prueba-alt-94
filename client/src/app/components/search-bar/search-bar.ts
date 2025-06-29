import { Component, inject, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Predicate } from '../../interfaces/Predicate';
import { map } from 'rxjs';
import { PropertyService } from '../../services/property-service';

@Component({
  selector: 'app-search-bar',
  imports: [ReactiveFormsModule],
  templateUrl: './search-bar.html',
  styleUrl: './search-bar.scss'
})
export class SearchBar implements OnInit {
  pattern = new FormControl('');
  service = inject(PropertyService)

  ngOnInit(){
    this.pattern.valueChanges
    .pipe(
      map(value => this.buildPredicates(value)),
    )
    .subscribe(value => {
      this.service.updateList(value);
    });
  }

  private buildPredicates(value: string | null): Predicate[]{

    if (!value) return []

    return [
      {
        value: value,
        type: 'contains',
        field: 'titulo' 
      },
      {
        value: value,
        type: 'contains',
        field: 'ciudad' 
      }
    ]
  }
}
