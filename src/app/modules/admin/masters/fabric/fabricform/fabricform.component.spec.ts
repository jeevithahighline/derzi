import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FabricformComponent } from './fabricform.component';

describe('FabricformComponent', () => {
  let component: FabricformComponent;
  let fixture: ComponentFixture<FabricformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FabricformComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FabricformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
