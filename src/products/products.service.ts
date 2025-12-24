import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { PaginationDto } from 'src/common/dtos/pagination.dto';

import { validate as isUUID } from 'uuid';
import { Product, ProductImage } from './entities';

@Injectable()
export class ProductsService {

  private readonly logger = new Logger('ProductsService');

  // Patron repositorio, interactua con al base de datos
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,

  ) { }


  async create(createProductDto: CreateProductDto) {

    const { images = [], ...productDetails} = createProductDto

    try {
      const producto = this.productRepository.create({
        ...productDetails,
        images: images.map( image => this.productImageRepository.create({ url: image}) )
      });
      await this.productRepository.save(producto);

      return { ...producto, images: images };

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

  async update(id: string, updateProductDto: UpdateProductDto) {
    const product = await this.productRepository.preload({
      id: id,
      ...updateProductDto,
      images: []
    })

    if (!product) throw new NotFoundException(`Product with id ${id} not found`)

    try {
      const productToSave = await this.productRepository.save(product);
      return productToSave;
    } catch (error) {
      this.handleDBExceptions(error)
    }
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
