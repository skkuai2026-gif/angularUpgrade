import { Component, OnInit, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { BaseComponent } from 'src/app/system-common/base/base.component';
import { QuotationService } from '../services/quotation.service';
import { PlanExtraListHandlerComponent } from './plan-extra-list.handler';
import { FieldItem } from 'src/app/models/common/field-item';

@Component({
  selector: 'sym-plan-extra-list',
  templateUrl: './plan-extra-list.component.html',
  styleUrls: ['./plan-extra-list.component.css'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class PlanExtraListComponent extends PlanExtraListHandlerComponent {
  constructor(quotationService: QuotationService) {
    super(quotationService);
  }
  public extraFlatAmt_change() {
    if (this.service.responseIO.data.WithdrawalList && this.service.responseIO.data.WithdrawalList.length > 0) {
      this.service.responseIO.data.Entity.campaignCode = 'RESET';
    }
  }
  public extraFlatDuration_change() {
    if (this.service.responseIO.data.WithdrawalList && this.service.responseIO.data.WithdrawalList.length > 0) {
      this.service.responseIO.data.Entity.campaignCode = 'RESET';
    }
  }
  public extraTypeCd_change(item: FieldItem) {
    let model = this.service.responseIO.data.BasePlan.PlanExtraList[0];
    if (item.model.extraTypeCd === 'MEDICALTEMPLOADING' && model) {
      this.service.setModelFieldValue(model, 'extraFlatAmt', null);
      this.service.setModelFieldValue(model, 'extraFlatDuration', null);
      this.service.setModelFieldValue(model, 'extraPercent', null);
      this.service.setModelFieldValue(model, 'extraPercDuration', null);
    }
    let riderModel = this.service.responseIO?.data?.RiderList;
    if (riderModel && riderModel.length > 0) {
      riderModel.forEach((rider: any) => {
        if (rider?.RiderExtraList && rider.RiderExtraList.length > 0) {
          rider.RiderExtraList.forEach((extra: any) => {
            if (extra?.extraTypeCd === 'MEDICALTEMPLOADING') {
              this.service.setModelFieldValue(extra, 'extraFlatAmt', null);
              this.service.setModelFieldValue(extra, 'extraFlatDuration', null);
              this.service.setModelFieldValue(extra, 'extraPercent', null);
              this.service.setModelFieldValue(extra, 'extraPercDuration', null);
            }
          });
        }
      });
    }
  }
}
