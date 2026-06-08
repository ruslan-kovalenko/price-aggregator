import { forwardRef, Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { MaudauModule } from 'src/scrapers/maudau/maudau.module';
import { SilpoModule } from 'src/scrapers/silpo/silpo.module';
import { VarusModule } from 'src/scrapers/varus/varus.module';
import { AtbModule } from 'src/scrapers/atb/atb.module';

@Module({
  imports: [
    forwardRef(() => MaudauModule),
    forwardRef(() => SilpoModule),
    forwardRef(() => VarusModule),
    forwardRef(() => AtbModule),
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}
