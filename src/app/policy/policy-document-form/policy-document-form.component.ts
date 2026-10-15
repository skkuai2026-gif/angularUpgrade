import { Component, Input, OnInit, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { PolicyDocumentFormHandler } from './policy-document-form.component.handler';
import { PolicyService } from '../services/policy.service';

@Component({
  selector: 'sym-policy-document-form',
  templateUrl: './policy-document-form.component.html',
  styleUrls: ['./policy-document-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class PolicyDocumentFormComponent extends PolicyDocumentFormHandler implements OnInit {
  /**
   * This input property takes a string value that specifies the feature to be used to hide/show the download button.
   */
  @Input() agentDownloadFeature: string;
  public showEformButtons: boolean;

  constructor(policyService: PolicyService) {
    super(policyService);
    this.showEformButtons =
      this.service.getApplicationPropertyValue('ENVIRONMENTTYPE') != undefined
        ? this.service.getApplicationPropertyValue('ENVIRONMENTTYPE') == 'DEVELOPMENT'
          ? true
          : false
        : false;
  }

  ngOnInit() {
    super.ngOnInit();
  }

  ngOnChanges(changes: SimpleChanges): void {
    super.ngOnChanges(changes);
  }
}
