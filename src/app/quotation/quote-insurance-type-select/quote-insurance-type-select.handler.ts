import { BreadCrumb } from './../../models/common/bread-crumb';
import { HeaderService } from 'src/app/system-common/services/header.service';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { PageHeader } from 'src/app/models/common/page-header';
import { SettingService } from 'src/app/system-common/services/setting.service';

@Component({
  selector: '',
  template: '',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class QuoteInsuranceTypeSelectHandlerComponent implements OnInit {
  constructor(public headerService: HeaderService, public settingService: SettingService) {
    this.getPageHeader();
  }
  public breadCrumbList: BreadCrumb[];

  ngOnInit(): void {
    this.breadCrumbList = [];
    this.breadCrumbList = this.getBreadCrumbList();
    setTimeout(() => {
      $(document).on('click', '.sectionInsuraneType .sectionContent .card', function () {
        $(this).closest('.sectionContent').find('.card').removeClass('active');
        $(this).addClass('active');
      });
      //setTimeout(() => {
      //   this.settingService.loadScroll();
      //}, 15);
    }, 10);
  }

  private getPageHeader() {
    this.headerService.pageHeader = new PageHeader();
    this.headerService.pageHeader.title = 'Illustration';
  }
  protected getBreadCrumbList(): BreadCrumb[] {
    return [
      {
        id: 'home',
        link: '/home',
      },
      {
        id: 'SalesIllustration',
      },
    ];
  }
}
