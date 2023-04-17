import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DocumentationService } from 'src/app/services/documentation/documentation.service';
import { EmployeeService } from 'src/app/services/employee/employee.service';
import { FileDragAndDropBoxComponent } from '../../file-drag-and-drop-box/file-drag-and-drop-box.component';
import { createPersonalDocumentationDto } from 'src/app/dto/personal-documentation.dto';

@Component({
  selector: 'app-personal-documentation-form',
  templateUrl: './personal-documentation-form.component.html',
  styleUrls: ['./personal-documentation-form.component.scss'],
})
export class PersonalDocumentationComponent implements OnInit {
  public form!: FormGroup;
  private folderId: string = '';
  private filesCI: string[] = [];
  private filesCV: string[] = [];
  public formData = new FormData();
  public nextStep: boolean = false;
  @ViewChild('ciUpload') ci!: FileDragAndDropBoxComponent;
  @ViewChild('cvUpload') cv!: FileDragAndDropBoxComponent;
  ngOnInit() {}

  ngAfterContentChecked() {
    this.cdref.detectChanges();
  }
  constructor(
    private snackBar: MatSnackBar,
    private cdref: ChangeDetectorRef,
    private documentationService: DocumentationService
  ) {}

  public setFolderId(folderId: string) {
    if (folderId.trim()) {
      this.folderId = folderId;
    }
  }

  public getFolderId() {
    return this.folderId;
  }

  public async getCIDriveId() {
    return await this.getDriveId(this.filesCI);
  }

  public async getCVDriveId() {
    return await this.getDriveId(this.filesCV);
  }

  public getDriveId(ids: string[]) {
    let driveId = '';
    for (const id of ids) {
      driveId.concat(id);

      if (ids.length > 1) {
        driveId.concat('/');
      }
    }
    return driveId;
  }

  public async onSubmitData() {
    if (this.folderId) {
      this.ci.uploadData();
      this.filesCI = await this.getDataToUpload(this.ci.getFiles());
      console.log(this.filesCI);
      this.cv.uploadData();
      this.filesCV = await this.getDataToUpload(this.cv.getFiles());
      console.log(this.filesCV);
    } else {
      this.snackBar.open(`No es posible subir los archivos`, 'OK', {
        duration: 5000,
      });
    }
  }

  public async getDataToUpload(files: any[]) {
    let responseList: any[] = [];

    if (files) {
      for (const file of files) {
        if (file) {
          this.formData.append('file', file);
        }

        try {
          const response: any = await this.documentationService
            .uploadFileInFolder(this.formData, this.folderId)
            .toPromise();
          if (response && response.id) {
            responseList.push(response.id);
            this.snackBar.open(
              `El archivo ${file.name} se subio correctamente`,
              'OK',
              {
                duration: 5000,
              }
            );
          }
        } catch (error: any) {
          this.snackBar.open(error.error, 'OK', { duration: 5000 });
        }

        this.formData.delete('file');
        this.snackBar.open(`Los archivos se subieron correctamente`, 'OK', {
          duration: 5000,
        });
      }
    }
    return responseList;
  }

  public goNextStep() {
    // this.ci.uploadFilesSimulator(0);
    // this.filesCI = this.getDataToUpload(this.ci.getFiles());
  }
}
