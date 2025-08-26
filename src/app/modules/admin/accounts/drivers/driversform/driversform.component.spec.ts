import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DriversformComponent } from './driversform.component';

describe('DriversformComponent', () => {
  let component: DriversformComponent;
  let fixture: ComponentFixture<DriversformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DriversformComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DriversformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
