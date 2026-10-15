import { PageNotFoundComponent } from './system-common/page-not-found/page-not-found.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router'; // CLI imports router
import { LoginComponent } from './system-common/login/login.component';
import { SettingService } from './system-common/services/setting.service';
import { LoginRedirectComponent } from './okta/login-redirect/login-redirect.component';
import { SunPhLoginComponent } from './sun-ph-login/sun-ph-login.component';

const routes: Routes = [
  { path: '', component: LoginRedirectComponent },
  // { path: 'login', component: SunPhLoginComponent },
  { path: 'login', redirectTo: '', pathMatch: 'full' },
  // { path: 'login', component: LoginComponent },
  { path: 'page-not-found', component: PageNotFoundComponent },
  { path: '**', component: PageNotFoundComponent },
  // { path: '**', component: LoginComponent}, //Need to add loader
]; // sets up routes constant where you define your routes

// configures NgModule imports and exports
@NgModule({
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
