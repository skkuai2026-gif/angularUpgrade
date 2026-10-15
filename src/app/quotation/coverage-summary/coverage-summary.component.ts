import { Component, ChangeDetectionStrategy } from '@angular/core';
import { SettingService } from 'src/app/system-common/services/setting.service';
import { QuotationService } from '../services/quotation.service';
import { CoverageSummaryHandlerComponent } from './coverage-summary.handler';

@Component({
  selector: 'sym-coverage-summary',
  templateUrl: './coverage-summary.component.html',
  styleUrls: ['./coverage-summary.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class CoverageSummaryComponent extends CoverageSummaryHandlerComponent {
  constructor(quotationService: QuotationService, public settingService: SettingService) {
    super(quotationService, settingService);
  }
}
