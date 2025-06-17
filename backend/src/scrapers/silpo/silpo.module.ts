import { forwardRef, Module } from '@nestjs/common';
import { SilpoService } from './silpo.service';
import { SilpoScraper } from './silpo.scraper';
import { ProductsModule } from 'src/products/products.module';

@Module({
  imports: [forwardRef(() => ProductsModule)],
  providers: [SilpoService, SilpoScraper],
  exports: [SilpoService, SilpoScraper],
})
export class SilpoModule {}
