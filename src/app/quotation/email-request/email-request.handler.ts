import { SettingService } from 'src/app/system-common/services/setting.service';
import { BaseComponent } from 'src/app/system-common/base/base.component';
import { QuotationService } from './../services/quotation.service';
import { Component, OnInit, SimpleChanges, OnChanges, ChangeDetectionStrategy } from '@angular/core';
@Component({
  selector: '',
  template: '',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class EmailRequestHandlerComponent extends BaseComponent<QuotationService> implements OnChanges {
  isOutputPreferenceReq: boolean;
  constructor(quotationService: QuotationService) {
    super(quotationService);

    this.isOutputPreferenceReq =
      SettingService.getApplicationPropertiesValue('ISOUTPUTPREFERENCESREQ') == 'YES' ? true : false;
  }
  ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
  }
}
