import { Component, OnInit, Input, OnChanges, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { ResponseIO } from 'src/app/models/responseIO';
import { BaseComponent } from 'src/app/system-common/base/base.component';
import { QuotationService } from '../services/quotation.service';
@Component({
  selector: '',
  template: '',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class OutputPreferencesHandlerComponent extends BaseComponent<QuotationService> implements OnChanges {
  constructor(quotationService: QuotationService) {
    super(quotationService);
  }
  model: any;
  ngOnInit(): void {
    //console.log('ngOnInit');
  }
  ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
    //console.log('ngOnChanges');
  }
}
