import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BannersformComponent } from './bannersform.component';

describe('BannersformComponent', () => {
  let component: BannersformComponent;
  let fixture: ComponentFixture<BannersformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BannersformComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BannersformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
