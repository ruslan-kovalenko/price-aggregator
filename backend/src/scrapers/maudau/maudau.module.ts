import { forwardRef, Module } from '@nestjs/common';
import { MaudauService } from './maudau.service';
import { MaudauScraper } from './maudau.scraper';
import { ProductsModule } from 'src/products/products.module';

@Module({
  imports: [forwardRef(() => ProductsModule)],
  providers: [MaudauService, MaudauScraper],
  exports: [MaudauService, MaudauScraper],
})
export class MaudauModule {}
