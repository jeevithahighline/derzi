import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleformComponent } from './roleform.component';

describe('RoleformComponent', () => {
  let component: RoleformComponent;
  let fixture: ComponentFixture<RoleformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoleformComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoleformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
