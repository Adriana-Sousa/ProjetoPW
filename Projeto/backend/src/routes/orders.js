import express from 'express'
import OrdersControllers from '../controllers/orders.js'

const ordersRouter = express.Router()
const ordersControllers = new OrdersControllers()

// pegar todas as ordens
ordersRouter.get('/', async (req, res) => {
    const { body, success, statusCode } = await ordersControllers.getOrders()

    res.status(statusCode).send({ body, success, statusCode })
})

// pegar as ordens por user
ordersRouter.get('/userorders/:id', async (req, res) => {
    const { body, success, statusCode } = await ordersControllers.getOrdersByUserId(req.params.id)

    res.status(statusCode).send({ body, success, statusCode })
})

// adicionar ordem
ordersRouter.post('/', async (req, res) => {
    const { body, success, statusCode } = await ordersControllers.addOrder(req.body)

    res.status(statusCode).send({ body, success, statusCode })
})

// deletar ordem
ordersRouter.delete('/:id', async (req, res) => {
    const { body, success, statusCode } = await ordersControllers.deleteOrder(req.params.id)

    res.status(statusCode).send({ body, success, statusCode })
})

// editar ordem
ordersRouter.put('/:id', async (req, res) => {
    const { body, success, statusCode } = await ordersControllers.updateOrder(req.params.id, req.body)

    res.status(statusCode).send({ body, success, statusCode })
})

export default ordersRouter 