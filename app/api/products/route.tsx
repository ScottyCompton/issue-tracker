import { NextRequest, NextResponse } from "next/server";
import schema from "./schema";
import { prisma } from "@/prisma/client";


export interface Product {
    id: number | string
    name: string
    price: number
}

export const products = [
    { id: 1, name: 'Milk', price: 4.99 },
    { id: 2, name: 'Eggs', price: 3.70 },
    { id: 3, name: 'Bread', price: 2.99 },
]

export async function GET(request: NextRequest) {
    // get all products from the database
    const products = await prisma.product.findMany()
    return NextResponse.json(products)
}

export async function POST(request: NextRequest) {
    // create a new product in the database
    const body = await request.json()
    const validation = schema.safeParse(body)

    if(!validation.success) {
        return NextResponse.json({ error: validation.error.errors }, { status: 400 })
    }

    const product = await prisma.product.findFirst({
        where: {
            name: body.name,
            price: body.price
        }
    })
    
    if(product) {
        return NextResponse.json({ error: 'Product already exists' }, { status: 400 })
    }

    const newProduct = await prisma.product.create({
        data: {
            name: body.name,
            price: body.price
        }
    })

    return NextResponse.json(newProduct)
}
