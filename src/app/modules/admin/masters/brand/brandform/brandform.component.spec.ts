import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrandformComponent } from './brandform.component';

describe('BrandformComponent', () => {
  let component: BrandformComponent;
  let fixture: ComponentFixture<BrandformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrandformComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BrandformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
