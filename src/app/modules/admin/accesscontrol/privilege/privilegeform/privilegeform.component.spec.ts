import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrivilegeformComponent } from './privilegeform.component';

describe('PrivilegeformComponent', () => {
  let component: PrivilegeformComponent;
  let fixture: ComponentFixture<PrivilegeformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrivilegeformComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrivilegeformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
