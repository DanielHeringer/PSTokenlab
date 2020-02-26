import { EditEventComponent } from './edit-event/edit-event.component';
import { NewEventComponent } from './new-event/new-event.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { InvitationsComponent } from './invitations/invitations.component';


const routes: Routes = [
  { path: '', component: HomeComponent},
  { path: 'login', component: LoginComponent},
  { path: 'signup', component: SignupComponent},
  { path: 'newEvent/:date', component: NewEventComponent},
  { path: 'editEvent/:id/:updated', component: EditEventComponent},
  { path: 'invitations', component: InvitationsComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
