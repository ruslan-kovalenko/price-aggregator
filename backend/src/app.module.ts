import { Module } from '@nestjs/common';
import { ProductsModule } from './products/products.module';
import { MaudauModule } from './scrapers/maudau/maudau.module';
import { ConfigModule } from '@nestjs/config';
import { SilpoModule } from './scrapers/silpo/silpo.module';

@Module({
  imports: [
    ProductsModule,
    MaudauModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SilpoModule,
  ],
})
export class AppModule {}
