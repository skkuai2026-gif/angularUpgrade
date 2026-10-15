import { Component, Input, OnChanges, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { BaseComponent } from 'src/app/system-common/base/base.component';
import { LeadService } from '../services/lead.service';
@Component({
  selector: '',
  template: '',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class LeadPartyOtherIncomeHandlerComponent extends BaseComponent<LeadService> implements OnChanges {
  public partyModel: any;
  public model: any;
  constructor(leadService: LeadService) {
    super(leadService);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.model != undefined) {
      this.partyModel = this.model;
    }
    super.ngOnChanges(changes);
  }
  public onAddPartyOtherIncome(event) {
    this.service.addPartyOtherIncome(this.partyModel);
  }
}
