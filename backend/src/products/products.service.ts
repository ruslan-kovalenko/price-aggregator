import { Injectable } from '@nestjs/common';
import { MaudauService } from 'src/scrapers/maudau/maudau.service';
import { SilpoService } from 'src/scrapers/silpo/silpo.service';

@Injectable()
export class ProductsService {
  constructor(
    private readonly maudauService: MaudauService,
    private readonly silpoService: SilpoService,
  ) {}

  async getGeneralPrices(input: string) {
    return await this.maudauService.getProducts(input);
    // return await this.silpoService.getProducts(input);
  }
}
