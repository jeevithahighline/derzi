import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfilesettingsComponent } from './profilesettings.component';

describe('ProfilesettingsComponent', () => {
  let component: ProfilesettingsComponent;
  let fixture: ComponentFixture<ProfilesettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfilesettingsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfilesettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
