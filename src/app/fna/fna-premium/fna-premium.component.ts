import { Component, Input, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FnaService } from '../service/fna-service.service';
import { SettingService } from 'src/app/system-common/services/setting.service';
import { BaseComponent } from 'src/app/system-common/base/base.component';

@Component({
  selector: 'sym-fna-premium',
  templateUrl: './fna-premium.component.html',
  styleUrls: ['../assets/css/fna.css', './fna-premium.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class FnaPremiumComponent extends BaseComponent<FnaService> implements OnInit {
  // @Input() selectedTab: string;
  card1: boolean;
  card2: boolean;
  card3: boolean;
  card4: boolean;
  card5: boolean;
  constructor(public service: FnaService, public settingService: SettingService) {
    super(service);
    this.card1 = true;
    this.card2 = true;
    this.card3 = true;
    this.card4 = true;
    this.card5 = true;
  }

  ngOnInit() {}
}
