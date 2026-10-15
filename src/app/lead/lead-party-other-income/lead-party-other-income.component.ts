import { Component, Input, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { LeadService } from '../services/lead.service';
import { LeadPartyOtherIncomeHandlerComponent } from './lead-party-other-income.handler';

@Component({
  selector: 'sym-lead-party-other-income',
  templateUrl: './lead-party-other-income.component.html',
  styleUrls: ['./lead-party-other-income.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class LeadPartyOtherIncomeComponent extends LeadPartyOtherIncomeHandlerComponent {
  @Input() partyModel: any;
  @Input() model: any;
  constructor(leadService: LeadService) {
    super(leadService);
  }
}
