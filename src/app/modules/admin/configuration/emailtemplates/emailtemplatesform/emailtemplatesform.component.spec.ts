import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailtemplatesformComponent } from './emailtemplatesform.component';

describe('EmailtemplatesformComponent', () => {
  let component: EmailtemplatesformComponent;
  let fixture: ComponentFixture<EmailtemplatesformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmailtemplatesformComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmailtemplatesformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
