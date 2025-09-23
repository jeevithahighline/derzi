import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { OrderService } from '../../../../core/services/order.service';
import { ToastService } from '../../../../core/services/toastr.service';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { MATERIAL_IMPORTS } from '../../../material.import';

@Component({
  selector: 'app-detailorders',
  imports: [MATERIAL_IMPORTS],   // ✅ just one line
  templateUrl: './detailorders.component.html',
  styleUrl: './detailorders.component.scss'
})
export class DetailordersComponent {

  editMode = false;   // ✅ track add/edit
  orderId: string;
  editId: string | null;
  usertoken: any;
  orderDetails: any;

  constructor(private _router: Router,private fb: FormBuilder,private route: ActivatedRoute,private _masterservice: OrderService,private _toastrService: ToastService) {}

  ngOnInit(): void {

    this.orderId = this.route.snapshot.paramMap.get('id') || '';
    
     // ✅ get id from route
    if (this.orderId) {
      this.editMode = true;
      this.editId = this.orderId;

      this._masterservice.getSpecificOrder(this.orderId, this.usertoken).subscribe({
        next: (res) => {
          this.orderDetails = res.data;
          console.log('Order details:', this.orderDetails);

        
        },
        error: (err) => console.error('Error fetching order details', err)
      });
    }  
  }

}
