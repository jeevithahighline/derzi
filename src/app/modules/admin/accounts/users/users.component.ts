import { Component } from '@angular/core';
import { MATERIAL_IMPORTS } from '../../../material.import';
@Component({
  selector: 'app-users',
  imports: [MATERIAL_IMPORTS],   // ✅ just one line
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})

export class UsersComponent {
  searchText = '';
  totalItems = 2;
  countries = [
    { id: 1, first_name: 'Ahmed',last_name:'Khan',email:'test@gmail.com'},
    { id: 2, first_name: 'Salman',last_name:'Khan',email:'test@gmail.com'}
  ];

  filteredCountries() {
    return this.countries.filter(c =>
      c.first_name.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  editCountry(country: any) {
    alert(`Editing ${country.name}`);
  }

  deleteCountry(country: any) {
    alert(`Deleting ${country.name}`);
  }

}