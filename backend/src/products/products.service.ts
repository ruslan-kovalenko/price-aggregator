import { Injectable } from '@nestjs/common';
import { AtbService } from 'src/scrapers/atb/atb.service';
import { MaudauService } from 'src/scrapers/maudau/maudau.service';
import { SilpoService } from 'src/scrapers/silpo/silpo.service';
import { VarusService } from 'src/scrapers/varus/varus.service';

@Injectable()
export class ProductsService {
  constructor(
    private readonly maudauService: MaudauService,
    private readonly silpoService: SilpoService,
    private readonly varusService: VarusService,
    private readonly atbService: AtbService,
  ) {}

  async getGeneralPrices(input: string) {
    return await Promise.all([
      this.varusService.getCategories(input),
      this.maudauService.getProducts(input),
      this.silpoService.getProducts(input),
      this.atbService.getProducts(input),
    ]);
  }
}
