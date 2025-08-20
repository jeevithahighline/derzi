import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { MATERIAL_IMPORTS } from '../../material.import';


@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrl: './pages.component.scss',
  imports: [MATERIAL_IMPORTS]   // ✅ just one line
})
export class PagesComponent {
  searchText = '';

  pages = [
    { id: 1, pagetitle: 'Home Page',pagecontent:'Lorem ipsum'},
    { id: 2, pagetitle: 'About us Page',pagecontent:'Lorem ipsum' }
  ];

  filteredpages() {
    return this.pages.filter(c =>
      c.pagetitle.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  editCountry(country: any) {
    alert(`Editing ${country.name}`);
  }

  deleteCountry(country: any) {
    alert(`Deleting ${country.name}`);
  }

}



