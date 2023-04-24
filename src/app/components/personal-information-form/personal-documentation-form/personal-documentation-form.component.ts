import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DocumentationService } from 'src/app/services/documentation/documentation.service';
import { FileDragAndDropBoxComponent } from '../../file-drag-and-drop-box/file-drag-and-drop-box.component';
import { createPersonalDocumentationDto } from 'src/app/dto/personal-documentation.dto';

@Component({
  selector: 'app-personal-documentation-form',
  templateUrl: './personal-documentation-form.component.html',
  styleUrls: ['./personal-documentation-form.component.scss'],
})
export class PersonalDocumentationComponent {
  public form!: FormGroup;
  private folderId: string = '';
  public formData = new FormData();
  public nextStep: boolean = false;
  @ViewChild('ciUpload') ci!: FileDragAndDropBoxComponent;
  @ViewChild('cvUpload') cv!: FileDragAndDropBoxComponent;

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

  public buildDocumentationPayload(
    name: string,
    drive_id: string,
    employee_id: string
  ): createPersonalDocumentationDto {
    let newPersonalDocumentation = new createPersonalDocumentationDto();
    newPersonalDocumentation.name = name;
    newPersonalDocumentation.drive_id = drive_id;
    newPersonalDocumentation.employee_id = employee_id;

    return newPersonalDocumentation;
  }

  public async onSubmitData(employeeId: string) {
    if (this.folderId) {
      this.ci.uploadData();
      const filesCI = (
        await this.getDataToUpload(this.ci.getFiles())
      ).toString();

      const ciPayload = this.buildDocumentationPayload(
        'CI/DNI',
        filesCI,
        employeeId
      );

      this.cv.uploadData();
      const filesCV = (
        await this.getDataToUpload(this.cv.getFiles())
      ).toString();

      const cvPayload = this.buildDocumentationPayload(
        'CV',
        filesCV,
        employeeId
      );

      const promises = [
        this.onSubmitDocumentationData(ciPayload),
        this.onSubmitDocumentationData(cvPayload),
      ];

      await Promise.all(promises);
    } else {
      this.snackBar.open(`No es posible subir los archivos`, 'OK', {
        duration: 5000,
      });
    }
  }

  public async onSubmitDocumentationData(
    documentation: createPersonalDocumentationDto
  ) {
    this.documentationService
      .createPersonalDocumentation(documentation)
      .subscribe({
        next: (data: any) => {
          console.log(data);
          this.snackBar.open('Success', 'OK', { duration: 5000 });
        },
        error: (data: any) => {
          console.log(data);
          this.snackBar.open(data.error.message, 'OK', { duration: 5000 });
        },
      });
  }

  public async getDataToUpload(files: any[]) {
    let responseList: string[] = [];

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
          }
        } catch (error: any) {
          this.snackBar.open(error.error, 'OK', { duration: 5000 });
        }
        this.formData.delete('file');
      }
      this.snackBar.open(`Los archivos se subieron correctamente`, 'OK', {
        duration: 5000,
      });
    }
    return responseList;
  }

  public goNextStep() {
    this.nextStep = true;
  }
}
