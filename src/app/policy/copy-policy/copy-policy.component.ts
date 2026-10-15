import { Component, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { PolicyService } from '../services/policy.service';
import { CopyPolicyHandlerComponent } from './copy-policy.handler';
import { SettingService } from 'src/app/system-common/services/setting.service';

@Component({
  selector: 'sym-copy-policy',
  templateUrl: './copy-policy.component.html',
  styleUrls: ['./copy-policy.component.scss'],
  providers: [PolicyService],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class CopyPolicyComponent extends CopyPolicyHandlerComponent {
  constructor(public service: PolicyService, public router: Router, public settingService: SettingService) {
    super(service, router);
  }

  ngOnInit() {
    super.ngOnInit();
  }

  ngOnChanges(changes: SimpleChanges): void {
    super.ngOnChanges(changes);
  }

  protected getPersonalData(model: any) {
    const partySameAsCd = model['partySameAsCd'];
    if (partySameAsCd === 'OTHER' || partySameAsCd == undefined || partySameAsCd == '') {
      const parts = [
        this.getFieldData(model, 'quotPartyAddtnField3'),
        // this.getFieldData(model, 'genderCd'),
        // this.getFieldData(model, 'birthDt'),
      ].filter((part) => part !== null && part !== undefined && part != '');
      return parts.join(', ');
    } else if (partySameAsCd != undefined) {
      return `Same as ${this.getFieldData(model, 'partySameAsCd')}`;
    } else {
      return '';
    }
  }
}
