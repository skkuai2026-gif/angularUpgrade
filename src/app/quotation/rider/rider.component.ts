import {
  Component,
  OnInit,
  OnChanges,
  SimpleChanges,
  Input,
  Output,
  ChangeDetectionStrategy,
} from '@angular/core';
import { QuotationService } from '../services/quotation.service';
import { RiderHandlerComponent } from './rider.handler';

@Component({
  selector: 'sym-rider',
  templateUrl: './rider.component.html',
  styleUrls: ['./rider.component.css'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class RiderComponent extends RiderHandlerComponent {
  @Input() responseUpdated: boolean;
  constructor(quotationService: QuotationService) {
    super(quotationService);
  }
}
