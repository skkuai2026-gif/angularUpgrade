import { Component, OnInit, Input, OnChanges, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { ResponseIO } from 'src/app/models/responseIO';
import { BaseComponent } from 'src/app/system-common/base/base.component';
import { QuotationService } from '../services/quotation.service';
import { OutputPreferencesHandlerComponent } from './output-preferences.handler';

@Component({
  selector: 'sym-output-preferences',
  templateUrl: './output-preferences.component.html',
  styleUrls: ['./output-preferences.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class OutputPreferencesComponent extends OutputPreferencesHandlerComponent {
  @Input() displayLeft: boolean;
  //New
  @Input() prefix: string;
  @Input() model: any;
  constructor(quotationService: QuotationService) {
    super(quotationService);
    this.displayLeft = false;
    this.prefix = undefined;
  }
  ngOnInit(): void {
    super.ngOnInit();
  }

  ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
    if (changes['displayLeft'] && changes['displayLeft'].currentValue) {
    }
  }
}
