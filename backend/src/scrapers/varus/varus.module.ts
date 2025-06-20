import { forwardRef, Module } from '@nestjs/common';
import { VarusService } from './varus.service';
import { VarusScraper } from './varus.scraper';
import { ProductsModule } from 'src/products/products.module';

@Module({
  imports: [forwardRef(() => ProductsModule)],
  providers: [VarusService, VarusScraper],
  exports: [VarusService, VarusScraper],
})
export class VarusModule {}
