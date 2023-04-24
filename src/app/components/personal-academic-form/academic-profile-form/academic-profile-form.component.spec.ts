import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcademicProfileFormComponent } from './academic-profile-form.component';

describe('AcademicProfileFormComponent', () => {
  let component: AcademicProfileFormComponent;
  let fixture: ComponentFixture<AcademicProfileFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AcademicProfileFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AcademicProfileFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
