import { WithdrawalComponent } from './withdrawal.component';
import { ResponseIO } from './../../models/responseIO';
import { Component, OnChanges, OnInit, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { FieldItem } from 'src/app/models/common/field-item';
import { BaseComponent } from 'src/app/system-common/base/base.component';
import { QuotationService } from '../services/quotation.service';
import { DynamicComponentList } from '../services/dynamic-component-list';
@Component({
  selector: '',
  template: '',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class WithdrawalHandlerComponent extends BaseComponent<QuotationService> implements OnChanges {
  constructor(quotationService: QuotationService) {
    super(quotationService);
  }
  protected selectedTab;
  ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
  }

  public onWithdrawalRowAdded(event: any) {
    this.service.addWithdrawal();
  }

  protected withdrawalFl_change(item: FieldItem) {
    //if (item.model.withdrawalFl == 'YES') this.validateQuotation();
    this.setFieldFocus(item.model, 'solverTypeCd');
  }

  protected solverTypeCd_change(item: FieldItem) {
    //this.validateQuotation();
  }

  onWithdrawalScheduleButtonClick() {
    let currentSolverFacetId = 'WITHDRAWALSCHEDULESOLVERTRAD';
    if (this.service.productFacets.data['WITHDRAWALSCHEDULESOLVERVUL'] != undefined)
      currentSolverFacetId = 'WITHDRAWALSCHEDULESOLVERVUL';
    this.service.responseIO.data.Entity.currentSolverFacetId = currentSolverFacetId;
    let modelNameListArray = ['WithdrawalList'];
    let respData: any;
    this.service.solve(modelNameListArray).subscribe(
      (successResponse) => {
        respData = JSON.parse(JSON.stringify(successResponse));
        // console.log('solver responser: ', respData.data.BasePlan);
        this.service.responseIO.data.WithdrawalList = respData.data.WithdrawalList;
        this.service.refreshMetaData(respData);
      },
      (error) => {
        console.log('Error:', error);
      }
    );
  }
}
