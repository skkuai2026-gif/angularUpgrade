import { Component, OnInit, Input, OnChanges, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { BaseComponent } from 'src/app/system-common/base/base.component';
import { QuotationService } from '../services/quotation.service';
import { FieldItem } from 'src/app/models/common/field-item';
@Component({
  selector: '',
  template: '',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class BasicDetailHandlerComponent extends BaseComponent<QuotationService> implements OnChanges {
  isAgentSearchOpened: boolean;
  constructor(quotationService: QuotationService) {
    super(quotationService);
    this.isAgentSearchOpened = false;
  }
  ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
  }

  public onAgentSearchClick(field: FieldItem) {
    this.isAgentSearchOpened = false;
    setTimeout(() => {
      this.isAgentSearchOpened = true;
      this.openModal('AgentSearch');
    }, 20);
  }

  onAgentSearchSelected(selectedOption) {
    this.service.setModelFieldValue(this.service.responseIO.data.Entity, 'agentId', selectedOption.agentId);
    this.service.setModelFieldValue(this.service.responseIO.data.Entity, 'agentName', selectedOption.agentName1);
  }
}
