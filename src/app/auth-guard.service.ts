import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AuthService } from './auth.service';
import { SettingService } from './system-common/services/setting.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuardService {
  constructor(private router: Router, private authService: AuthService, private settingService: SettingService) {}
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree {
    if (!this.authService.isUserLoggedIn()) {
      alert('You are not allowed to view this page. You are redirected to login Page');

      this.router.navigate(['login'], {
        queryParams: { retUrl: route.url },
      });
      return false;

      //var urlTree = this.router.createUrlTree(['login']);
      //return urlTree;
    }

    if (!this.authService.isRouteAuthorized(route.url[0].path)) {
      alert('You are not allowed to view this page. You are redirected to login Page');

      this.router.navigate(['login']);
      return false;

      //var urlTree = this.router.createUrlTree(['login']);
      //return urlTree;
    }

    return true;
  }
  canDeactivate(): boolean {
    if (this.settingService.getFormDirty()) {
      return confirm(this.settingService.getLabelValue('unsavedChangesConfirmation'));
    }
    return true;
  }
}
