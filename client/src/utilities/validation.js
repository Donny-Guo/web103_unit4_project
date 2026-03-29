import { BASE_PRICE, calculateTotalPrice } from './calcprice'

const REQUIRED_FIELDS = ['name', 'exterior', 'interior', 'roof', 'wheel', 'price']

const validateRequiredFields = (car) => {
    return REQUIRED_FIELDS.filter((field) => car[field] === undefined || car[field] === null || car[field] === '')
}

const validateOptionSelections = (car, optionsByCategory = {}) => {
    const categories = ['exterior', 'interior', 'roof', 'wheel']
    const errors = []

    categories.forEach((category) => {
        const validNames = new Set((optionsByCategory[category] || []).map((option) => option.name))
        if (!validNames.has(car[category])) {
            errors.push(`Invalid ${category} selection: ${car[category] || 'none selected'}.`)
        }
    })

    return errors
}

const validateCalculatedPrice = (car, priceLookup, basePrice = BASE_PRICE) => {
    const expectedPrice = calculateTotalPrice(car, priceLookup, basePrice)
    return Number(car.price) === expectedPrice
        ? null
        : `Price mismatch. Expected ${expectedPrice}, received ${Number(car.price)}.`
}

const validateCarConfiguration = (car, optionsByCategory, priceLookup, basePrice = BASE_PRICE) => {
    const errors = []
    const missingFields = validateRequiredFields(car)

    if (missingFields.length > 0) {
        errors.push(`Missing required fields: ${missingFields.join(', ')}.`)
    }

    errors.push(...validateOptionSelections(car, optionsByCategory))

    const priceError = validateCalculatedPrice(car, priceLookup, basePrice)
    if (priceError) {
        errors.push(priceError)
    }

    return {
        isValid: errors.length === 0,
        errors
    }
}

export {
    validateRequiredFields,
    validateOptionSelections,
    validateCalculatedPrice,
    validateCarConfiguration
}
