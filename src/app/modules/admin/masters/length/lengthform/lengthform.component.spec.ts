import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LengthformComponent } from './lengthform.component';

describe('LengthformComponent', () => {
  let component: LengthformComponent;
  let fixture: ComponentFixture<LengthformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LengthformComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LengthformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
