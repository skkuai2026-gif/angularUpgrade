import { Component, OnChanges, OnInit, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { FieldItem } from 'src/app/models/common/field-item';
import { BaseComponent } from 'src/app/system-common/base/base.component';
import { QuotationService } from '../services/quotation.service';
import { CustomFormatPipe } from '../../system-common/pipe/custom-format.pipe';
@Component({
  selector: '',
  template: '',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class TopupHandlerComponent extends BaseComponent<QuotationService> implements OnChanges {
  public topupOptionCd: string = this.service.responseIO.data['Entity'].topupOptionCd;
  constructor(quotationService: QuotationService, private customFormatPipe: CustomFormatPipe) {
    super(quotationService);
  }
  ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
  }

  public topupOptionCd_change(item: FieldItem) {
    this.topupOptionCd = item.model.topupOptionCd;
  }

  public onAdHocTopupChanged(item: FieldItem) {
    //alert('onAdHocTopupChanged: ' + item.fieldCd);
  }

  public onTransferTopupChanged(item: FieldItem) {
    //alert('onTransferTopupChanged: ' + item.fieldCd);
  }

  public onAdHocTopupRowAdded(event: any) {
    this.service.addTopup('ADHOCTOPUP', this.service.responseIO.data['AdHocTopupList']);
  }

  public onTransferTopupRowAdded(event: any) {
    this.service.addTopup('TRANSFERTOPUP', this.service.responseIO.data['TransferTopupList']);
  }

  public regularTopupFl_change(item: FieldItem) {
    if (item.model.regularTopupFl == 'NO') {
      this.service.setModelFieldValue(this.service.responseIO.data.RegularTopup, 'topUpPeriod', undefined);
      this.service.setModelFieldValue(this.service.responseIO.data.RegularTopup, 'topUpAmount', undefined);
      this.service.setModelFieldValue(this.service.responseIO.data.RegularTopup, 'topupFrequencyVal', undefined);
    }
  }

  onTargetFundButtonClick() {
    this.service.responseIO.data.Entity.currentSolverFacetId = 'TARGETFUNDVALUESOLVER';
    let modelNameListArray = ['BasePlan', 'RegularTopup'];
    let respData: any;
    this.service.solve(modelNameListArray).subscribe(
      (successResponse) => {
        respData = JSON.parse(JSON.stringify(successResponse));
        // console.log('solver responser: ', respData.data.BasePlan);
        this.confirm(
          'Update ' +
            this.service.getLabelValue(this.service.responseIO.data.RegularTopup, 'topUpAmount') +
            ' to ' +
            this.customFormatPipe.transform(
              Math.round(respData.data.RegularTopup.topUpAmount / 1000) * 1000,
              this.service.getFieldMetadata(this.service.responseIO.data['BasePlan'], 'baseSumAssured')
            ) +
            ' ? ',
          () => {
            this.service.responseIO.data.BasePlan = respData.data.BasePlan;
            this.service.responseIO.data.RegularTopup = respData.data.RegularTopup;
            //rounding to the nearest 1000 done here.
            this.service.responseIO.data.RegularTopup.topUpAmount =
              Math.round(this.service.responseIO.data.RegularTopup.topUpAmount / 1000) * 1000;
            this.service.refreshMetaData(respData);
          },
          () => {
            return false;
          }
        );
      },
      (error) => {
        console.log('Error:', error);
      }
    );
  }
}
