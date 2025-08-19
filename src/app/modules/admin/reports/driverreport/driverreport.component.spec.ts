import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverreportComponent } from './driverreport.component';

describe('DriverreportComponent', () => {
  let component: DriverreportComponent;
  let fixture: ComponentFixture<DriverreportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DriverreportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DriverreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
