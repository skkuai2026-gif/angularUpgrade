import { Component, Input, OnChanges, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { LeadService } from '../services/lead.service';
import { LeadPartyNationalityDetailHandlerComponent } from './lead-party-nationality-detail.handler';

@Component({
  selector: 'sym-lead-party-nationality-detail',
  templateUrl: './lead-party-nationality-detail.component.html',
  styleUrls: ['./lead-party-nationality-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class LeadPartyNationalityDetailComponent extends LeadPartyNationalityDetailHandlerComponent {
  @Input() model: any;
  constructor(leadService: LeadService) {
    super(leadService);
  }
}
