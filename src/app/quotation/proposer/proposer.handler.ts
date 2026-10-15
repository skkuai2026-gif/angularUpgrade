import { QuotationPartyComponent } from '../quotation-party/quotation-party.component';
import { FieldItem } from '../../models/common/field-item';

export class ProposerHandlerComponent extends QuotationPartyComponent {
  public proposerLASame_change(item: FieldItem) {
    if (item.model[item.fieldCd] == 'NO') {
      //Clearing party details on the basis of facet.
      let partyModel = this.service.responseIO.data['PrimaryInsured'];
      if (
        this.service.companyFacets.data['PROPOSERCOPIEDFROMLA_AGENT'] &&
        this.service.companyFacets.data['PROPOSERCOPIEDFROMLA_AGENT'] == 'YES'
      )
        partyModel = this.service.responseIO.data['Proposer'];
      this.service.clearPartyDetails(partyModel);
    }
  }
}
