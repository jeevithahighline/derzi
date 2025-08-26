import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CareformComponent } from './careform.component';

describe('CareformComponent', () => {
  let component: CareformComponent;
  let fixture: ComponentFixture<CareformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CareformComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CareformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
