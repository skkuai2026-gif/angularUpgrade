import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { SettingService } from 'src/app/system-common/services/setting.service';
import data from 'src/assets/config/url-config.json';

@Component({
  selector: 'sym-policy-customer-complete',
  templateUrl: './policy-customer-complete.component.html',
  styleUrls: ['./policy-customer-complete.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class PolicyCustomerCompleteComponent implements OnInit {
  userType: any;
  companySUNPH: any;
  company: any;
  constructor(public settingService: SettingService) {
    this.userType = this.settingService.getSessionStorageValue('userType');
    let url = data;
    this.companySUNPH = url[1]?.companySUNPH;
    this.company = SettingService.getApplicationPropertiesValue('COMPANYCOLOUR');
  }

  ngOnInit() {}
}
