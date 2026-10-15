import { Component, OnInit, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { BaseComponent } from 'src/app/system-common/base/base.component';
import { QuotationService } from '../services/quotation.service';
@Component({
  selector: '',
  template: '',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class PlanExtraListHandlerComponent extends BaseComponent<QuotationService> implements OnInit {
  constructor(quotationService: QuotationService) {
    super(quotationService);
  }

  ngOnInit() {}
  ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
  }
}
