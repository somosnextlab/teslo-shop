import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot()
    ,

    TypeOrmModule.forRoot({
      // tipo de base de datos para conectarse
      type: 'postgres',
      // lo que tenemos en las variables de entorno
      host: process.env.DB_HOST,
      // puerto por defecto
      port: +process.env.DB_PORT!,
      // database name
      database: process.env.DB_NAME,
      // usuario y clave de la base de datos
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,

      // propiedades: synchronize en desarrollo, no en produccion. 
      // autoLoadEntities carga automaticamente las entidades
      autoLoadEntities: true,
      synchronize: true
    })
  ],
})
export class AppModule {}
