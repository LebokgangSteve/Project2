import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './Components/home/home.component';
import { SigninComponent } from './Components/signin/signin.component';
import { SignupComponent } from './Components/signup/signup.component';
import { ContactComponent } from './Components/contact/contact.component';
import { UserComponent } from './Components/user/user.component';
import { AuthGuard } from './guard/auth.guard';
import { UserDetailsComponent } from './Components/user-details/user-details.component';
import { NotfoundComponent } from './notfound/notfound.component';
import { ResetpasswordComponent } from './resetpassword/resetpassword.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'signin', component: SigninComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'user', component: UserComponent, canActivate: [AuthGuard] },
  {
    path: 'user-details',
    component: UserDetailsComponent,
    canActivate: [AuthGuard],
  },
  { path: 'resetpassword', component: ResetpasswordComponent },
  { path: '**', component: NotfoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
