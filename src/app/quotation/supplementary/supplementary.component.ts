import { TabItem } from 'src/app/models/common/tab-items';
import { Component, Input, OnInit, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { FieldItem } from 'src/app/models/common/field-item';
import { BaseComponent } from 'src/app/system-common/base/base.component';
import { QuotationService } from '../services/quotation.service';
import { SupplementaryHandlerComponent } from './supplementary.handler';
@Component({
  selector: 'sym-supplementary',
  templateUrl: './supplementary.component.html',
  styleUrls: ['./supplementary.component.css'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class SupplementaryComponent extends SupplementaryHandlerComponent {
  @Input() responseUpdated: boolean;
  constructor(quotationService: QuotationService) {
    super(quotationService);
  }
}
