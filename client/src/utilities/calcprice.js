const BASE_PRICE = 64000

const buildOptionPriceLookup = (optionsByCategory = {}) => {
    const categories = ['exterior', 'interior', 'roof', 'wheel']

    return categories.reduce((lookup, category) => {
        const options = optionsByCategory[category] || []
        lookup[category] = options.reduce((categoryLookup, option) => {
            categoryLookup[option.name] = Number(option.price) || 0
            return categoryLookup
        }, {})
        return lookup
    }, {})
}

const getOptionPrice = (priceLookup, category, optionName) => {
    return priceLookup?.[category]?.[optionName] ?? 0
}

const getOptionsByCategory = (optionsByCategory, category) => {
    return optionsByCategory?.[category] || []
}

const calculateTotalPrice = (config, priceLookup, basePrice = BASE_PRICE) => {
    return (
        basePrice +
        getOptionPrice(priceLookup, 'exterior', config.exterior) +
        getOptionPrice(priceLookup, 'interior', config.interior) +
        getOptionPrice(priceLookup, 'roof', config.roof) +
        getOptionPrice(priceLookup, 'wheel', config.wheel)
    )
}

export {
    BASE_PRICE,
    buildOptionPriceLookup,
    getOptionPrice,
    getOptionsByCategory,
    calculateTotalPrice
}
