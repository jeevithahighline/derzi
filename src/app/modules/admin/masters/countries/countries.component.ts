import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MATERIAL_IMPORTS } from '../../../material.import';

interface Country {
  id: number;
  name: string;
  flag: string; // URL or base64 for flag image
}

const COUNTRY_DATA: Country[] = [
  { id: 1, name: 'Bahrain', flag: 'https://flagcdn.com/w20/bh.png' },
  { id: 2, name: 'India', flag: 'https://flagcdn.com/w20/in.png' },
  { id: 3, name: 'UAE', flag: 'https://flagcdn.com/w20/ae.png' },
];

@Component({
  selector: 'app-countries',
  templateUrl: './countries.component.html',
  styleUrl: './countries.component.scss',
  imports: [MATERIAL_IMPORTS]   // ✅ just one line
})
export class CountriesComponent implements AfterViewInit {
  displayedColumns: string[] = ['id', 'name', 'flag', 'action'];
  dataSource = new MatTableDataSource(COUNTRY_DATA);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  editCountry(row: Country) {
    console.log('Edit', row);
  }

  deleteCountry(row: Country) {
    console.log('Delete', row);
  }

}
