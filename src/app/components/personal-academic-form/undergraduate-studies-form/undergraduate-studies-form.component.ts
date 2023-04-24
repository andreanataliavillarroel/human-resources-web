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
import { FileDragAndDropBoxComponent } from '../../file-drag-and-drop-box/file-drag-and-drop-box.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DocumentationService } from 'src/app/services/documentation/documentation.service';
import { createUndergraduateStudiesDto } from 'src/app/dto/undergraduate-studies.dto';
import { MatRadioChange } from '@angular/material/radio';

@Component({
  selector: 'app-undergraduate-studies-form',
  templateUrl: './undergraduate-studies-form.component.html',
  styleUrls: ['../personal-academic-form.component.scss'],
})
export class UndergraduateStudiesFormComponent implements OnInit {
  public form!: FormGroup;
  public formData = new FormData();

  @Input() folderId!: string;
  public status: boolean = false;
  public driveId: string = '';

  @ViewChild('undergraduateStudies')
  undergraduate_certification!: FileDragAndDropBoxComponent;

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
      career: new FormControl('', [Validators.required]),
      university: new FormControl('', [Validators.required]),
    });
  }

  public async buildUnderGraduateStudiesFormPayload() {
    let studies = new createUndergraduateStudiesDto();
    // studies.academic_profile_id = this.academicProfileId;
    studies.university = this.form.get('university')?.value;
    studies.career = this.form.get('career')?.value;
    studies.status = this.status ? 1 : 0;

    if (this.status && this.folderId) {
      this.undergraduate_certification.uploadData();
      studies.drive_id = (
        await this.getDataToUpload(this.undergraduate_certification.getFiles())
      ).toString();
    } else {
      studies.drive_id = '';
    }
    return studies;
  }

  public async radioChange(event: MatRadioChange) {
    this.status = event.value;
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
