import { Component, Input, OnChanges, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { SettingService } from 'src/app/system-common/services/setting.service';
import { PolicyService } from '../services/policy.service';
import { NavigationLink } from './../../models/common/navigation-link';
import { PolicyPaymentHandlerComponent } from './policy-payment.handler';
import { FieldItem } from 'src/app/models/common/field-item';

@Component({
  selector: 'sym-policy-payment',
  templateUrl: './policy-payment.component.html',
  styleUrls: ['./policy-payment.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class PolicyPaymentComponent extends PolicyPaymentHandlerComponent implements OnChanges {
  @Input() responseUpdated: boolean;
  navigationLinkList: NavigationLink[];

  constructor(policyService: PolicyService, public settingService: SettingService) {
    super(policyService, settingService);
    //console.log(this.service.responseIO);
  }

  ngOnInit() {
    super.ngOnInit();
  }

  ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
  }
  ngAfterViewInit(): void {
    setTimeout(() => {
      if (this.service.responseIO.data.Entity.statusCd === 'ACCEPTED') {
        this.disableSPAJBtn();
      }
    }, 0);
  }

  public disableSPAJBtn() {
    const button = document.getElementById('spajId');
    button.classList.add('disabled');
  }
  public policyField34_change(item: FieldItem) {
    this.service.setModelFieldValue(this.service.responseIO.data.PaymentAdditionalFields, 'policyField35', null);
    this.service.setModelFieldValue(this.service.responseIO.data.PaymentAdditionalFields, 'policyFieldDt51', null);
    this.service.setModelFieldValue(this.service.responseIO.data.PaymentAdditionalFields, 'policyField37', null);
  }
  public policyField44_change(item: FieldItem) {
    this.service.setModelFieldValue(this.service.responseIO.data.PaymentAdditionalFields, 'policyField45', null);
    this.service.setModelFieldValue(this.service.responseIO.data.PaymentAdditionalFields, 'policyFieldDt52', null);
    this.service.setModelFieldValue(this.service.responseIO.data.PaymentAdditionalFields, 'policyField47', null);
  }
  public policyField48_change(item: FieldItem) {
    this.service.setModelFieldValue(this.service.responseIO.data.PaymentAdditionalFields, 'policyField49', null);
  }
  public field1_change(item: FieldItem) {
    this.service.setModelFieldValue(this.service.responseIO.data.PaymentAdditionalFields, 'field2', null);
    this.service.setModelFieldValue(this.service.responseIO.data.PaymentAdditionalFields, 'policyFieldDt53', null);
    this.service.setModelFieldValue(this.service.responseIO.data.PaymentAdditionalFields, 'field14', null);
  }
  public field5_change(item: FieldItem) {
    this.service.setModelFieldValue(this.service.responseIO.data.PaymentAdditionalFields, 'field6', null);
    this.service.setModelFieldValue(this.service.responseIO.data.PaymentAdditionalFields, 'policyFieldDt54', null);
    this.service.setModelFieldValue(this.service.responseIO.data.PaymentAdditionalFields, 'field8', null);
    this.service.setModelFieldValue(this.service.responseIO.data.PaymentAdditionalFields, 'field9', null);
  }
  public field10_change(item: FieldItem) {
    this.service.setModelFieldValue(this.service.responseIO.data.PaymentAdditionalFields, 'field11', null);
    this.service.setModelFieldValue(this.service.responseIO.data.PaymentAdditionalFields, 'policyFieldDt55', null);
    this.service.setModelFieldValue(this.service.responseIO.data.PaymentAdditionalFields, 'field13', null);
  }
  public spajId_click() {
    let applicationType: any;
    let proposalNum = this.service.responseIO.data.Entity.proposalNum;
    console.log('in generate SPAJ Number');
    applicationType = this.service.responseIO.data.BasePlan.addtnField1;
    this.service.generateApplicationNumber(applicationType, proposalNum).subscribe(
      (body) => {
        let resp = JSON.parse(JSON.stringify(body));
        console.log('applicationNum', resp.data.applicationNum);
        this.service.responseIO.data.PolicyAdditionalFields.field2 = resp.data.applicationNum;
      },
      (error) => {
        console.log('Error:', error);
      }
    );
  }
}
