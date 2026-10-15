import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { PageHeader } from 'src/app/models/common/page-header';
import { HeaderService } from 'src/app/system-common/services/header.service';
import { SettingService } from 'src/app/system-common/services/setting.service';
import { BreadCrumb } from './../../models/common/bread-crumb';

@Component({
  selector: 'sym-policy-insurance-type-select',
  templateUrl: './policy-insurance-type-select.component.html',
  styleUrls: ['./policy-insurance-type-select.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class PolicyInsuranceTypeSelectComponent implements OnInit {
  constructor(private headerService: HeaderService, public settingService: SettingService) {
    this.getPageHeader();
  }
  public breadCrumbList: BreadCrumb[];

  ngOnInit() {
    this.breadCrumbList = [];
    this.breadCrumbList = this.getBreadCrumbList();
    setTimeout(() => {
      $(document).on('click', '.sectionInsuraneType .sectionContent .card', function () {
        $(this).closest('.sectionContent').find('.card').removeClass('active');
        $(this).addClass('active');
      });
      setTimeout(() => {
        // this.settingService.loadScroll();
      }, 15);
    }, 10);
  }

  private getPageHeader() {
    this.headerService.pageHeader = new PageHeader();
    this.headerService.pageHeader.title = 'E-Application';
  }

  protected getBreadCrumbList(): BreadCrumb[] {
    return [
      {
        id: 'home',
        link: '/home',
      },
      // {
      //   id: 'E-Application',
      // },
    ];
  }
}
