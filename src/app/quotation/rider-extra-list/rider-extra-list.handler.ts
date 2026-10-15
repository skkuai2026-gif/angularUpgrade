import { Component, OnInit, Input, SimpleChange, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { QuotationService } from '../services/quotation.service';
import { BaseComponent } from 'src/app/system-common/base/base.component';
@Component({
  selector: '',
  template: '',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class RiderExtraListHandlerComponent extends BaseComponent<QuotationService> implements OnInit {
  constructor(quotationService: QuotationService) {
    super(quotationService);
  }

  ngOnInit() {}
  ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
    if (changes['modelPath'] && changes['modelPath'].currentValue) {
    }
  }
}
