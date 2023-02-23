import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinantialInformationFormComponent } from './finantial-information-form.component';

describe('FinantialInformationFormComponent', () => {
  let component: FinantialInformationFormComponent;
  let fixture: ComponentFixture<FinantialInformationFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FinantialInformationFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinantialInformationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
