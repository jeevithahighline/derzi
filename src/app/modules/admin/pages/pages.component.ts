import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { MATERIAL_IMPORTS } from '../../material.import';
import { Router,ActivatedRoute  } from '@angular/router';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrl: './pages.component.scss',
  imports: [MATERIAL_IMPORTS]   // ✅ just one line
})
export class PagesComponent {
  searchText = '';
  totalItems = 2;
  masterSelected: boolean = false;

  constructor(private _router: Router) {}
  pages = [
    { id: 1, pagetitle: 'Home Page',pagecontent:'Lorem ipsum',isSelected: false},
    { id: 2, pagetitle: 'About us Page',pagecontent:'Lorem ipsum' ,isSelected: false}
  ];

  filteredpages() {
    return this.pages.filter(c =>
      c.pagetitle.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  editCountry(country: any) {
    //alert(`Editing ${country.name}`);
  }

  deleteCountry(country: any) {
    //alert(`Deleting ${country.name}`);
  }

  addPages(){
    this._router.navigate(['/addPage']);
  }

   // Toggle all checkboxes
   checkUncheckAll() {
    this.pages.forEach(country => country.isSelected = this.masterSelected);
  }

  // If all rows checked, master should be checked
  isAllSelected() {
    this.masterSelected = this.pages.every(country => country.isSelected);
  }

}



