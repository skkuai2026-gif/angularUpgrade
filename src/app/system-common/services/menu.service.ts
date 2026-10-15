import { ParentService } from './parent.service';
import { AuthService } from 'src/app/auth.service';
import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SettingService } from './setting.service';
import { tap } from 'rxjs/operators';
import { ResponseIO } from 'src/app/models/responseIO';
import { MenuItem } from 'src/app/models/common/menu-item';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class MenuService extends ParentService {
  /**
   * To hide the side nav. Default value is false.
   */
  public hideSideNav: boolean = false;

  /**
   * to check if menu is loaded or not. Default value is False.
   */
  public isMenuLoaded: boolean = false;

  /**
   * This holds menu list. MenuItem JSON Object.
   */
  public menuItems: MenuItem[] = [];

  constructor(
    protected http: HttpClient,
    public settingService: SettingService,
    public authService: AuthService,
    private router: Router
  ) {
    super(settingService, http);
  }

  /**
   * it will initialize and load the menu items
   * @returns the JSON Object of menu items
   */
  public init(): any {
    return this.getMenuItems().subscribe(
      () => {
        console.log('Get menu successful.');
      },
      (error) => {
        console.log('Get menu failed.');
        console.log('Error:', error);
        this.handleError(error);
      }
    );
  }
  /**
   * @ignore
   */
  private getMenuItems() {
    return this.httpGet(`${this.settingService.getURLValue('MENU')}`).pipe(
      tap((menus) => {
        let responseIO: ResponseIO = new ResponseIO();
        responseIO = JSON.parse(JSON.stringify(menus));
        this.menuItems = responseIO.data;
        console.log('this.menuItems line no65', this.menuItems);

        this.menuItems.filter((menu, index) => {
          // Remove 'SyncAPI' in non-offline mode
          if (
            this.settingService.getApplicationMode() !== 'offline' &&
            menu.serviceType === 'SYSTEM' &&
            menu.code === 'SyncAPI'
          ) {
            this.menuItems.splice(index, 1);
          }

          // Remove 'SettingsAPI' in non-offline mode
          if (this.settingService.getApplicationMode() !== 'offline' && menu.code === 'SettingsAPI') {
            this.menuItems.splice(index, 1);
          }
          // Remove 'Get SunSMART App' in offline mode
          if (
            this.settingService.getApplicationMode() == 'offline' &&
            menu.code === 'GetSunSMART_App' &&
            menu.serviceType === 'SYSTEM'
          ) {
            this.menuItems.splice(index, 1);
          }

          // Remove 'Import Client' in offline mode
          if (this.settingService.getApplicationMode() == 'offline' && menu.code === 'searchClientsInC360') {
            this.menuItems.splice(index, 1);
          }

          // Handle childList and selection
          if (menu.childList && menu.childList != undefined && menu.childList != null) {
            if (this.router.url == menu.action) {
              menu.isChildSelected = true;
            } else {
              menu.isChildSelected = false;
            }
          }
        });

        if (
          (sessionStorage.length > 0 && this.settingService.getSessionStorageValue('isMenuSelected') === 'true') ||
          this.settingService.isMobileViewRendered() ||
          SettingService.getApplicationPropertiesValue('MENUVISIBLEONLOGIN') == undefined ||
          SettingService.getApplicationPropertiesValue('MENUVISIBLEONLOGIN') === 'NO'
        ) {
          $('.btnLeftNav').trigger('click');
          this.settingService.setSessionStorageValue('isMenuSelected', 'true');
        } else {
          this.settingService.setSessionStorageValue('isMenuSelected', 'false');
        }
        this.isMenuLoaded = true;
      })
    );
  }

  /**
   * This will toggle the menu in left side.
   */
  public toggleSideNav(): void {
    this.hideSideNav = !this.hideSideNav;
  }
}
