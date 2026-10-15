import { Component, Input, OnChanges, OnInit, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { CSASLGFIService } from '../service/csa-slgfi-service.service';
import { SettingService } from 'src/app/system-common/services/setting.service';
import { BaseComponent } from 'src/app/system-common/base/base.component';
import { FieldItem } from 'src/app/models/common/field-item';
import { NavigationLink } from 'src/app/models/common/navigation-link';

@Component({
  selector: 'sym-fna-personal-details',
  templateUrl: './fna-personal-details.component.html',
  styleUrls: ['./fna-personal-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class FnaPersonalDetailsComponent extends BaseComponent<CSASLGFIService> implements OnChanges {
  navigationLinkList: NavigationLink[];
  public model: any;
  searchCriteriaforProposal: any;
  constructor(csaService: CSASLGFIService) {
    super(csaService);
  }
  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
  }
}
