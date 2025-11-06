import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailinvoiceComponent } from './detailinvoice.component';

describe('DetailinvoiceComponent', () => {
  let component: DetailinvoiceComponent;
  let fixture: ComponentFixture<DetailinvoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailinvoiceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailinvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
