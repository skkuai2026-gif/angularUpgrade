import { Component, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { CSASLGFIService } from '../service/csa-slgfi-service.service';
import { NavigationLink } from 'src/app/models/common/navigation-link';
import { FnaSLGFIDataComponent } from '../fna-slgfi-data/fna-slgfi-data.component';

@Component({
  selector: 'sym-fna-slgfi-data-api',
  templateUrl: './fna-slgfi-data-api.component.html',
  styleUrls: ['./fna-slgfi-data-api.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class FnaSLGFIDataAPIComponent extends FnaSLGFIDataComponent {
  constructor(csaService: CSASLGFIService) {
    super(csaService);
  }

  protected loadNavigationLinkList() {
    this.navigationLinkList = [];
  }
}
