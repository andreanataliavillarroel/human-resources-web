import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-file-drag-and-drop-box',
  templateUrl: './file-drag-and-drop-box.component.html',
  styleUrls: ['./file-drag-and-drop-box.component.scss'],
})
export class FileDragAndDropBoxComponent implements OnInit {
  public files: any[];

  public allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
  public maxNumberOfFiles: number = 5;

  @ViewChild('uploadFile', { static: false }) uploadFile!: ElementRef;

  constructor(private snackBar: MatSnackBar, private cdref: ChangeDetectorRef) {
    this.files = [];
  }

  public setMaxNumberOfFiles(max: number) {
    this.maxNumberOfFiles = max;
  }

  public getMaxNumberOfFiles() {
    return this.maxNumberOfFiles;
  }

  ngOnInit(): void {}

  ngAfterContentChecked() {
    this.cdref.detectChanges();
  }

  public onFileSelected(event: any) {
    if (
      event.target.files.length <= this.maxNumberOfFiles &&
      this.files.length < this.maxNumberOfFiles
    ) {
      for (const selectedFile of event.target.files) {
        this.verifyFileType(selectedFile);
      }
      this.uploadFile.nativeElement.value = '';
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

  public verifyFileType(file: any) {
    if (file) {
      if (this.allowedTypes.includes(file.type)) {
        file.progress = 0;
        this.files.push(file);
      } else {
        this.snackBar.open(
          `No se permite el formato ${file.type} para subir el archivo`,
          'OK',
          {
            duration: 5000,
          }
        );
      }
    }
  }

  public onFileDropped(event: Event) {
    this.onFileSelected(event);
  }

  public uploadData() {
    this.uploadFilesSimulator(0);
  }

  public uploadFilesSimulator(index: number) {
    setTimeout(() => {
      if (index === this.files.length) {
        return;
      } else {
        const progressInterval = setInterval(() => {
          if (this.files[index].progress === 100) {
            clearInterval(progressInterval);
            this.uploadFilesSimulator(index + 1);
          } else {
            this.files[index].progress += 5;
          }
        }, 50);
      }
    }, 1000);
  }

  public formatBytes(bytes: number) {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    if (bytes === 0) {
      return '0 Bytes / Verifique el contenido del archivo';
    }
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${parseFloat((bytes / Math.pow(1024, i)).toFixed(2))} ${sizes[i]}`;
  }

  public deleteFile(index: number) {
    this.files.splice(index, 1);
  }

  public getFiles() {
    return this.files;
  }
}
