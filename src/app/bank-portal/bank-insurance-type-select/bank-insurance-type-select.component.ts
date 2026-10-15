import { BreadCrumb } from 'src/app/models/common/bread-crumb';
import { SettingService } from 'src/app/system-common/services/setting.service';
import { HeaderService } from 'src/app/system-common/services/header.service';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { PageHeader } from 'src/app/models/common/page-header';

@Component({
  selector: 'sym-bank-insurance-type-select',
  templateUrl: './bank-insurance-type-select.component.html',
  styleUrls: ['./bank-insurance-type-select.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class BankInsuranceTypeSelectComponent implements OnInit {
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
      // setTimeout(() => {
      //   this.settingService.loadScroll();
      // }, 15);
    }, 10);
  }

  private getPageHeader() {
    // this.headerService.pageHeader = new PageHeader();
    // this.headerService.pageHeader.title = 'Bank';
  }
  protected getBreadCrumbList(): BreadCrumb[] {
    return undefined;
  }

  public onBankInsuranceTypeClick(type: string) {
    this.settingService.setSessionStorageValue('insuranceTypeCd', type);
  }
}
