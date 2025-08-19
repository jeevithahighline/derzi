import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdersreportComponent } from './ordersreport.component';

describe('OrdersreportComponent', () => {
  let component: OrdersreportComponent;
  let fixture: ComponentFixture<OrdersreportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrdersreportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrdersreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
