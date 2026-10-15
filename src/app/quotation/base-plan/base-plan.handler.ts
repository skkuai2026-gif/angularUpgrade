import { Component, SimpleChanges, OnChanges, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { FieldItem } from 'src/app/models/common/field-item';
import { BaseComponent } from 'src/app/system-common/base/base.component';
import { QuotationService } from '../services/quotation.service';
import { ResponseIO } from 'src/app/models/responseIO';

@Component({
  selector: '',
  template: '',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class BasePlanHandlerComponent extends BaseComponent<QuotationService> implements OnChanges {
  @Output() notifyReloadStep = new EventEmitter();
  constructor(quotationService: QuotationService) {
    super(quotationService);
    // console.log(this.service.responseIO.data['BasePlan'].productSeq);
  }

  ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
  }

  protected currencyCd_change(item: FieldItem) {
    if (item.event != undefined) this.validateQuotation(undefined, item);
  }

  protected baseSumAssured_change(item: FieldItem) {
    //calling validate quotation when only field is changed
    //event is undefined when value has been set through api call.
    if (item.event != undefined) this.validateQuotation(undefined, item);
  }

  protected baseAnnualPremium_change(item: FieldItem) {
    //calling validate quotation when only field is changed
    //event is undefined when value has been set through api call.
    if (item.event != undefined) this.validateQuotation(undefined, item);
  }

  protected modalPremium_change(item: FieldItem) {
    //calling validate quotation when only field is changed
    //event is undefined when value has been set through api call.
    if (item.event != undefined) this.validateQuotation(undefined, item);
  }

  protected paymentFrequencyCd_change(item: FieldItem) {
    if (item.event != undefined) this.validateQuotation(undefined, item);
  }

  protected premiumPayingTerm_focus(item: FieldItem) {
    //if lookupdatacodes is defined implies it is coming from prdfieldmetadata and no need to apply dt and filter using specific logic.
    if (
      item.fieldMetadata != undefined &&
      item.fieldMetadata.LOOKUPDATACODES == undefined &&
      item.fieldMetadata.LOOKUPDATACODESRANGE == undefined
    )
      this.service.getPremiumPayingTerm(item);
  }
  protected productTerm_focus(item: FieldItem) {
    //if lookupdatacodes is defined implies it is coming from prdfieldmetadata and no need to apply dt and filter using specific logic.
    if (
      item.fieldMetadata != undefined &&
      item.fieldMetadata.LOOKUPDATACODES == undefined &&
      item.fieldMetadata.LOOKUPDATACODESRANGE == undefined
    )
      this.service.getProductTerm(item);
  }

  protected validateQuotation(isRefreshValidationerrors?: boolean, item?: FieldItem) {
    let modelNameListArray = ['BasePlan', 'RiderList'];
    let respData: any;
    let beforeValidateRiderSize = 0;
    let afterValidateRiderSize = 0;
    if (this.service.responseIO.data.RiderList != undefined && this.service.responseIO.data.RiderList.length > 0)
      beforeValidateRiderSize = this.service.responseIO.data.RiderList.length;
    this.service.validateQuotation(modelNameListArray, 'calculatePremium', true).subscribe(
      (successResponse) => {
        respData = JSON.parse(JSON.stringify(successResponse));
        //Need to clone the responseIO since it should get updated for the components
        //to detect the changes and reflect on UI.
        let responseIO: ResponseIO = new ResponseIO();
        let oldRespIO: ResponseIO = this.service.responseIO;
        responseIO = responseIO.copyFrom(oldRespIO);
        //let responseIO = oldRespIO.clone();
        this.service.responseIO = responseIO;
        this.service.responseIO.data.BasePlan = respData.data.BasePlan;
        this.service.responseIO.data.RiderList = [];
        this.service.responseIO.data.RiderList = respData.data.RiderList;

        if (isRefreshValidationerrors) this.service.responseIO.validationerrors = respData.validationerrors;
        //Object.assign(this.service.responseIO.validationerrors, respData.validationerrors);
        this.service.refreshMetaData(respData);
        //refresh plan option lookup in bank flow plan option change as per different product selection in comparison.
        if (
          respData.lookups['PLANOPTION'] != undefined &&
          this.service.responseIO.lookups['PLANOPTION'] != undefined
        ) {
          this.service.responseIO.lookups['PLANOPTION'] = respData.lookups['PLANOPTION'];
        }
        this.postValidateQuotation();
        //check if rider size changed then add or remove rider tab from
        if (respData.data.RiderList != undefined && respData.data.RiderList.length > 0)
          afterValidateRiderSize = respData.data.RiderList.length;
        if (beforeValidateRiderSize != afterValidateRiderSize) this.notifyReloadStep.emit();
        this.setFieldFocus(item.model, item.fieldCd);
      },
      (error) => {
        console.log('Error:', error);
      }
    );
  }

  protected postValidateQuotation() {}

  public onWithdrawalList_RowAdded(event: any) {
    this.service.addWithdrawal();
  }
}
