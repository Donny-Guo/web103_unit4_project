const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/cars'
const OPTIONS_API_BASE_URL = API_BASE_URL.replace(/\/cars\/?$/, '/options')

const parseResponse = async (response) => {
    const data = await response.json().catch(() => null)

    if (!response.ok) {
        const message = data?.error || `Request failed with status ${response.status}`
        throw new Error(message)
    }

    return data
}

const getAllCars = async () => {
    const response = await fetch(API_BASE_URL)
    return parseResponse(response)
}

const getCar = async (id) => {
    const response = await fetch(`${API_BASE_URL}/${id}`)
    return parseResponse(response)
}

const createCar = async (carData) => {
    const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(carData)
    })

    return parseResponse(response)
}

const updateCar = async (id, carData) => {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(carData)
    })

    return parseResponse(response)
}

const deleteCar = async (id) => {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'DELETE'
    })

    return parseResponse(response)
}

const getAllOptions = async () => {
    const response = await fetch(OPTIONS_API_BASE_URL)
    return parseResponse(response)
}

export {
    getAllCars,
    getCar,
    createCar,
    updateCar,
    deleteCar,
    getAllOptions
}
