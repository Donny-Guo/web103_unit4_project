import { pool } from '../config/database.js'

const TABLE_NAME = process.env.CUSTOM_ITEM_TABLE || '"CustomItem"'
const OPTION_TABLES = {
    exterior: 'exterior_options',
    interior: 'interior_options',
    roof: 'roof_options',
    wheel: 'wheel_options'
}

const requiredCarFields = ['name', 'exterior', 'interior', 'roof', 'wheel', 'price']

const hasMissingRequiredFields = (payload) => {
    return requiredCarFields.some((field) => payload[field] === undefined || payload[field] === null)
}

const mapOptionRow = (row) => ({
    id: row.id,
    name: row.name,
    price: row.price,
    imagePath: row.image_path
})

const getAllOptions = async (_, res) => {
    try {
        const results = await Promise.all(
            Object.entries(OPTION_TABLES).map(async ([category, tableName]) => {
                const queryResult = await pool.query(`SELECT * FROM ${tableName} ORDER BY id ASC`)
                return [category, queryResult.rows.map(mapOptionRow)]
            })
        )

        return res.status(200).json(Object.fromEntries(results))
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}

const getOptionsByCategory = async (req, res) => {
    const category = req.params.category
    const tableName = OPTION_TABLES[category]

    if (!tableName) {
        return res.status(400).json({ error: 'Invalid option category.' })
    }

    try {
        const result = await pool.query(`SELECT * FROM ${tableName} ORDER BY id ASC`)
        return res.status(200).json(result.rows.map(mapOptionRow))
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}

const getCars = async (_, res) => {
    try {
        const results = await pool.query(`SELECT * FROM ${TABLE_NAME} ORDER BY id ASC`)
        return res.status(200).json(results.rows)
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}

const getCarById = async (req, res) => {
    const id = Number(req.params.id)

    if (!Number.isInteger(id)) {
        return res.status(400).json({ error: 'Invalid car id.' })
    }

    try {
        const result = await pool.query(`SELECT * FROM ${TABLE_NAME} WHERE id = $1`, [id])

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Car not found.' })
        }

        return res.status(200).json(result.rows[0])
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}

const createCar = async (req, res) => {
    const payload = req.body || {}

    if (hasMissingRequiredFields(payload)) {
        return res.status(400).json({
            error: 'Missing one or more required fields: name, exterior, interior, roof, wheel, price.'
        })
    }

    try {
        const query = {
            text: `
                INSERT INTO ${TABLE_NAME} (name, exterior, interior, roof, wheel, price)
                VALUES ($1, $2, $3, $4, $5, $6)
				RETURNING *
			`,
            values: [payload.name, payload.exterior, payload.interior, payload.roof, payload.wheel, payload.price]
        }

        const result = await pool.query(query)
        return res.status(201).json(result.rows[0])
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}

const editCar = async (req, res) => {
    const id = Number(req.params.id)
    const payload = req.body || {}

    if (!Number.isInteger(id)) {
        return res.status(400).json({ error: 'Invalid car id.' })
    }

    if (hasMissingRequiredFields(payload)) {
        return res.status(400).json({
            error: 'Missing one or more required fields: name, exterior, interior, roof, wheel, price.'
        })
    }

    try {
        const query = {
            text: `
				UPDATE ${TABLE_NAME}
                SET name = $1, exterior = $2, interior = $3, roof = $4, wheel = $5, price = $6
                WHERE id = $7
				RETURNING *
			`,
            values: [payload.name, payload.exterior, payload.interior, payload.roof, payload.wheel, payload.price, id]
        }

        const result = await pool.query(query)

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Car not found.' })
        }

        return res.status(200).json(result.rows[0])
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}

const deleteCar = async (req, res) => {
    const id = Number(req.params.id)

    if (!Number.isInteger(id)) {
        return res.status(400).json({ error: 'Invalid car id.' })
    }

    try {
        const result = await pool.query(`DELETE FROM ${TABLE_NAME} WHERE id = $1 RETURNING *`, [id])

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Car not found.' })
        }

        return res.status(200).json({ message: 'Car deleted successfully.', deleted: result.rows[0] })
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}

export {
    getAllOptions,
    getOptionsByCategory,
    getCars,
    getCarById,
    createCar,
    editCar,
    deleteCar
}
