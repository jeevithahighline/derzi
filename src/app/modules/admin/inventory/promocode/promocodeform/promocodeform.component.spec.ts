import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PromocodeformComponent } from './promocodeform.component';

describe('PromocodeformComponent', () => {
  let component: PromocodeformComponent;
  let fixture: ComponentFixture<PromocodeformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PromocodeformComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PromocodeformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
