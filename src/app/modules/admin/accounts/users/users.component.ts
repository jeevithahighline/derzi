import { Component,Inject } from '@angular/core';
import { MATERIAL_IMPORTS } from '../../../material.import';
import { Router,ActivatedRoute  } from '@angular/router';

@Component({
  selector: 'app-users',
  imports: [MATERIAL_IMPORTS],   // ✅ just one line
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})

export class UsersComponent {
  searchText = '';
  totalItems = 2;
  masterSelected: boolean = false;
  constructor(private _router: Router) {}
  
  countries = [
    { id: 1, first_name: 'Ahmed',last_name:'Khan',email:'test@gmail.com',status: 'Inactive',
    isSelected: false},
    { id: 2, first_name: 'Salman',last_name:'Khan',email:'test@gmail.com',status: 'Inactive',
    isSelected: false}
  ];

  filteredData() {
    return this.countries.filter(c =>
      c.first_name.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  editCountry(country: any) {
    //alert(`Editing ${country.name}`);
  }

  deleteCountry(country: any) {
    //alert(`Deleting ${country.name}`);
  }

  addForm(){
    this._router.navigate(['/adduser']);
  }

  // Toggle all checkboxes
  checkUncheckAll() {
    this.countries.forEach(country => country.isSelected = this.masterSelected);
  }

  // If all rows checked, master should be checked
  isAllSelected() {
    this.masterSelected = this.countries.every(country => country.isSelected);
  }

}