import { Mongo } from "../database/mongo.js"
import { ObjectId } from 'mongodb'

const collectionName = 'plates'

export default class PlatesDataAccess {

    // pegar todos os pratos
    async getPlates() {
        const result = await Mongo.db
        .collection(collectionName)
        .find({ })
        .toArray()

        return result
    }

    // pegar os pratos disponiveis
    async getAvailablePlates() {
        const result = await Mongo.db
        .collection(collectionName)
        .find({ available: true })
        .toArray()

        return result
    }

    // adicionar pratos
    async addPlate(plateData) {
        const result = await Mongo.db
        .collection(collectionName)
        .insertOne(plateData)

        return result
    }

    // deletar pratos
    async deletePlate (plateId) {
        const result = await Mongo.db
        .collection(collectionName)
        .findOneAndDelete({ _id: new ObjectId(plateId) })

        return result
    }

    // editar pratos
    async updatePlate(plateId, plateData) {
        const result = await Mongo.db
        .collection(collectionName)
        .findOneAndUpdate(
            { _id: new ObjectId(plateId) },
            { $set: plateData }
        )

        return result
    }
    
}