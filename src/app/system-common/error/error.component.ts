import { ResponseIO } from './../../models/responseIO';
import { Component, OnInit, Input, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'sym-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.css'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class ErrorComponent {
  @Input() responseIO: ResponseIO;
  @Input() fieldCd: string;
  @Input() model: any;
  @Input() iconOnly: boolean;
  errorMesg: string;
  constructor() {
    this.iconOnly = false;
    this.errorMesg = undefined;
  }

  ngOnChanges(changes: SimpleChanges) {
    for (let tabname in this.responseIO.validationerrors) {
      if (
        this.responseIO.validationerrors[tabname] != undefined &&
        this.responseIO.validationerrors[tabname][this.model.guid] != undefined &&
        this.responseIO.validationerrors[tabname][this.model.guid][this.fieldCd] != undefined
      ) {
        this.errorMesg = this.responseIO.validationerrors[tabname][this.model.guid][this.fieldCd];
        if (this.errorMesg.includes(';')) {
          this.errorMesg.replace(';', '<br/>');
        }
        break;
      }
    }
  }
}
