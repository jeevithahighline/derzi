import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LanguageformComponent } from './languageform.component';

describe('LanguageformComponent', () => {
  let component: LanguageformComponent;
  let fixture: ComponentFixture<LanguageformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LanguageformComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LanguageformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
