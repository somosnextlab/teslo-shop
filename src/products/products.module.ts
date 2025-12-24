import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Product, ProductImage } from './entities';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService],
  imports: [
    // de esta manera importamos la entity de producto creada
    TypeOrmModule.forFeature([Product, ProductImage])
  ]
})
export class ProductsModule {}
