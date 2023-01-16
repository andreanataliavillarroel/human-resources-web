import { NgModule } from '@angular/core';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { RouterModule, Routes } from '@angular/router';
import { LogInComponent } from './components/log-in/log-in.component';
import { FormsComponent } from './components/forms/forms.component';

const routes: Routes = [
  {
    path: 'sign-up',
    component: SignUpComponent,
  },
  {
    path: 'log-in',
    component: LogInComponent,
  },
  {
    path: 'forms',
    component: FormsComponent,
  },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
