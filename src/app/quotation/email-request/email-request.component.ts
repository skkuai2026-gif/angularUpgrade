import { BaseComponent } from 'src/app/system-common/base/base.component';
import { QuotationService } from './../services/quotation.service';
import { Component, OnInit, SimpleChanges, OnChanges, ChangeDetectionStrategy } from '@angular/core';
import { EmailRequestHandlerComponent } from './email-request.handler';

@Component({
  selector: 'sym-email-request',
  templateUrl: './email-request.component.html',
  styleUrls: ['./email-request.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class EmailRequestComponent extends EmailRequestHandlerComponent {
  emailAddress: string = '';
  toEmail: string = '';
  constructor(quotationService: QuotationService) {
    super(quotationService);
  }
  setToEmail() {
    this.toEmail = this.emailAddress;
  }
}
