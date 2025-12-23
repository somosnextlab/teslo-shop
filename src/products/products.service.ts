import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Product } from './entities/product.entity';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

import { validate as isUUID } from 'uuid';

@Injectable()
export class ProductsService {

  private readonly logger = new Logger('ProductsService');

  // Patron repositorio, interactua con al base de datos
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

  ) { }


  async create(createProductDto: CreateProductDto) {

    try {
      const producto = this.productRepository.create(createProductDto);
      await this.productRepository.save(producto);

      return producto;

    } catch (error) {
      this.handleDBExceptions(error)
    }

  }

  //TODO: Paginar
  findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 5 } = paginationDto

    const product = this.productRepository.find({
      take: limit,
      skip: offset,
      // TODO: relaciones
    })

    return product;
  }


  async findOne(term: string) {

    let product: Product | null = null;

    if (isUUID(term)) {
      product = await this.productRepository.findOneBy({ id: term });
    } else {
      //product = await this.productRepository.findOneBy({ slug: term })
      //Creacion de query builder
      const queryBuilder = this.productRepository.createQueryBuilder();
      product = await queryBuilder.where(`UPPER(title) =:title or slug =:slug`, {
        title: term.toUpperCase(),
        slug: term.toLowerCase(),
      }).getOne();

    }

    if (!product) {
      throw new NotFoundException(`Product with ${term} not found`)
    }
    return product;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  async remove(id: string) {
    const product = await this.findOne(id)
    await this.productRepository.remove(product)
  }

  private handleDBExceptions(error: any) {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail)
    }
    this.logger.error(error)
    throw new InternalServerErrorException('Unexpected error, check server logs')
  }
}
