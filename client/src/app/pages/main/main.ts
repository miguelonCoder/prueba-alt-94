import { Component, inject, OnInit } from '@angular/core';
import { List } from '../../components/list/list';
import { Paginator } from '../../components/paginator/paginator';
import { PropertyService } from '../../services/property-service';

@Component({
  selector: 'app-main',
  imports: [List, Paginator],
  providers: [PropertyService],
  templateUrl: './main.html',
  styleUrl: './main.scss',
})
export class Main {
}
