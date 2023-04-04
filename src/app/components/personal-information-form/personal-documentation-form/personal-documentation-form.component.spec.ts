import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalDocumentationComponent } from './personal-documentation-form.component';

describe('PersonalDocumentationComponent', () => {
  let component: PersonalDocumentationComponent;
  let fixture: ComponentFixture<PersonalDocumentationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PersonalDocumentationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PersonalDocumentationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
