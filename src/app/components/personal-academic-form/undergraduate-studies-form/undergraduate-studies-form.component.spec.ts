import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UndergraduateStudiesFormComponent } from './undergraduate-studies-form.component';

describe('UndergraduateStudiesFormComponent', () => {
  let component: UndergraduateStudiesFormComponent;
  let fixture: ComponentFixture<UndergraduateStudiesFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UndergraduateStudiesFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UndergraduateStudiesFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
