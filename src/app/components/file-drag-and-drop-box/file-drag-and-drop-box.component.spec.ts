import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileDragAndDropBoxComponent } from './file-drag-and-drop-box.component';

describe('FileDragAndDropBoxComponent', () => {
  let component: FileDragAndDropBoxComponent;
  let fixture: ComponentFixture<FileDragAndDropBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FileDragAndDropBoxComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FileDragAndDropBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
