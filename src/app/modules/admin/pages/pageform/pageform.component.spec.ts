import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageformComponent } from './pageform.component';

describe('PageformComponent', () => {
  let component: PageformComponent;
  let fixture: ComponentFixture<PageformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageformComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PageformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
