import { BaseComponent } from 'src/app/system-common/base/base.component';
import { QuotationService } from '../services/quotation.service';
import { Component, OnChanges, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { SettingService } from 'src/app/system-common/services/setting.service';
import { FieldItem } from 'src/app/models/common/field-item';

@Component({
  selector: '',
  template: '',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class QuotationPartyAddressHandlerComponent extends BaseComponent<QuotationService> implements OnChanges {
  constructor(quotationService: QuotationService, public settingService: SettingService) {
    super(quotationService);
  }
  ngOnInit() {
    super.ngOnInit();
  }
  ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
  }
  protected pinCode_change(item: FieldItem) {
    this.service.setModelFieldValue(item.model, 'cityCd', null);
    this.service.setModelFieldValue(item.model, 'stateCd', null);
  }

  protected countryCd_change(item: FieldItem) {
    this.service.setModelFieldValue(item.model, 'cityCd', null);
    this.service.setModelFieldValue(item.model, 'stateCd', null);
    this.service.setModelFieldValue(item.model, 'pinCode', null);
  }

  protected stateCd_change(item: FieldItem) {
    this.service.setModelFieldValue(item.model, 'cityCd', null);
  }

  protected stateCd_focus(item: FieldItem) {
    this.service.getStateCd(item);
  }

  protected cityCd_focus(item: FieldItem) {
    this.service.getCityCd(item);
  }
}
