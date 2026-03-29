import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import '../App.css'
import '../css/OptionPicker.css'
import { deleteCar, getAllOptions, getCar } from '../services/CarsAPI'

const toImageSrc = (imagePath) => {
    if (!imagePath) return ''
    return imagePath.startsWith('/') ? imagePath : `/${imagePath}`
}

const CarDetails = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [car, setCar] = useState(null)
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

    useEffect(() => {
        const loadCar = async () => {
            try {
                setLoading(true)
                const [data, options] = await Promise.all([getCar(id), getAllOptions()])
                setCar(data)
                setOptionLookup(buildLookup(options))
                setError('')
            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        loadCar()
    }, [id])

    const handleDelete = async () => {
        const shouldDelete = window.confirm('Delete this custom car?')

        if (!shouldDelete) return

        try {
            await deleteCar(id)
            navigate('/customcars')
        } catch (err) {
            setError(err.message)
        }
    }

    return (
        <div>
            <h2>Car Details</h2>

            {loading && <p>Loading car details...</p>}
            {error && <p>{error}</p>}

            {!loading && !error && car && (
                <article>
                    <h3>{car.name}</h3>
                    <p>Total Price: ${car.price}</p>

                    <div className='option-grid'>
                        {['exterior', 'roof', 'wheel', 'interior'].map((category) => {
                            const optionName = car[category]
                            const option = optionLookup?.[category]?.[optionName]
                            return (
                                <div key={`${car.id}-${category}`} className={`option-tile option-${category} selected`}>
                                    {option?.imagePath && (
                                        <img src={toImageSrc(option.imagePath)} alt={optionName} />
                                    )}
                                    <span>{category.toUpperCase()}</span>
                                    <small>{optionName}</small>
                                </div>
                            )
                        })}
                    </div>

                    <Link to={`/edit/${car.id}`}>Edit</Link>
                    {' | '}
                    <button type='button' onClick={handleDelete}>Delete</button>
                </article>
            )}

        </div>
    )
}

export default CarDetails