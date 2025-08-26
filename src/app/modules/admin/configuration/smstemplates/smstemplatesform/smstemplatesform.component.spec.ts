import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmstemplatesformComponent } from './smstemplatesform.component';

describe('SmstemplatesformComponent', () => {
  let component: SmstemplatesformComponent;
  let fixture: ComponentFixture<SmstemplatesformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SmstemplatesformComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SmstemplatesformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
