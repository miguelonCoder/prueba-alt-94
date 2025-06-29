import { Component } from '@angular/core';
import { SearchBar } from '../search-bar/search-bar';
import { Paginator } from "../paginator/paginator";

@Component({
  selector: 'app-header-list',
  imports: [SearchBar, Paginator],
  templateUrl: './header-list.html',
  styleUrl: './header-list.scss'
})
export class HeaderList {

}
