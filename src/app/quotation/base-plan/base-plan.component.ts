import { Component, ChangeDetectionStrategy } from '@angular/core';
import { QuotationService } from '../services/quotation.service';
import { BasePlanHandlerComponent } from './base-plan.handler';
import { FieldItem } from 'src/app/models/common/field-item';

@Component({
  selector: 'sym-base-plan',
  templateUrl: './base-plan.component.html',
  styleUrls: ['./base-plan.component.css'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class BasePlanComponent extends BasePlanHandlerComponent {
  constructor(quotationService: QuotationService) {
    super(quotationService);
    // console.log(this.service.responseIO.data['BasePlan'].productSeq);
  }

  ngOnInit() {
    super.ngOnInit();
    if (this.service.responseIO.data.BasePlan.baseSumAssured === 0) {
      this.service.setModelFieldValue(this.service.responseIO.data.BasePlan, 'baseSumAssured', null);
    }
    if (this.service.responseIO.data.BasePlan.baseAnnualPremium === 0) {
      this.service.setModelFieldValue(this.service.responseIO.data.BasePlan, 'baseAnnualPremium', null);
    }
    if (this.service.responseIO.data.BasePlan.modalPremium === 0) {
      this.service.setModelFieldValue(this.service.responseIO.data.BasePlan, 'modalPremium', null);
    }
  }
  public baseSumAssured_change(item: FieldItem): void {
    super.baseSumAssured_change(item);
    if (this.service.responseIO.data.WithdrawalList && this.service.responseIO.data.WithdrawalList.length > 0) {
      this.service.responseIO.data.Entity.campaignCode = 'RESET';
    }
  }
  protected paymentFrequencyCd_change(item: FieldItem) {
    //  super.paymentFrequencyCd_change(item);
    if (this.service.responseIO.data.WithdrawalList && this.service.responseIO.data.WithdrawalList.length > 0) {
      this.service.responseIO.data.Entity.campaignCode = 'RESET';
    }
  }
  public addtnField4_change() {
    if (this.service.responseIO.data.BasePlan.payoutFrequencyCd != null) {
      this.notifyReloadStep.emit();
    }
  }
  public addtnField6_change() {
    if (this.service.responseIO.data.BasePlan.payoutFrequencyCd != null) {
      this.notifyReloadStep.emit();
    }
  }
  public topupOptionCd_change() {
    if (this.service.responseIO.data.BasePlan.payoutFrequencyCd != null) {
      this.notifyReloadStep.emit();
    }
  }
}
