import { NextRequest, NextResponse } from "next/server"
import { Product } from "../route"
import schema from "../schema"
import { prisma } from "@/prisma/client"


interface Props {
    params: Promise<{
        id: string
    }>
}

export async function GET(request: NextRequest, { params }: Props) {
    // get a product from the database
    const { id } = await params

    const product = await prisma.product.findUnique({
        where: {
            id: parseInt(id)
        }
    })

    if(!product) {
        return NextResponse.json({ error: `Product with id ${id} not found` }, { status: 404 })
    }

    return NextResponse.json(product)
}

export async function PUT(request: NextRequest, { params }:  Props) {
    // update a product in the database
    const body = await request.json()
    const { id } = await params

    const validation = schema.safeParse(body)

    if(!validation.success) {
        return NextResponse.json({ error: validation.error.errors }, { status: 400 })
    }

    const product = await prisma.product.findUnique({
        where: {
            id: parseInt(id)
        }
    })

    if(!product) {
        return NextResponse.json({ error: `Product with id ${id} not found` }, { status: 404 })
    }

    const updatedProduct = await prisma.product.update({
        where: {
            id: product.id
        },
        data: {
            name: body.name,
            price: body.price
        }
    })


    return NextResponse.json(updatedProduct)
}

export async function DELETE(request: NextRequest, { params }: Props ) {
    // delete a product from the database
    const { id } = await params

    const product = await prisma.product.findUnique({
        where: {
            id: parseInt(id)
        }
    })

    if(!product) {
        return NextResponse.json({ error: `Product with id ${id} not found` }, { status: 404 })
    }

    await prisma.product.delete({
        where: {
            id: product.id
        }
    })

    return NextResponse.json({ message: `Product '${product.name}' with id ${id} deleted` })
}