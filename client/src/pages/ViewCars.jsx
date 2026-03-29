import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import '../App.css'
import '../css/OptionPicker.css'
import { deleteCar, getAllCars, getAllOptions } from '../services/CarsAPI'

const toImageSrc = (imagePath) => {
    if (!imagePath) return ''
    return imagePath.startsWith('/') ? imagePath : `/${imagePath}`
}

const ViewCars = () => {
    const [cars, setCars] = useState([])
    const [optionLookup, setOptionLookup] = useState({})
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    const buildLookup = (optionsByCategory) => {
        const categories = ['exterior', 'interior', 'roof', 'wheel']

        return categories.reduce((lookup, category) => {
            const categoryMap = {}
                ; (optionsByCategory[category] || []).forEach((option) => {
                    categoryMap[option.name] = option
                })
            lookup[category] = categoryMap
            return lookup
        }, {})
    }

    const loadCars = async () => {
        try {
            setLoading(true)
            const [data, options] = await Promise.all([getAllCars(), getAllOptions()])
            setCars(data)
            setOptionLookup(buildLookup(options))
            setError('')
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadCars()
    }, [])

    const handleDelete = async (id) => {
        const shouldDelete = window.confirm('Delete this custom car?')

        if (!shouldDelete) return

        try {
            await deleteCar(id)
            setCars((prevCars) => prevCars.filter((car) => car.id !== id))
        } catch (err) {
            setError(err.message)
        }
    }

    return (
        <div>
            <h2>Custom Cars</h2>

            {loading && <p>Loading cars...</p>}
            {error && <p>{error}</p>}

            {!loading && !error && cars.length === 0 && (
                <p>No custom cars found. Create one to get started.</p>
            )}

            {!loading && !error && cars.length > 0 && (
                <section>
                    {cars.map((car) => (
                        <article key={car.id}>
                            <h3>{car.name}</h3>
                            <p>Total Price: ${car.price}</p>

                            <div className='option-grid cars-option-grid'>
                                {['exterior', 'roof', 'wheel', 'interior'].map((category) => {
                                    const optionName = car[category]
                                    const option = optionLookup?.[category]?.[optionName]
                                    return (
                                        <div key={`${car.id}-${category}`} className={`option-tile option-${category}`}>
                                            {option?.imagePath && (
                                                <img src={toImageSrc(option.imagePath)} alt={optionName} />
                                            )}
                                            <span>{category.toUpperCase()}</span>
                                            <small>{optionName}</small>
                                        </div>
                                    )
                                })}
                            </div>

                            <Link to={`/customcars/${car.id}`}>View Details</Link>
                            {' | '}
                            <Link to={`/edit/${car.id}`}>Edit</Link>
                            {' | '}
                            <button type='button' onClick={() => handleDelete(car.id)}>Delete</button>
                        </article>
                    ))}
                </section>
            )}
        </div>
    )
}

export default ViewCars