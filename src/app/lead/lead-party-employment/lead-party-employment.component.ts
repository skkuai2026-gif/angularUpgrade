import { Component, Input, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { LeadService } from '../services/lead.service';
import { LeadPartyEmploymentHandlerComponent } from './lead-party-employment.handler';

@Component({
  selector: 'sym-lead-party-employment',
  templateUrl: './lead-party-employment.component.html',
  styleUrls: ['./lead-party-employment.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class LeadPartyEmploymentComponent extends LeadPartyEmploymentHandlerComponent {
  @Input() model: any;
  constructor(leadService: LeadService) {
    super(leadService);
  }
  ngOnChanges(changes: SimpleChanges): void {
    super.ngOnChanges(changes);
  }
}
