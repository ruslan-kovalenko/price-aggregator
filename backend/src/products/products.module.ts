import { forwardRef, Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { PaginatedScraperRunner } from './paginated-scraper-runner/paginated-scraper.runner';
import { MaudauModule } from 'src/scrapers/maudau/maudau.module';
import { SilpoModule } from 'src/scrapers/silpo/silpo.module';

@Module({
  imports: [forwardRef(() => MaudauModule), forwardRef(() => SilpoModule)],
  controllers: [ProductsController],
  providers: [ProductsService, PaginatedScraperRunner],
  exports: [ProductsService, PaginatedScraperRunner],
})
export class ProductsModule {}
