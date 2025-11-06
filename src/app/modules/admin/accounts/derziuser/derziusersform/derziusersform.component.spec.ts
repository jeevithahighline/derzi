import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DerziUsersformComponent } from './derziusersform.component';

describe('DerziUsersformComponent', () => {
  let component: DerziUsersformComponent;
  let fixture: ComponentFixture<DerziUsersformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DerziUsersformComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DerziUsersformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
