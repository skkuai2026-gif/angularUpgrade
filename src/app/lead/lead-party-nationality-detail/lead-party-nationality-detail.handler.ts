import { Component, OnChanges, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { BaseComponent } from 'src/app/system-common/base/base.component';
import { LeadService } from '../services/lead.service';
@Component({
  selector: '',
  template: '',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class LeadPartyNationalityDetailHandlerComponent extends BaseComponent<LeadService> implements OnChanges {
  public model: any;
  constructor(leadService: LeadService) {
    super(leadService);
  }

  ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
  }
}
