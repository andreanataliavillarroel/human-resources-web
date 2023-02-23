import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcademicFormsComponent } from './academic-form.component';

describe('AcademicFormsComponent', () => {
  let component: AcademicFormsComponent;
  let fixture: ComponentFixture<AcademicFormsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AcademicFormsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AcademicFormsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
