import { Component, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { LeadBasicHandlerComponent } from './lead-basic.handler';
import { LeadService } from '../services/lead.service';
import { Router } from '@angular/router';

@Component({
  selector: 'sym-lead-basic',
  templateUrl: './lead-basic.component.html',
  styleUrls: ['./lead-basic.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class LeadBasicComponent extends LeadBasicHandlerComponent {
  router: Router;
  searchCriteriaData: any;
  searchCriteriaforProposal: any;
  searchCriteriaforPolicy: any;
  constructor(leadService: LeadService) {
    super(leadService);
    this.searchCriteriaData = {
      'SearchFNARquestDO.leadId': this.service.responseIO.data.Entity.leadId,
    };
    this.searchCriteriaforProposal = {
      'SearchProspectDO.leadId': this.service.responseIO.data.Entity.leadId,
    };
    this.searchCriteriaforPolicy = {
      'SearchPolicyDO.leadId': this.service.responseIO.data.Entity.leadId,
    };
  }
  ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
  }
  public onCSALinkSISearchSelected(selectedOption) {
    console.log('on csa link si search seleected' + this.service.responseIO.data.Entity.id);
    this.router.navigate(['csa/' + this.service.responseIO.data.Entity.id]);
    // this.service.setModelFieldValue(
    //   this.service.responseIO.data.Entity,
    //   'addtnField2Str',
    //   selectedOption['quotationRefNum']
    // );
    // setTimeout(() => {
    //   this.linkSI();
    // }, 5);
  }
  // onPopUpClose() {
  //   this.closeModal('viewCSAList');
  // }
  ngOnDestroy(): void {
    this.closeModal('viewCSAList');
  }
}
