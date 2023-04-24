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
import { MatSnackBar } from '@angular/material/snack-bar';
import { createPostgraduateStudiesDto } from 'src/app/dto/postgraduate-studies.dto';
import { DocumentationService } from 'src/app/services/documentation/documentation.service';
import { FileDragAndDropBoxComponent } from '../../file-drag-and-drop-box/file-drag-and-drop-box.component';
import { MatRadioChange } from '@angular/material/radio';

@Component({
  selector: 'app-postgraduate-studies-form',
  templateUrl: './postgraduate-studies-form.component.html',
  styleUrls: ['../personal-academic-form.component.scss'],
})
export class PostgraduateStudiesFormComponent implements OnInit {
  public form!: FormGroup;
  public formData = new FormData();

  @Input() folderId!: string;
  public status: boolean = false;
  public driveId: string = '';

  @ViewChild('postgraduatedStudies')
  postgraduate_certification!: FileDragAndDropBoxComponent;

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
      area: new FormControl('', [Validators.required]),
      speciality: new FormControl('', [Validators.required]),
    });
  }

  public async buildPostGraduateStudiesFormPayload() {
    let studies = new createPostgraduateStudiesDto();
    // studies.academic_profile_id = this.academicProfileId;
    studies.name = this.form.get('name')?.value;
    studies.area = this.form.get('area')?.value;
    studies.speciality = this.form.get('speciality')?.value;
    studies.status = this.status ? 1 : 0;

    if (this.status && this.folderId) {
      this.postgraduate_certification.uploadData();
      studies.drive_id = (
        await this.getDataToUpload(this.postgraduate_certification.getFiles())
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
