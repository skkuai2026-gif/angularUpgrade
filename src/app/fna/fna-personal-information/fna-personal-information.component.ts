import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { SettingService } from 'src/app/system-common/services/setting.service';
import { FnaService } from '../service/fna-service.service';
import { BaseComponent } from 'src/app/system-common/base/base.component';

@Component({
  selector: 'sym-fna-personal-information',
  templateUrl: './fna-personal-information.component.html',
  styleUrls: ['../assets/css/fna.css', './fna-personal-information.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class FnaPersonalInformationComponent extends BaseComponent<FnaService> implements OnInit {
  constructor(public service: FnaService, public settingService: SettingService) {
    super(service);
  }

  ngOnInit() {}
}
