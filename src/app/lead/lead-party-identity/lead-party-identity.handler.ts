import { Component, Input, OnInit, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { BaseComponent } from 'src/app/system-common/base/base.component';
import { LeadService } from '../services/lead.service';
@Component({
  selector: '',
  template: '',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class LeadPartyIdentityHandlerComponent extends BaseComponent<LeadService> {
  public partyModel: any;
  public model: any;
  constructor(leadService: LeadService) {
    super(leadService);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.model != undefined) {
      this.partyModel = this.model;
    }
  }

  public onAddPartyIdentity(event) {
    this.service.addPartyIdentity(this.partyModel);
  }
}
