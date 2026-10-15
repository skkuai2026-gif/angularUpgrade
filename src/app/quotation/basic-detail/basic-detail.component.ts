import { Component, ChangeDetectionStrategy } from '@angular/core';
import { QuotationService } from '../services/quotation.service';
import { BasicDetailHandlerComponent } from './basic-detail.handler';

@Component({
  selector: 'sym-basic-detail',
  templateUrl: './basic-detail.component.html',
  styleUrls: ['./basic-detail.component.css'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class BasicDetailComponent extends BasicDetailHandlerComponent {
  constructor(quotationService: QuotationService) {
    super(quotationService);
  }
}
