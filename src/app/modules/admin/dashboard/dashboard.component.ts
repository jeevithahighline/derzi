import { Component, ViewEncapsulation } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartType } from 'chart.js';
import { MATERIAL_IMPORTS } from '../../material.import';
@Component({
    selector: 'dashboard',
    standalone: true,
    imports: [BaseChartDirective,MATERIAL_IMPORTS],
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],   // ✅ use external style file
    encapsulation: ViewEncapsulation.None
})
  
export class DashboardComponent {

    selectedStatus: string = '';
    amount: string = '';
    startDate: Date | null = null;
    endDate: Date | null = null;
    masterSelected: boolean = false;
    searchText: string = '';
    // Bar Chart (Product Sales)
    barChartOptions: ChartConfiguration<'bar'>['options'] = {
      responsive: true,
      plugins: { legend: { position: 'top' } }
    };
    barChartLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May','June','Jul','Aug','Oct','Nov','Dec'];
    barChartType: ChartType = 'bar';
    barChartData = [
      { data: [10, 20, 30, 40, 50,60,70,80,90,45,100,56], label: 'Sales' },
      { data: [15, 25, 35, 45, 55,45,65,75,85,95,45,100], label: 'Revenue' }
    ];
  
    // Pie Chart (Sales by Product)
    pieChartLabels = ['Product A', 'Product B', 'Product C'];
    pieChartData = [300, 500, 100];
    pieChartType: ChartType = 'pie';
  
    // Doughnut Chart (Sales by Countries)
    doughnutChartLabels = ['UAE', 'BAHRAIN', 'KUWAIT','SAUDI'];
    doughnutChartData = [120, 150, 90,120];
    doughnutChartType: ChartType = 'doughnut';

    totalItems = 2;
    orders = [
        { id: 'ORD1001', customer: 'John Doe', date: new Date('2025-08-28'), amount: 1200, status: 'Pending', isSelected: false },
        { id: 'ORD1002', customer: 'Jane Smith', date: new Date('2025-08-29'), amount: 2500, status: 'Completed', isSelected: false },
        { id: 'ORD1003', customer: 'Ahmed', date: new Date('2025-08-30'), amount: 2500, status: 'Completed', isSelected: false },
        { id: 'ORD1004', customer: 'Syed', date: new Date('2025-08-31'), amount: 2500, status: 'Completed', isSelected: false },
        { id: 'ORD1005', customer: 'Khan', date: new Date('2025-08-31'), amount: 2500, status: 'Completed', isSelected: false },
        { id: 'ORD1006', customer: 'Qasim', date: new Date('2025-08-31'), amount: 2500, status: 'Completed', isSelected: false },
    ];

    filteredOrders() {
        return this.orders.filter(o =>
        o.customer.toLowerCase().includes(this.searchText.toLowerCase()) ||
        o.id.toLowerCase().includes(this.searchText.toLowerCase())
        );
    }


       // Toggle all checkboxes
   checkUncheckAll() {
    this.orders.forEach(country => country.isSelected = this.masterSelected);
  }

  // If all rows checked, master should be checked
  isAllSelected() {
    this.masterSelected = this.orders.every(country => country.isSelected);
  }
  }
