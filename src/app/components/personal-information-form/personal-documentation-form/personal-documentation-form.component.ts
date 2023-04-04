import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, ElementRef, ViewChild } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DocumentationService } from 'src/app/services/documentation/documentation.service';
import { EmployeeService } from 'src/app/services/employee/employee.service';

@Component({
  selector: 'app-personal-documentation-form',
  templateUrl: './personal-documentation-form.component.html',
  styleUrls: ['./personal-documentation-form.component.scss'],
})
export class PersonalDocumentationComponent {
  public form!: FormGroup;
  public dniGroup!: FormGroup;
  public cvGroup!: FormGroup;

  public file!: File;
  public fileLink!: string;
  public fileName!: any;
  public formData = new FormData();
  public filesCI: any[] = [];
  public filesCV: any[] = [];
  public files: any[] = [];
  public inputToUpload!: boolean;
  private allowedTypes = [
    'image/jpeg',
    'image/png',
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ];
  private maxNumberOfFiles = 2;

  uploading = false;
  @ViewChild('uploadCI', { static: false }) uploadCI!: ElementRef;
  @ViewChild('uploadCV', { static: false }) uploadCV!: ElementRef;

  ngOnInit() {
    // this.buildForm();
  }

  constructor(
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private employeeService: EmployeeService,
    private documentationService: DocumentationService
  ) {}

  // public buildForm() {
  //   this.form = this.formBuilder.group({
  //     file: new FormControl('', [Validators.required]),
  //   });
  // }

  public onFileSelected(event: any, input: boolean) {
    // if (event.target.files[0]) {
    //   this.file = event.target.files[0];
    //   console.log(event.target);
    // }
    if (
      event.target.files.length <= this.maxNumberOfFiles &&
      this.files.length < this.maxNumberOfFiles
    ) {
      for (const selectedFile of event.target.files) {
        if (selectedFile) {
          if (this.allowedTypes.includes(selectedFile.type)) {
            this.files.push(selectedFile);
          } else {
            this.snackBar.open(
              `No se permite el formato ${selectedFile.type} para subir el archivo`,
              'OK',
              {
                duration: 5000,
              }
            );
          }
        }
      }
      console.log(this.files);
      this.inputToUpload = input;
      this.prepareFilesList(this.files);
    } else {
      this.snackBar.open(
        `No se puede subir mas de ${this.maxNumberOfFiles} archivos`,
        'OK',
        {
          duration: 5000,
        }
      );
    }
  }

  public onFileSubmit() {
    if (this.file) {
      this.formData.append('file', this.file);
    }
    console.log('Response!!!!!!!!!');

    this.documentationService.uploadFile(this.formData).subscribe(
      response => {
        console.log('Response:', response);
      },
      error => {
        console.error('Error:', error);
      }
    );
  }

  // public uploadFiles() {
  //   const formData = new FormData();
  //   console.log(this.files);
  //   for (let i = 0; i <= this.files.length; i++) {
  //     formData.append('files', this.files[i], this.files[i].name);
  //   }
  //   this.uploading = true;
  //   this.documentationService.uploadFile(formData).subscribe(
  //     () => {
  //       this.files = [];
  //       this.uploading = false;
  //     },
  //     () => {
  //       this.uploading = false;
  //     }
  //   );
  // }

  public onFileDropped(event: Event) {
    this.prepareFilesList(event);
  }

  public deleteFile(index: number) {
    if (this.inputToUpload) {
      if (this.filesCV[index].progress < 100) {
        console.log('Upload in progress.');
        return;
      }
      this.filesCV.splice(index, 1);
    } else {
      if (this.filesCI[index].progress < 100) {
        console.log('Upload in progress.');
        return;
      }
      this.filesCI.splice(index, 1);
    }
  }

  private uploadFilesSimulator(index: number) {
    const files = this.inputToUpload ? this.filesCV : this.filesCI;

    setTimeout(() => {
      if (index === files.length) {
        return;
      } else {
        const progressInterval = setInterval(() => {
          if (files[index].progress === 100) {
            clearInterval(progressInterval);
            this.uploadFilesSimulator(index + 1);
          } else {
            files[index].progress += 5;
          }
          this.filesCI = this.inputToUpload ? this.filesCI : files;
          this.filesCV = this.inputToUpload ? files : this.filesCV;
        }, 200);
      }
    }, 1000);
  }

  private prepareFilesList(files: any) {
    if (this.inputToUpload) {
      for (const item of files) {
        item.progress = 0;
        // this.file = item;
        // this.onFileSubmit();
        this.filesCV.push(item);
      }
      this.uploadCV.nativeElement.value = '';
    } else {
      for (const item of files) {
        item.progress = 0;
        // this.file = item;
        // this.onFileSubmit();
        this.filesCI.push(item);
      }
      this.uploadCI.nativeElement.value = '';
    }
    this.uploadFilesSimulator(0);
  }

  public formatBytes(bytes: number) {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    if (bytes === 0) {
      return '0 Bytes / Verifique el contenido del archivo';
    }
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${parseFloat((bytes / Math.pow(1024, i)).toFixed(2))} ${sizes[i]}`;
  }
}
