import { FieldItem } from './../../models/common/field-item';
import { SettingService } from './../../system-common/services/setting.service';
import { PolicyService } from './../services/policy.service';
import { BaseComponent } from 'src/app/system-common/base/base.component';
import { Component, OnInit, OnChanges, SimpleChanges, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: '',
  template: '',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class PayerPartyHandlerComponent extends BaseComponent<PolicyService> implements OnChanges, OnInit {
  modelPath: string;
  responseUpdated: boolean;
  respPartyRoleList: any;

  constructor(policyService: PolicyService, public settingService: SettingService) {
    super(policyService);
    //console.log(this.service.responseIO);
  }

  ngOnInit(): void {
    this.setPayerPartyDetail();
  }

  ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
    if (changes['responseUpdated'] && changes['responseUpdated'].currentValue) {
      if (this.responseUpdated) {
        this.setPayerPartyDetail();
      }
    }
  }

  private setPayerPartyDetail() {
    let model = this.service.getModel(this.modelPath);
    let respData: any;
    let paymentInstructionTypeCd = model.paymentInstructionTypeCd;
    if (this.modelPath == 'InitialPayment') paymentInstructionTypeCd = 'INITIAL';
    this.service.getPartyRoleList('PAYER', paymentInstructionTypeCd).subscribe(
      (successResponse) => {
        respData = JSON.parse(JSON.stringify(successResponse));
        this.respPartyRoleList = respData.data.values;
        this.setFieldFocus(model, 'payerPartyRefGuid');
        // $('#' + this.modelPath + '_payerPartyRefGuid').focus();
      },
      (error) => {
        console.log('Error:', error);
      }
    );
  }

  protected payerTypeCd_focus(item: FieldItem) {
    let appPartyRoles: any[] = [];
    if (this.respPartyRoleList != undefined) {
      item.options.forEach((option) => {
        if (this.respPartyRoleList[option.cd] != undefined) appPartyRoles.push(option);
      });
      item.options = appPartyRoles;
    }
    // console.log(appPartyRoles);
  }
  protected payerTypeCd_change(item: FieldItem) {
    this.setFieldFocus(item.model, 'payerPartyRefGuid');
    // $('#' + this.modelPath + '_payerPartyRefGuid').focus();
  }
  protected payerPartyRefGuid_focus(item: FieldItem) {
    let payerTypeCd = item.model.payerTypeCd;
    let payerPartyGuidList = this.respPartyRoleList[payerTypeCd];
    let partyGuidOptions = [];
    payerPartyGuidList.forEach((payerPartyGuid) => {
      let opt = { cd: payerPartyGuid.guid, desc: payerPartyGuid.name };
      partyGuidOptions.push(opt);
    });
    item.options = partyGuidOptions;
    setTimeout(() => {
      if (item.options.length == 1) {
        item.model.payerPartyRefGuid = item.options[0].cd;
        $('#' + this.modelPath + '_payerPartyRefGuid').val(item.model.payerPartyRefGuid);
      }
    }, 10);
  }
}
