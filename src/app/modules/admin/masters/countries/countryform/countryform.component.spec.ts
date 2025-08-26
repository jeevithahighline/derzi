import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CountryformComponent } from './countryform.component';

describe('CountryformComponent', () => {
  let component: CountryformComponent;
  let fixture: ComponentFixture<CountryformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CountryformComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CountryformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
