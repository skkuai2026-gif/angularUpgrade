import { Component, OnChanges, OnInit, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { CSAService } from 'src/app/csa/service/csa-service.service';
import { FieldItem } from 'src/app/models/common/field-item';
import { BaseComponent } from 'src/app/system-common/base/base.component';

@Component({
  selector: 'sym-csa-slgfi-fund-list',
  templateUrl: './csa-slgfi-fund-list.component.html',
  styleUrls: ['./csa-slgfi-fund-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class CSASLGFIFundListComponent extends BaseComponent<CSAService> implements OnChanges {
  constructor(csaService: CSAService) {
    super(csaService);
  }
  ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
  }
}
