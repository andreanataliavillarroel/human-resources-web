import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { createPersonalDocumentationDto } from 'src/app/dto/personal-documentation.dto';

@Injectable({
  providedIn: 'root',
})
export class DocumentationService {
  constructor(private http: HttpClient) {}

  public createPersonalDocumentation(
    documentation: createPersonalDocumentationDto
  ) {
    return this.http.post(
      `${environment.documentationApiUrl}/documentation`,
      documentation
    );
  }

  public uploadFile(formData: FormData) {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    return this.http.post(
      `${environment.documentationApiUrl}/documentation/file`,
      formData,
      { headers }
    );
  }

  public uploadFileInFolder(formData: FormData, folderId: string) {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    return this.http.post(
      `${environment.documentationApiUrl}/documentation/file/${folderId}`,
      formData,
      { headers }
    );
  }

  public getFiles(folderId: string) {
    let header = new HttpHeaders().set('Type-content', 'aplication/json');

    return this.http.get(
      `${environment.documentationApiUrl}/documentation/files/${folderId}`,
      {
        headers: header,
      }
    );
  }

  public createFolder(folderName: any) {
    return this.http.post(
      `${environment.documentationApiUrl}/documentation/create-folder`,
      folderName
    );
  }

  public getAcademicProfile() {
    let id = '3f68dca7-761d-4e2f-9b32-aeaa29a86b29';

    let header = new HttpHeaders().set('Type-content', 'application/json');
    return this.http.get(
      `${environment.documentationApiUrl}/academic-profile/${id}`,
      {
        headers: header,
      }
    );
  }
}
