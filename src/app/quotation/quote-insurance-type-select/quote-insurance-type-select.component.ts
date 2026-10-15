import { HeaderService } from 'src/app/system-common/services/header.service';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { QuoteInsuranceTypeSelectHandlerComponent } from './quote-insurance-type-select.handler';
import { SettingService } from 'src/app/system-common/services/setting.service';

@Component({
  selector: 'sym-quote-insurance-type-select',
  templateUrl: './quote-insurance-type-select.component.html',
  styleUrls: ['./quote-insurance-type-select.component.css'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class QuoteInsuranceTypeSelectComponent extends QuoteInsuranceTypeSelectHandlerComponent {
  constructor(public headerService: HeaderService, public settingService: SettingService) {
    super(headerService, settingService);
  }
}
