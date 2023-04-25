import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { createPersonalDocumentationDto } from 'src/app/dto/personal-documentation.dto';
import { createAcademicProfileDto } from 'src/app/dto/academic.profile.dto';
import { createAcademiaDigitalProfileDto } from 'src/app/dto/academia-digital-profile.dto';
import { createCertificationDto } from 'src/app/dto/certification.dto';
import { createUndergraduateStudiesDto } from 'src/app/dto/undergraduate-studies.dto';
import { createPostgraduateStudiesDto } from 'src/app/dto/postgraduate-studies.dto';

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

  public createAcademicProfile(profile: createAcademicProfileDto) {
    return this.http.post(
      `${environment.documentationApiUrl}/academic-profile`,
      profile
    );
  }

  public createAcademiaDigitalProfile(
    profile: createAcademiaDigitalProfileDto
  ) {
    return this.http.post(
      `${environment.documentationApiUrl}/academia-digital-profile`,
      profile
    );
  }

  public createCertification(certificacion: createCertificationDto) {
    return this.http.post(
      `${environment.documentationApiUrl}/certification`,
      certificacion
    );
  }

  public createUnderGraduateStudies(studies: createUndergraduateStudiesDto) {
    return this.http.post(
      `${environment.documentationApiUrl}/undergraduate-studies`,
      studies
    );
  }

  public createPostGraduateStudies(studies: createPostgraduateStudiesDto) {
    return this.http.post(
      `${environment.documentationApiUrl}/postgraduate-studies`,
      studies
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

  public getAcademicProfileByEmployeeId(id: string) {
    return this.http.get(
      `${environment.documentationApiUrl}/academic-profile/employee/${id}`
    );
  }

  public getAcademiaDigitalProfileByEmployeeId(id: string) {
    return this.http.get(
      `${environment.documentationApiUrl}/academia-digital-profile/employee/${id}`
    );
  }

  public getCertificationsByAcademicProfile(id: string) {
    return this.http.get(
      `${environment.documentationApiUrl}/certification/academic-profile/${id}`
    );
  }

  public getUndergraduateStudiesByAcademicProfile(id: string) {
    return this.http.get(
      `${environment.documentationApiUrl}/undergraduate-studies/academic-profile/${id}`
    );
  }

  public getPostgraduateStudiesByAcademicProfile(id: string) {
    return this.http.get(
      `${environment.documentationApiUrl}/postgraduate-studies/academic-profile/${id}`
    );
  }

  public getPersonalDocumentationByEmployeeId(id: string) {
    return this.http.get(
      `${environment.documentationApiUrl}/documentation/employee/${id}`
    );
  }
}
