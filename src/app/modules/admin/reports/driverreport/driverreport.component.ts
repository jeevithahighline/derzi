import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { MATERIAL_IMPORTS } from '../../../material.import';

@Component({
  selector: 'app-driverreport',
  imports: [MATERIAL_IMPORTS],   // ✅ just one line
  templateUrl: './driverreport.component.html',
  styleUrl: './driverreport.component.scss'
})

export class DriverreportComponent {
  searchText = '';
  totalItems = 2;
  masterSelected: boolean = false;
  
  countries = [
    {
      id:'1',
      driver_name: 'Ahmed',
      contact_email: 'ahmed@gmail.com',
      phone: '+91-9876543210',
      location: 'Mumbai, India',
      status: 'Active',
      isSelected: false
    },
    {
      id:'2',
      driver_name: 'Sameem',
      contact_email: 'sameem@gmail.com',
      phone: '+91-9123456780',
      location: 'Bangalore, India',
      status: 'Inactive',
      isSelected: false
    }
  ];

  filtereddrivers() {
    return this.countries.filter(c =>
      c.driver_name.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  editCountry(country: any) {
    //alert(`Editing ${country.name}`);
  }

  deleteCountry(country: any) {
    //alert(`Deleting ${country.name}`);
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


