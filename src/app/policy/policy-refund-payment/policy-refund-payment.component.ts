import { FieldItem } from 'src/app/models/common/field-item';
import { Component, Input, OnChanges, OnInit, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { TabItem } from 'src/app/models/common/tab-items';
import { BaseComponent } from 'src/app/system-common/base/base.component';
import { SettingService } from 'src/app/system-common/services/setting.service';
import { PolicyService } from '../services/policy.service';

@Component({
  selector: 'sym-policy-refund-payment',
  templateUrl: './policy-refund-payment.component.html',
  styleUrls: ['./policy-refund-payment.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class PolicyRefundPaymentComponent extends BaseComponent<PolicyService> implements OnChanges, OnInit {
  paymentTabList: TabItem[];
  selectedPaymentTab: TabItem;
  public fieldIds: string;
  @Input() responseUpdated: boolean;

  constructor(policyService: PolicyService, public settingService: SettingService) {
    super(policyService);
    //console.log(this.service.responseIO);
  }
  ngOnInit(): void {
    this.changeFieldsOnBasisOfPaymentMethod(this.service.responseIO.data.RefundPayment.paymentMethodCd);
  }
  ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
    if (changes['responseUpdated'] && changes['responseUpdated'].currentValue) {
      if (this.responseUpdated) {
        this.changeFieldsOnBasisOfPaymentMethod(this.service.responseIO.data.RefundPayment.paymentMethodCd);
      }
    }
  }

  protected paymentMethodCd_change(item: FieldItem) {
    let paymentMethodCd = item.model.paymentMethodCd;
    this.changeFieldsOnBasisOfPaymentMethod(paymentMethodCd);
    if (paymentMethodCd == 'directDebit' || paymentMethodCd == 'directCredit') {
      item.model.RefundPaymentDetails.cardTypeCd = null;
      item.model.RefundPaymentDetails.cardExpiryYear = null;
      item.model.RefundPaymentDetails.cardExpiryMnth = null;
    } else if (paymentMethodCd == 'creditCard') {
      item.model.RefundPaymentDetails.micrNum = null;
      item.model.RefundPaymentDetails.bankCd = null;
      item.model.RefundPaymentDetails.branchName = null;
    } else if (paymentMethodCd == 'CHEQUE') {
      item.model.RefundPaymentDetails.cardTypeCd = null;
      item.model.RefundPaymentDetails.cardExpiryYear = null;
      item.model.RefundPaymentDetails.cardExpiryMnth = null;
      item.model.RefundPaymentDetails.micrNum = null;
      item.model.RefundPaymentDetails.bankCd = null;
      item.model.RefundPaymentDetails.branchName = null;
      item.model.RefundPaymentDetails.accountName = null;
      item.model.RefundPaymentDetails.accountNum = null;
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
