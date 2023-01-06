import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignUpComponent } from './components/sign-up/sign-up.component'; 
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'sign-up',
    component: SignUpComponent,
  }
]

@NgModule({
  declarations: [],
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
