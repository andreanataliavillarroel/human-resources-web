import {
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { createCertificationDto } from 'src/app/dto/certification.dto';
import { FileDragAndDropBoxComponent } from '../../file-drag-and-drop-box/file-drag-and-drop-box.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DocumentationService } from 'src/app/services/documentation/documentation.service';

@Component({
  selector: 'app-certification-form',
  templateUrl: './certification-form.component.html',
  styleUrls: ['../personal-academic-form.component.scss'],
})
export class CertificationFormComponent implements OnInit {
  public form!: FormGroup;
  public formData = new FormData();

  @Input() folderId!: string;

  @ViewChild('certification')
  certification!: FileDragAndDropBoxComponent;

  ngOnInit() {
    this.buildForm();
  }

  ngAfterContentChecked() {
    this.cdref.detectChanges();
  }

  constructor(
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private cdref: ChangeDetectorRef,
    private documentationService: DocumentationService
  ) {}

  private buildForm() {
    this.form = this.formBuilder.group({
      name: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
    });
  }

  public async buildCertificationFormPayload() {
    let certification = new createCertificationDto();
    certification.name = this.form.get('name')?.value;
    // certification.academic_profile_id = this.academicProfileId;
    certification.description = this.form.get('description')?.value;
    // certification.drive_id = this.folderId;
    if (this.folderId) {
      this.certification.uploadData();
      certification.drive_id = (
        await this.getDataToUpload(this.certification.getFiles())
      ).toString();
    }
    return certification;
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
}
