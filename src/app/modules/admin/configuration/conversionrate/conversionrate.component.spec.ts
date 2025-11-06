import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConversionrateComponent } from './conversionrate.component';

describe('ConversionrateComponent', () => {
  let component: ConversionrateComponent;
  let fixture: ComponentFixture<ConversionrateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConversionrateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConversionrateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
