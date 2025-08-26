import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FaqformComponent } from './faqform.component';

describe('FaqformComponent', () => {
  let component: FaqformComponent;
  let fixture: ComponentFixture<FaqformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FaqformComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FaqformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
