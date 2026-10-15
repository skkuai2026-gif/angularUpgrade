import { Component, Input, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { QuotationService } from '../services/quotation.service';
import { HeaderService } from 'src/app/system-common/services/header.service';
import { Router } from '@angular/router';
import { BaseSearchComponent } from 'src/app/system-common/base-search/base-search.component';
import { SearchResponseIO } from 'src/app/models/search-responseIO';

@Component({
  selector: 'sym-link-search-insured',
  templateUrl: './link-search-insured.component.html',
  styleUrls: ['./link-search-insured.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class LinkSearchInsuredComponent extends BaseSearchComponent<QuotationService> implements OnInit {
  isAdvanceSearchDisplayed: boolean;
  isAdvanceSearchRequired: boolean;
  isAdvanceSearchVisibile: boolean;
  @Input() firstName: any;
  @Input() lastName: any;
  isAdvanceSearchDialogVisible: boolean;
  constructor(public service: QuotationService, public headerService: HeaderService, public router: Router) {
    super(service, router, headerService);
  }
  ngOnInit() {
    this.isAdvanceSearchDisplayed = false;
    this.isAdvanceSearchVisibile = false;
    this.isAdvanceSearchDialogVisible = false;
    this.isAdvanceSearchRequired = true;
  }
}
