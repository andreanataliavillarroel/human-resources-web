import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalAcademicFormComponent } from './personal-academic-form.component';

describe('PersonalAcademicFormComponent', () => {
  let component: PersonalAcademicFormComponent;
  let fixture: ComponentFixture<PersonalAcademicFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PersonalAcademicFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PersonalAcademicFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
