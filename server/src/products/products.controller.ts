import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto'; // <--- IMPORTAR

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    // ESTO IMPRIMIRÁ EN LA TERMINAL NEGRA LO QUE LLEGA DEL FRONTEND
    console.log('📦 BODY RECIBIDO DEL FRONTEND:', createProductDto);
    console.log(
      '💰 Tipo de dato precio:',
      typeof createProductDto.price,
      createProductDto.price,
    );

    return this.productsService.create(createProductDto);
  }

  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  // --- MÉTODO UNIFICADO INTELIGENTE ---
  // Acepta 'term', que puede ser ID (123) o Slug (hamburguesa-especial)
  @Get(':term')
  async findOne(@Param('term') term: string) {
    // Verificamos si es un número
    const isNumeric = !isNaN(Number(term));

    if (isNumeric) {
      // Es un ID numérico
      return this.productsService.findOne(+term);
    } else {
      // Es un texto (Slug)
      return this.productsService.findOneBySlug(term);
    }
  }

  // Borré el resto de @Get(':id') individuales para evitar conflictos.

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: any) {
    return this.productsService.update(+id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }
}
