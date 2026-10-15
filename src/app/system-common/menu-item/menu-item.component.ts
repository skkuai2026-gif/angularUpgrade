import { Component, Input, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { MenuItem } from 'src/app/models/common/menu-item';
import { MenuService } from '../services/menu.service';
import { SettingService } from '../services/setting.service';
import { HeaderService } from '../services/header.service';
import { OfflineService } from 'src/app/offline/offline.service';

declare const setScrollAndScreenHeight: any;

@Component({
  selector: 'sym-menu-item',
  templateUrl: './menu-item.component.html',
  styleUrls: ['./menu-item.component.css'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class MenuItemComponent implements OnInit {
  @Input() menu: MenuItem;
  @Input() parentMenu: MenuItem;

  constructor(
    public settingService: SettingService,
    public service: MenuService,
    public offlineService: OfflineService
  ) {
    // Subscribe to the network status observable from the service
    if (this.settingService.getApplicationMode() === 'offline') {
      this.offlineService.networkStatus$.subscribe((status) => {
        this.settingService.isConnected = status; // Update the local variable when status changes
      });
    }
  }

  ngOnInit(): void {
    if (!this.parentMenu)
      this.findParentMenu(
        this.service.menuItems,
        this.findMenuByAction(this.service.menuItems, this.settingService.router.url)
      );
  }

  onMenuSelected(menu?: MenuItem, parentMenu?: MenuItem) {
    if (menu.childList && menu.childList != undefined) {
      menu.isChildSelected = !menu.isChildSelected;
    } else if (menu.code === 'SignOutAPI') {
      if (
        this.settingService.getApplicationMode() === 'offline' &&
        !this.settingService.isConnected &&
        this.settingService.isOktaLogin
      ) {
        alert('Need network access to call logout API');
      } else {
        this.setMenuOption();
        let headerTitle = SettingService.getInjector().get(HeaderService);
        if (headerTitle.pageHeader != undefined) {
          headerTitle.pageHeader.title = null;
          headerTitle.pageHeader.additionalInfo = null;
        }
        this.settingService.logoutUser();
      }
    } else {
      this.setMenuOption();
    }
    this.closeMenu(parentMenu && parentMenu.childList ? parentMenu.childList : this.service.menuItems, menu);
  }

  setMenuOption() {
    $('.btnLeftNav').trigger('click');
    this.settingService.setSessionStorageValue('isMenuSelected', 'true');
    setScrollAndScreenHeight();
  }

  closeMenu(items: MenuItem[], menu: MenuItem) {
    items.filter((item) => {
      if (item.code !== menu.code) item.isChildSelected = false;
      if (item.childList) this.closeMenu(item.childList, menu);
    });
  }

  findParentMenu(menuItems: MenuItem[], childMenu: MenuItem) {
    for (let item of menuItems) {
      if (item.childList && item.childList.includes(childMenu)) {
        item.isChildSelected = true;
        this.findParentMenu(this.service.menuItems, item);
      }
      if (item.childList) this.findParentMenu(item.childList, childMenu);
    }
  }

  findMenuByAction(menuItems: MenuItem[], action: string): MenuItem | null {
    for (let item of menuItems) {
      if (item.action === action) {
        item.isChildSelected = true;
        return item;
      }
      if (item.childList) {
        let childResult = this.findMenuByAction(item.childList, action);
        if (childResult) return childResult;
      }
    }
    return null;
  }
}
