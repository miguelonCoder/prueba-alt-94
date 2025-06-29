import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PropertyService } from '../../services/property-service';
import { toSignal } from '@angular/core/rxjs-interop';
import { Status } from '../../interfaces/StatusResponse';
import { MatProgressSpinner, MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { Card } from '../../components/card/card';

@Component({
  selector: 'app-profile',
  imports: [ MatProgressSpinnerModule, CommonModule, Card],
  templateUrl: './profile.html',
  styleUrl: './profile.scss'
})
export class Profile  implements OnInit {
  route = inject(ActivatedRoute);
  service = inject(PropertyService);
  statusOptions = Status

  profile = toSignal(this.service.profile$, { initialValue: null });

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      this.service.setIdProperty(id ? parseInt(id, 10) : null);
    });
  }
}
