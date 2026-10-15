import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';
import { OtpComponent } from 'src/app/system-common/otp/otp.component';
import { SettingService } from 'src/app/system-common/services/setting.service';
import data from 'src/assets/config/url-config.json';

@Component({
  selector: 'sym-transfer-customer-otp',
  templateUrl: './transfer-customer-otp.component.html',
  styleUrls: ['./transfer-customer-otp.component.css'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class TransferCustomerOtpComponent extends OtpComponent {
  userType: any;
  companySUNPH: any;
  company: any;
  @Input() otpMobileNumber: any;
  @Input() otpRecipientEmailId: any;
  @Input() otpRecipientAddress: any;

  constructor(public settingService: SettingService, protected formBuilder: UntypedFormBuilder) {
    super(settingService, formBuilder);
    this.userType = this.settingService.getSessionStorageValue('userType');
    let url = data;
    this.companySUNPH = url[1]?.companySUNPH;

    this.company = SettingService.getApplicationPropertiesValue('COMPANYCOLOUR');
  }

  notMyNumber() {
    this.openModal('notMyNumberPopup');
  }

  ngOnDestroy() {
    $('#notMyNumberPopup').hide();
  }
}
