import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { DocumentationService } from 'src/app/services/documentation/documentation.service';
// import { FileUploader } from 'ng2-file-upload';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
@Component({
  selector: 'app-documentation',
  templateUrl: './documentation.component.html',
  styleUrls: ['./documentation.component.scss'],
})
export class DocumentationComponent implements OnInit {
  file!: File;
  fileLink!: string;
  fileName!: any;
  formData = new FormData();
  public form!: FormGroup;
  // public files!: any[];
  fileInputControl = new FormControl('');
  files: File[] = [];
  uploading = false;

  // public uploader: FileUploader = new FileUploader({
  //   url: URL,
  //   itemAlias: 'file',
  // });

  ngOnInit(): void {
    this.buildForm();
    // this.getFiles();
  }

  constructor(
    private formBuilder: FormBuilder,
    private documentationService: DocumentationService
  ) {}

  private buildForm() {
    this.form = this.formBuilder.group({
      file: new FormControl('', [Validators.required]),
    });
  }

  // public async getFiles() {
  //   this.documentationService.getFiles().subscribe((response: any) => {
  //     console.log(response);
  //     this.files = response.data.files;
  //   });
  // }

  public onFileSelected(event: any) {
    if (event.target.files[0]) {
      this.file = event.target.files[0];
      console.log(this.file);
    }
  }

  public onSubmit(): void {
    // try {
    if (this.file) {
      this.formData.append('file', this.file);
    }
    this.fileLink = '';
    console.log('Response!!!!!!!!!');

    this.documentationService.uploadFile(this.formData).subscribe(
      response => {
        console.log('Response:', response);
      },
      error => {
        console.error('Error:', error);
      }
    );

    // } catch (error) {
    //   console.log(error);
    // }
  }

  // public fileOver(event: any) {
  //   if (event.type === 'dragover') {
  //     // el usuario está arrastrando un archivo sobre el área de carga
  //     // aquí puedes agregar algún estilo visual para indicar que el área de carga está activa
  //     event.preventDefault();
  //     event.stopPropagation();
  //   } else if (event.type === 'dragleave' || event.type === 'drop') {
  //     // el usuario ha dejado de arrastrar un archivo sobre el área de carga
  //     // aquí puedes quitar el estilo visual que indicaba que el área de carga estaba activa
  //     event.preventDefault();
  //     event.stopPropagation();
  //   }
  // }

  // public onFileDropped(event: any) {
  //   event.preventDefault();
  //   event.stopPropagation();
  //   const files = event.dataTransfer.files;
  //   if (files.length > 0) {
  //     // Aquí puedes hacer algo con el archivo, como cargarlo o enviarlo a un servicio para su procesamiento
  //     console.log(files);
  //   }
  // }

  // onFileDropped(event: CdkDragDrop<File[]>) {
  //   const droppedFiles = event.previousContainer.data;
  //   if (droppedFiles.length > 0) {
  //     console.log(droppedFiles);
  //     // Enviar los archivos a la API o procesarlos de alguna otra manera
  //     console.log('Archivos subidos:', droppedFiles);
  //   } else {
  //     console.log('No se han subido archivos');
  //   }
  // }
  onFileDropped(event: CdkDragDrop<File[]>) {
    console.log(this.files);
    moveItemInArray(this.files, event.previousIndex, event.currentIndex);
  }

  uploadFiles() {
    const formData = new FormData();
    console.log(this.files);
    for (let i = 0; i <= this.files.length; i++) {
      formData.append('files', this.files[i], this.files[i].name);
    }
    this.uploading = true;
    this.documentationService.uploadFile(formData).subscribe(
      () => {
        this.files = [];
        this.uploading = false;
      },
      () => {
        this.uploading = false;
      }
    );
  }
}
