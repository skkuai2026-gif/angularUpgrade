import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { BaseComponent } from 'src/app/system-common/base/base.component';
import { PolicyService } from '../services/policy.service';
import { StepItem } from 'src/app/models/common/step-item';

@Component({
  selector: 'sym-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class TestComponent extends BaseComponent<PolicyService> implements OnInit {
  subStepList: StepItem[];
  selectedSubStep: StepItem;
  constructor(public policyService: PolicyService) {
    super(policyService);
    this.subStepList = this.getSubStepList();
    // console.log(this.selectedSubStep);
  }

  ngOnInit() {}

  protected getSubStepList(): StepItem[] {
    let stepList = [
      new StepItem(0, 'INSUREDPARTY'),
      new StepItem(1, 'PROPOSER', undefined, undefined, false),
      new StepItem(2, 'Contingent', undefined, undefined, true),
      new StepItem(3, 'consultant'),
      new StepItem(4, 'PROPOSER1', undefined, undefined, false),
      new StepItem(5, 'Contingent1'),
      new StepItem(6, 'consultant1'),
      new StepItem(7, 'PROPOSER2', undefined, undefined, false),
      new StepItem(8, 'Contingent2'),
      new StepItem(9, 'consultant2'),
      new StepItem(10, 'PROPOSER2', undefined, undefined, false),
      new StepItem(11, 'Contingent2'),
      new StepItem(12, 'consultant2'),
    ];
    return stepList;
  }

  onSelectedSubStep(step: StepItem) {
    this.selectedSubStep = step;
  }
}
