import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostgraduateStudiesFormComponent } from './postgraduate-studies-form.component';

describe('PostgraduateStudiesFormComponent', () => {
  let component: PostgraduateStudiesFormComponent;
  let fixture: ComponentFixture<PostgraduateStudiesFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PostgraduateStudiesFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostgraduateStudiesFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
