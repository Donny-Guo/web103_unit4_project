import { pool } from './database.js'

import customData from '../data/custom_data.js'
import exteriorData from '../data/exterior_data.js'
import interiorData from '../data/interior_data.js'
import roofData from '../data/roof_data.js'
import wheelData from '../data/wheel_data.js'

const createTablesQuery = `
DROP TABLE IF EXISTS "CustomItem";
DROP TABLE IF EXISTS wheel_options;
DROP TABLE IF EXISTS roof_options;
DROP TABLE IF EXISTS interior_options;
DROP TABLE IF EXISTS exterior_options;

CREATE TABLE IF NOT EXISTS exterior_options (
	id INTEGER PRIMARY KEY,
	name VARCHAR(255) NOT NULL UNIQUE,
	price INTEGER NOT NULL,
	image_path VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS interior_options (
	id INTEGER PRIMARY KEY,
	name VARCHAR(255) NOT NULL UNIQUE,
	price INTEGER NOT NULL,
	image_path VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS roof_options (
	id INTEGER PRIMARY KEY,
	name VARCHAR(255) NOT NULL UNIQUE,
	price INTEGER NOT NULL,
	image_path VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS wheel_options (
	id INTEGER PRIMARY KEY,
	name VARCHAR(255) NOT NULL UNIQUE,
	price INTEGER NOT NULL,
	image_path VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS "CustomItem" (
	id INTEGER PRIMARY KEY,
	exterior VARCHAR(255) NOT NULL,
	interior VARCHAR(255) NOT NULL,
	roof VARCHAR(255) NOT NULL,
	wheel VARCHAR(255) NOT NULL,
	price INTEGER NOT NULL
);
`

const seedOptionTable = async (tableName, data) => {
    const insertQuery = `
		INSERT INTO ${tableName} (id, name, price, image_path)
		VALUES ($1, $2, $3, $4)
	`

    for (const option of data) {
        await pool.query(insertQuery, [option.id, option.name, option.price, option.imagePath])
    }
}

const seedCustomItemsTable = async () => {
    const insertQuery = `
		INSERT INTO "CustomItem" (id, exterior, interior, roof, wheel, price)
		VALUES ($1, $2, $3, $4, $5, $6)
	`

    for (const item of customData) {
        await pool.query(insertQuery, [
            item.id,
            item.exterior,
            item.interior,
            item.roof,
            item.wheel,
            item.price
        ])
    }
}

const resetDatabase = async () => {
    try {
        await pool.query(createTablesQuery)
        console.log('Created all tables successfully.')

        await seedOptionTable('exterior_options', exteriorData)
        await seedOptionTable('interior_options', interiorData)
        await seedOptionTable('roof_options', roofData)
        await seedOptionTable('wheel_options', wheelData)
        await seedCustomItemsTable()

        console.log('Seeded all tables successfully.')
    } catch (error) {
        console.error('Error resetting database:', error)
    } finally {
        await pool.end()
    }
}

resetDatabase()
