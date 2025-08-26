import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { MATERIAL_IMPORTS } from '../../../material.import';

@Component({
  selector: 'app-drivers',
  imports: [MATERIAL_IMPORTS],   // ✅ just one line
  templateUrl: './drivers.component.html',
  styleUrl: './drivers.component.scss'
})

export class DriversComponent {
  searchText = '';
  totalItems = 2;
  countries = [
    {
      id:'1',
      driver_name: 'Ahmed',
      contact_email: 'ahmed@gmail.com',
      phone: '+91-9876543210',
      location: 'Mumbai, India',
      status: 'Active'
    },
    {
      id:'2',
      driver_name: 'Sameem',
      contact_email: 'sameem@gmail.com',
      phone: '+91-9123456780',
      location: 'Bangalore, India',
      status: 'Inactive'
    }
  ];

  filtereddrivers() {
    return this.countries.filter(c =>
      c.driver_name.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  editCountry(country: any) {
    alert(`Editing ${country.name}`);
  }

  deleteCountry(country: any) {
    alert(`Deleting ${country.name}`);
  }

}

