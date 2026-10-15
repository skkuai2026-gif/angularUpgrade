import { AuthService } from './../../auth.service';
import { Component, ElementRef, OnInit, SimpleChanges, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { Location } from '@angular/common';

import { MenuService } from 'src/app/system-common/services/menu.service';
import { SettingService } from '../services/setting.service';

import { HeaderService } from '../services/header.service';
import { BaseService } from '../services/base.service';
declare const openPopup: any;
@Component({
  selector: 'sym-top-header',
  templateUrl: './top-header.component.html',
  styleUrls: ['./top-header.component.css'],
  host: {
    '(document:click)': 'onDropdownOutsideClick($event)',
  },
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class TopHeaderComponent implements OnInit {
  @ViewChild('dropdown') dropdown: ElementRef;
  @ViewChild('dropdownMenu') dropdownMenu: ElementRef;
  @ViewChild('dropdownMenuBtn') dropdownMenuBtn: ElementRef;
  company: any;
  isNotificationSeen: boolean = true;
  isClickNotificationIcon: boolean = false;
  [x: string]: any;
  messageNotification: any;
  notificationBody: any;
  channel: any;
  agentId: any;
  constructor(
    public menuService: MenuService,
    public settingService: SettingService,
    private location: Location,
    public authService: AuthService,
    public headerService: HeaderService,
    public baseService: BaseService
  ) {
    this.headerService.isShow = false;
  }

  ngOnInit(): void {
    this.company = SettingService.getApplicationPropertiesValue('COMPANYCOLOUR');
  }

  ngOnChanges(changes: SimpleChanges) {}

  ngOnDestroy(): void {
    this.isClickNotificationIcon = false;
  }
  agentNotificationMoreOption_click() {
    this.isNotificationSeen = true;
    this.isClickNotificationIcon = true;
    this.openPopup('AgentNotification');
    let userdata = this.baseService.getUserLoginData();
    this.channel = userdata['agentInfo']['channel'];
    this.agentId = userdata['agentInfo']['agentId'];
    this.getSingleNotification(this.channel, this.agentId);
  }
  public openPopup(id: string) {
    openPopup(id);
  }

  /**
   * @ignore
   */
  goBack(): void {
    this.headerService.errorCount = undefined;
    this.location.back();
  }
  /**
   * This emitts the selected option from the header.
   * @param buttonClicked selected option from the header.
   */
  onMoreOptionClicked(buttonClicked: { id: string; link: string }) {
    this.headerService.isOptionCalled = false;
    this.headerService.forwardOptionSelected(buttonClicked);
  }

  onDropdownOutsideClick(event) {
    if (this.dropdown != undefined) {
      if (!this.dropdown.nativeElement.contains(event.target)) {
        if (this.dropdownMenu.nativeElement.classList.contains('show')) {
          this.dropdownMenuBtn.nativeElement.click();
        }
      }
    }
  }

  headerChanges() {
    this.headerService.setPageDocumentTitle();
    return true;
  }
  ngAfterViewInit(): void {
    // let userdata = this.baseService.getUserLoginData();
    // console.log('userdatatopheader', userdata);
    // this.channel = userdata['agentInfo']['channel'];
    // this.agentId = userdata['agentInfo']['agentId'];
    // console.log('agentId', this.agentId);
    // this.getSingleNotification(this.channel, this.agentId);
  }
  getSingleNotification(channel: string, agentId: string) {
    let respData;
    this.baseService.getSingleNotification(channel, agentId).subscribe((response) => {
      console.log('Notification response:', response);
      respData = JSON.parse(JSON.stringify(response));
      console.log('respData', respData);
      if (this.settingService.getApplicationMode() === 'online') {
        let agentName = this.agentId;
        this.notificationBody = respData.data[agentName].notificationBody;
        this.notificationSubject = respData.data[agentName].notificationSubject;
      } else {
        this.notificationBody = respData.data?.notificationBody;
        this.notificationSubject = respData.data?.notificationSubject;
      }
      if (this.notificationSubject?.trim() && this.notificationBody?.trim()) {
        this.isNotificationSeen = false;
      }
    });
  }
}
