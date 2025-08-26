import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeformComponent } from './typeform.component';

describe('TypeformComponent', () => {
  let component: TypeformComponent;
  let fixture: ComponentFixture<TypeformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TypeformComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TypeformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
