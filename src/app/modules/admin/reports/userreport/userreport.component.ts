import { Component,Inject } from '@angular/core';
import { MATERIAL_IMPORTS } from '../../../material.import';
@Component({
  selector: 'app-userreport',
  imports: [MATERIAL_IMPORTS],   // ✅ just one line
  templateUrl: './userreport.component.html',
  styleUrl: './userreport.component.scss'
})

export class UserreportComponent {
  searchText = '';
  totalItems = 2;
  masterSelected: boolean = false;

  countries = [
    { id: 1, first_name: 'Ahmed',last_name:'Khan',email:'test@gmail.com', isSelected: false},
    { id: 2, first_name: 'Salman',last_name:'Khan',email:'test@gmail.com', isSelected: false}
  ];

  filteredData() {
    return this.countries.filter(c =>
      c.first_name.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  // Toggle all checkboxes
  checkUncheckAll() {
    this.countries.forEach(country => country.isSelected = this.masterSelected);
  }

  // If all rows checked, master should be checked
  isAllSelected() {
    this.masterSelected = this.countries.every(country => country.isSelected);
  }

  editCountry(country: any) {
    //alert(`Editing ${country.name}`);
  }

  deleteCountry(country: any) {
    //alert(`Deleting ${country.name}`);
  }

}
