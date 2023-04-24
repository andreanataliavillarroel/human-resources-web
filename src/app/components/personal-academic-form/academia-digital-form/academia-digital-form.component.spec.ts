import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcademiaDigitalFormComponent } from './academia-digital-form.component';

describe('AcademiaDigitalFormComponent', () => {
  let component: AcademiaDigitalFormComponent;
  let fixture: ComponentFixture<AcademiaDigitalFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AcademiaDigitalFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AcademiaDigitalFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
