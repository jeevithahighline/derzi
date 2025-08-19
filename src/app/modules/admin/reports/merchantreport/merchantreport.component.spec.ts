import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MerchantreportComponent } from './merchantreport.component';

describe('MerchantreportComponent', () => {
  let component: MerchantreportComponent;
  let fixture: ComponentFixture<MerchantreportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MerchantreportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MerchantreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
