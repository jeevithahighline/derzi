import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationnotificationComponent } from './applicationnotification.component';

describe('ApplicationnotificationComponent', () => {
  let component: ApplicationnotificationComponent;
  let fixture: ComponentFixture<ApplicationnotificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApplicationnotificationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApplicationnotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
