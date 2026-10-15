import { NavigationLink } from './../../models/common/navigation-link';
import { Component, OnChanges, OnInit, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { PolicyService } from '../services/policy.service';
import { PolicyBasicDetailHandlerComponent } from './policy-basic-detail.handler';
import { FieldItem } from 'src/app/models/common/field-item';

@Component({
  selector: 'sym-policy-basic-detail',
  templateUrl: './policy-basic-detail.component.html',
  styleUrls: ['./policy-basic-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class PolicyBasicDetailComponent extends PolicyBasicDetailHandlerComponent implements OnChanges {
  navigationLinkList: NavigationLink[];
  constructor(policyService: PolicyService) {
    super(policyService);
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

  ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
  }
  public visitPurposeCd_change(item: FieldItem) {
    this.service.setModelFieldValue(this.service.responseIO.data.Entity, 'otherPurposeOfInsurance', null);
    this.service.setModelFieldValue(this.service.responseIO.data.Entity, 'leadGenerationCd', null);
  }
}
