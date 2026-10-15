import { FieldItem } from 'src/app/models/common/field-item';
import { Component, Input, OnChanges, OnInit, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { TabItem } from 'src/app/models/common/tab-items';
import { BaseComponent } from 'src/app/system-common/base/base.component';
import { SettingService } from 'src/app/system-common/services/setting.service';
import { PolicyService } from '../services/policy.service';

@Component({
  selector: 'sym-policy-renewal-payment',
  templateUrl: './policy-renewal-payment.component.html',
  styleUrls: ['./policy-renewal-payment.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class PolicyRenewalPaymentComponent extends BaseComponent<PolicyService> implements OnChanges, OnInit {
  paymentTabList: TabItem[];
  selectedPaymentTab: TabItem;
  @Input() responseUpdated: boolean;
  public fieldIds: string;

  constructor(policyService: PolicyService, public settingService: SettingService) {
    super(policyService);
    //console.log(this.service.responseIO);
  }
  ngOnInit(): void {
    this.changeFieldsOnBasisOfPaymentMethod(this.service.responseIO.data.RenewalPayment.paymentMethodCd);
  }

  ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
    if (changes['responseUpdated'] && changes['responseUpdated'].currentValue) {
      if (this.responseUpdated) {
        this.changeFieldsOnBasisOfPaymentMethod(this.service.responseIO.data.RenewalPayment.paymentMethodCd);
      }
    }
  }
  protected paymentMethodCd_change(item: FieldItem) {
    let paymentMethodCd = item.model.paymentMethodCd;
    this.changeFieldsOnBasisOfPaymentMethod(paymentMethodCd);
    if (paymentMethodCd == 'directDebit' || paymentMethodCd == 'directCredit') {
      item.model.RenewalPaymentDetails.cardTypeCd = null;
      item.model.RenewalPaymentDetails.cardExpiryYear = null;
      item.model.RenewalPaymentDetails.cardExpiryMnth = null;
    } else if (paymentMethodCd == 'creditCard') {
      item.model.RenewalPaymentDetails.micrNum = null;
      item.model.RenewalPaymentDetails.bankCd = null;
      item.model.RenewalPaymentDetails.branchName = null;
    } else if (paymentMethodCd == 'CHEQUE') {
      item.model.RenewalPaymentDetails.cardTypeCd = null;
      item.model.RenewalPaymentDetails.cardExpiryYear = null;
      item.model.RenewalPaymentDetails.cardExpiryMnth = null;
      item.model.RenewalPaymentDetails.micrNum = null;
      item.model.RenewalPaymentDetails.bankCd = null;
      item.model.RenewalPaymentDetails.branchName = null;
      item.model.RenewalPaymentDetails.accountName = null;
      item.model.RenewalPaymentDetails.accountNum = null;
    }
  }
  private changeFieldsOnBasisOfPaymentMethod(paymentMethodCd: string) {
    if (paymentMethodCd == 'directDebit' || paymentMethodCd == 'directCredit')
      this.fieldIds = 'accountName,accountNum,micrNum,bankCd,branchName';
    else if (paymentMethodCd == 'creditCard')
      this.fieldIds = 'accountName,accountNum,cardTypeCd,cardExpiryYear,cardExpiryMnth';
    else if (paymentMethodCd == 'CHEQUE') this.fieldIds = undefined;
  }
}
