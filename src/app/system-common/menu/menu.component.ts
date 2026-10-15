import { MenuItem } from 'src/app/models/common/menu-item';
import { Component, OnInit, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { MenuService } from '../services/menu.service';

import { HeaderService } from '../services/header.service';
import { AuthService } from 'src/app/auth.service';
import { SettingService } from '../services/setting.service';
declare const setScrollAndScreenHeight: any;

@Component({
  selector: 'sym-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class MenuComponent implements OnInit {
  @Output() titleSelected = new EventEmitter<any>();

  userName: string;
  mdrtUser: any;
  mdrtFlag: boolean;
  showMDRTLabel: boolean = false;
  isUserDropdownOpen: boolean;
  constructor(
    public service: MenuService,
    private headerService: HeaderService,
    public authService: AuthService,
    public settingService: SettingService
  ) {
    // console.log('getuserlogin',this.service.getUserLoginData()['agentInfo'])
    this.mdrtUser = this.service.getUserLoginData()['agentInfo']?.field12;
    this.userName = '';
    // Read MDRT flag from sessionStorage
    if (this.mdrtUser == 'YES') {
      // const mdrtFlag = sessionStorage.getItem('MDRT_USER');
      // console.log('mdrtFlag===',mdrtFlag)
      this.userName = 'MDRT ';
      console.log('mdrtFlag===', this.mdrtUser);
    }
    this.userName +=
      this.service.getUserLoginData() != undefined && this.service.getUserLoginData()['UserName'] != undefined
        ? this.service.getUserLoginData()['UserName']
        : JSON.parse(this.settingService.getSessionStorageValue('USER'));
    this.isUserDropdownOpen = false;
  }

  ngOnInit(): void {
    if (!this.service.isMenuLoaded) {
      this.service.init();
    }
  }

  // onMenuSelected() {
  //   $('.btnLeftNav').trigger('click');
  //   this.settingService.setSessionStorageValue('isMenuSelected', 'true');
  //   setScrollAndScreenHeight();
  // }

  onUserDropDownClick() {
    this.isUserDropdownOpen = !this.isUserDropdownOpen;
  }

  // onSettingOptionClicked(selectedSetting: MenuItem) {
  //   // this.isUserDropdownOpen = false;
  //   // console.log(selectedSetting);
  //   this.onMenuSelected();
  //   if (selectedSetting.code === 'SignOutAPI') {
  //     this.settingService.logoutUser();
  //   }
  // }
  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.service.isMenuLoaded = false;
    this.service.menuItems = [];
  }
}
