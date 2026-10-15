import { SettingService } from 'src/app/system-common/services/setting.service';
import { TabItem } from 'src/app/models/common/tab-items';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { BreadCrumb } from 'src/app/models/common/bread-crumb';
import { HeaderService } from 'src/app/system-common/services/header.service';
import { PageHeader } from 'src/app/models/common/page-header';

@Component({
  selector: 'sym-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class LandingPageComponent implements OnInit {
  tabList: TabItem[];
  selectedTab: TabItem;
  breadCrumbList: BreadCrumb[];
  constructor(public headerService: HeaderService, public settingService: SettingService) {}

  ngOnInit() {
    this.breadCrumbList = [];
    // this.breadCrumbList = this.getBreadCrumbList();
    this.getPageHeader();
    this.tabList = this.getTabList();
    if (this.tabList[0] != undefined) {
      this.selectedTab = this.tabList[0];
      this.tabList[0].isSelected = true;
    }
    // this.settingService.loadScroll();
  }

  private getPageHeader() {
    this.headerService.pageHeader = new PageHeader();
    this.headerService.pageHeader.title = 'Home';
  }

  // protected getBreadCrumbList(): BreadCrumb[] {
  //   return [    ];
  // }

  protected getTabList(): TabItem[] {
    return [
      {
        id: 'NBDASHBOARD',
        isSelected: true,
      },
      {
        id: 'NEWLEAD',
        isSelected: false,
      },
      {
        id: 'LEADATFNASTAGE',
        isSelected: false,
      },
      {
        id: 'LEADATSISTAGE',
        isSelected: false,
      },
      {
        id: 'LEADATEAPPSTAGE',
        isSelected: false,
      },
    ];
  }

  setTab(tab: TabItem) {
    this.selectedTab = tab;
  }
}
