import { Module } from '@nestjs/common';
import { ProductsModule } from './products/products.module';
import { MaudauModule } from './scrapers/maudau/maudau.module';
import { ConfigModule } from '@nestjs/config';
import { SilpoModule } from './scrapers/silpo/silpo.module';
import { VarusModule } from './scrapers/varus/varus.module';
import { AtbModule } from './scrapers/atb/atb.module';

@Module({
  imports: [
    ProductsModule,
    MaudauModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SilpoModule,
    VarusModule,
    AtbModule,
  ],
})
export class AppModule {}
