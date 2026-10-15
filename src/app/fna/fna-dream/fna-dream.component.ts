import { Component, Input, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FnaService } from '../service/fna-service.service';
import { SettingService } from 'src/app/system-common/services/setting.service';
import { BaseComponent } from 'src/app/system-common/base/base.component';

@Component({
  selector: 'sym-fna-dream',
  templateUrl: './fna-dream.component.html',
  styleUrls: ['../assets/css/fna.css', './fna-dream.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class FnaDreamComponent extends BaseComponent<FnaService> implements OnInit {
  // @Input() selectedTab: string;
  constructor(public service: FnaService, public settingService: SettingService) {
    super(service);
  }

  ngOnInit() {}
  onInputChanged(event) {
    // this.service.fnaStepQuestionnaire[this.selectedTab][event.target.value] = event.target.checked;
    // console.log(this.service.fnaStepQuestionnaire);
  }
}
