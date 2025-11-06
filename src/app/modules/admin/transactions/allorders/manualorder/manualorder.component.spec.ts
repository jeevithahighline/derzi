import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManualorderComponent } from './manualorder.component';

describe('ManualorderComponent', () => {
  let component: ManualorderComponent;
  let fixture: ComponentFixture<ManualorderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManualorderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManualorderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
