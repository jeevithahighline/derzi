import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DerziuserComponent } from './derziuser.component';

describe('DerziuserComponent', () => {
  let component: DerziuserComponent;
  let fixture: ComponentFixture<DerziuserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DerziuserComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DerziuserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
