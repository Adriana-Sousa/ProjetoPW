import { Mongo } from "../database/mongo.js"
import { ObjectId } from 'mongodb'

const collectionName = 'orders'

export default class OrdersDataAccess {

    // pegar todas as ordens
    async getOrders() {
        const result = await Mongo.db
        .collection(collectionName)
        .aggregate([
            {
                // olhar para
                $lookup: {
                    from: 'orderItems', // onde olhar
                    localField: '_id', // local de refência
                    foreignField: 'orderId', // campo estrangeiro
                    as: 'orderItems' // como o campo vai se chamar
                }
            },
            {
                // ver quem foi o user que fez o pedido
                $lookup: {
                    from: 'users', // onde olhar
                    localField: 'userId', // local de referência
                    foreignField: '_id', // campo estrangeiro
                    as: 'userDetails' // como o campo vai se chamar
                }
            },
            {
                // não mostrar os campos sensiveis dos users
                $project: {
                    'userDetails.password': 0,
                    'userDetails.salt': 0,
                }
            },
            {
                // mudar o camando para outra coleção
                $unwind: '$orderItems'
            },
            {
                // ver os pratos do pedido
                $lookup: {
                    from: 'plates', // onde olhar
                    localField: 'orderItems.plateId', // local de referência
                    foreignField: '_id', // campo estrangeiro
                    as: 'orderItems.itemDetails' // comoo vai se chamar
                }
            },
            {
                // agrupar os itens que tem o mesmo id
                $group: {
                    _id: '$_id',
                    userDetails: { $first: '$userDetails' },
                    orderItems: { $push: '$orderItems' },
                    pickupStatus: { $first: '$pickupStatus' },
                    pickupTime: { $first: '$pickupTime' },
                    pickupDate: { $first: '$pickupDate' },
                }
            }
        ])
        .toArray()

        return result
    }

    // pegar os pedidos pelo id do user
    async getOrdersByUserId(userId) {
        const result = await Mongo.db
        .collection(collectionName)
        .aggregate([
            {
                // verificar o id do user
                $match: { userId: new ObjectId(userId) }
            }, 
            {
                // ver os itens de pedido
                $lookup: {
                    from: 'orderItems',
                    localField: '_id',
                    foreignField: 'orderId',
                    as: 'orderItems'
                }
            },
            {
                // ver os usuarios
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'userDetails'
                }
            },
            {
                $project: {
                    'userDetails.password': 0,
                    'userDetails.salt': 0,
                }
            },
            {
                $unwind: '$orderItems'
            },
            {
                // ver os pratos
                $lookup: {
                    from: 'plates',
                    localField: 'orderItems.plateId',
                    foreignField: '_id',
                    as: 'orderItems.itemDetails'
                }
            },
            {
                $group: {
                    _id: '$_id',
                    userDetails: { $first: '$userDetails' },
                    orderItems: { $push: '$orderItems' },
                    pickupStatus: { $first: '$pickupStatus' },
                    pickupTime: { $first: '$pickupTime' }
                }
            }
        ])
        .toArray()

        return result
    }

    // adicionar ordens
    async addOrder(orderData) {
        const { items, ...orderDataRest } = orderData

        // adicionar a data que a ordem foi criada
        orderDataRest.createdAt = new Date()
        orderDataRest.pickupStatus = 'Pending' // estado da ordem
        orderDataRest.userId = new ObjectId(orderDataRest.userId) // referência pro user

        // inserir ordem
        const newOrder = await Mongo.db
        .collection(collectionName)
        .insertOne(orderDataRest)

        // se não recebeu o id
        if(!newOrder.insertedId) {
            throw new Error('Order cannot be inserted')
        }

        // trabalhar com cada item de forma individual
        items.map((item) => {
            item.plateId = new ObjectId(item.plateId)
            item.orderId = new ObjectId(newOrder.insertedId)
        })

        const result = await Mongo.db
        .collection('orderItems')
        .insertMany(items)

        return result
    }

    // eliminar ordens
    async deleteOrder (orderId) {

        // eliminar os itens da ordem
        const itemsToDelete = await Mongo.db
        .collection('orderItems')
        .deleteMany({ orderId: new ObjectId(orderId) })

        // eliminar a ordem
        const orderToDelete = await Mongo.db
        .collection(collectionName)
        .findOneAndDelete({ _id: new ObjectId(orderId) })

        const result = {
            itemsToDelete,
            orderToDelete
        }

        return result
    }

    async updateOrder(orderId, orderData) {
        const result = await Mongo.db
        .collection(collectionName)
        .findOneAndUpdate(
            { _id: new ObjectId(orderId) },
            { $set: orderData }
        )

        return result
    }
    
}