import { forwardRef, Module } from '@nestjs/common';
import { AtbService } from './atb.service';
import { ProductsModule } from 'src/products/products.module';
import { AtbScraper } from './atb.scraper';

@Module({
  imports: [forwardRef(() => ProductsModule)],
  providers: [AtbService, AtbScraper],
  exports: [AtbService, AtbScraper],
})
export class AtbModule {}
