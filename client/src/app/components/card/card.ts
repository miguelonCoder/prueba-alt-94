import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Property } from '../../interfaces/Property';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-card',
  imports: [MatCardModule, CommonModule, MatButtonModule, RouterLink],
  templateUrl: './card.html',
  styleUrl: './card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Card {
  property = input.required<Property>()

}
