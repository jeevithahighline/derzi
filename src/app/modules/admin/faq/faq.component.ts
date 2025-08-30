import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { MATERIAL_IMPORTS } from '../../material.import';
import { Router,ActivatedRoute  } from '@angular/router';


@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrl: './faq.component.scss',
  imports: [MATERIAL_IMPORTS]   // ✅ just one line
})
export class FaqComponent {
  searchText = '';
  totalItems = 2;
  masterSelected: boolean = false;
  constructor(private _router: Router) {}
  countries = [
    { id: 1, questions: 'How do I find my size in different size standards?',answers:'It is in description of the product',isSelected: false},
    { id: 2, questions: 'How can I track my order?',answers:'Check order status',isSelected: false }
  ];

  filteredData() {
    return this.countries.filter(c =>
      c.questions.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  editCountry(country: any) {
    //alert(`Editing ${country.name}`);
  }

  deleteCountry(country: any) {
    //alert(`Deleting ${country.name}`);
  }

  addfaq(){
    this._router.navigate(['/addfaq']);
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


