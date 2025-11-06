import { Component, ViewEncapsulation } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartType } from 'chart.js';
import { MATERIAL_IMPORTS } from '../../material.import';
import { GlobalService } from '../../../core/services/global.service';
import { Router,ActivatedRoute  } from '@angular/router';

@Component({
    selector: 'dashboard',
    standalone: true,
    imports: [BaseChartDirective,MATERIAL_IMPORTS],
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],   // ✅ use external style file
    encapsulation: ViewEncapsulation.None
})
  
export class DashboardComponent {

    productSales:any;
    salesbyGender:any;
    salesbyCountry:any;
    dashboardData:any;
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
    barChartType: ChartType = 'bar';

    barChartLabels = [];
    barChartData = [];
  
    // Pie Chart (Sales by Gender)
    pieChartType: ChartType = 'pie';
    pieChartLabels = [];
    pieChartData = [];
    
  
    // Doughnut Chart (Sales by Countries)
    doughnutChartType: ChartType = 'doughnut';
    doughnutChartLabels = [];
    doughnutChartData = [];
    

    usertoken:any;  
    orders: any[] = [];
    constructor(private _router: Router,private _globalService: GlobalService) {}

    ngOnInit(): void {

      this.usertoken = localStorage.getItem('usertoken');   
      // ✅ Fetch existing site details if available
      this.loadDashboardDetails();
    } 

    loadDashboardDetails() {
      const token = localStorage.getItem('usertoken'); 
      if (token) {
        this._globalService.getAllDashboard(token).subscribe({
          next: (res: any) => {
            this.dashboardData = res.data;   // ✅ save all dashboard stats
            this.orders = res.data.recentTransactions || [];  

            this.productSales = res.data.productSales;

            // Product Sales Section

            // 🔹 Generate labels and data dynamically from API
            this.barChartLabels = this.productSales.map((item: any) => item.month);
            const salesData = this.productSales.map((item: any) => item.sales);
            const revenueData = this.productSales.map((item: any) => item.revenue);

            // 🔹 Assign to chart data
            this.barChartData = [
              { data: salesData, label: 'Sales' },
              { data: revenueData, label: 'Revenue' }
            ];
            
            //-------------------Ends here------------------//
            
            this.salesbyGender = res.data.salesByGender;

            console.log(this.salesbyGender);

            // 🔹 Map API data to chart labels and data
            this.pieChartLabels = this.salesbyGender.map((item: any) => item.gender);
            this.pieChartData = this.salesbyGender.map((item: any) => parseFloat(item.totalSales.toFixed(2)));

            this.salesbyCountry = res.data.salesByCountry;

            console.log(this.salesbyCountry);

            this.doughnutChartLabels = this.salesbyCountry.map((item: any) => item.country);
            this.doughnutChartData = this.salesbyCountry.map((item: any) => parseFloat(item.totalSales.toFixed(2)));
          },
          error: (err) => {
            console.error('Error fetching invoices', err);
          }
        });
      }
    }

    filteredOrders() {
      return this.orders;
    }

    viewOrder(orderId: string) {
      this._router.navigate(['/detailorder', orderId]);
    }
  }
