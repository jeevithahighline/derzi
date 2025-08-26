import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SizeformComponent } from './sizeform.component';

describe('SizeformComponent', () => {
  let component: SizeformComponent;
  let fixture: ComponentFixture<SizeformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SizeformComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SizeformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
