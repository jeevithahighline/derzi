import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicesformComponent } from './servicesform.component';

describe('ServicesformComponent', () => {
  let component: ServicesformComponent;
  let fixture: ComponentFixture<ServicesformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServicesformComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServicesformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
