import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PromotionformComponent } from './promotionform.component';

describe('PromotionformComponent', () => {
  let component: PromotionformComponent;
  let fixture: ComponentFixture<PromotionformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PromotionformComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PromotionformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
