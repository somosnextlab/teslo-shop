// Esto representa lo que hay en la base de datos, como una tabla

import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Product {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    // con este decorador vamos creando nuevas columnas
    @Column('text', {
        //con esa regla establecemos que no se repita el nombre
        //de producto en este caso.
        unique: true
    })
    title: string;

    @Column('float', {
        default: 0
    })
    price: number;

    @Column({
        type: 'text',
        // puede aceptar nulos
        nullable: true
    })
    description: string;

    @Column('text', {
        unique: true
    })
    slug: string;

    @Column('int', {
        default: 0
    })
    stock: number;

    @Column('text', {
        array: true
    })
    sizes: string[];

    @Column('text')
    gender: string;

    //tags

    //images

    //Antes de guardar en la DB
    @BeforeInsert()
    checkSlugInstert() {
        if ( !this.slug ) {
            this.slug = this.title
        }
        
        this.slug = this.slug
            .toLowerCase()
            .replaceAll(' ', '_')
            .replaceAll("'", '')
    }
}
