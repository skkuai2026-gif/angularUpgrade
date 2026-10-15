import { SettingService } from './../../system-common/services/setting.service';
import { PolicyService } from './../services/policy.service';
import { Component, OnInit, OnChanges, SimpleChanges, Input, ChangeDetectionStrategy } from '@angular/core';
import { PayerPartyHandlerComponent } from './payer-party.handler';

@Component({
  selector: 'sym-payer-party',
  templateUrl: './payer-party.component.html',
  styleUrls: ['./payer-party.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class PayerPartyComponent extends PayerPartyHandlerComponent implements OnChanges, OnInit {
  @Input() modelPath: string;
  @Input() responseUpdated: boolean;
  respPartyRoleList: any;

  constructor(policyService: PolicyService, public settingService: SettingService) {
    super(policyService, settingService);
    //console.log(this.service.responseIO);
  }

  ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
  }

  ngOnInit(): void {
    super.ngOnInit();
  }
}
