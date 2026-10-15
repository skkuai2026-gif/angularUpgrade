import { Component, Input, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FnaService } from '../service/fna-service.service';
import { SettingService } from 'src/app/system-common/services/setting.service';
import { BaseComponent } from 'src/app/system-common/base/base.component';

@Component({
  selector: 'sym-fna-risk-profile',
  templateUrl: './fna-risk-profile.component.html',
  styleUrls: ['../assets/css/fna.css', './fna-risk-profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class FnaRiskProfileComponent extends BaseComponent<FnaService> implements OnInit {
  // @Input() selectedTab: string;
  constructor(public service: FnaService, public settingService: SettingService) {
    super(service);
  }

  ngOnInit() {}
}
