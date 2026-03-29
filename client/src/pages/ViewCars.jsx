import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import '../App.css'
import { deleteCar, getAllCars } from '../services/CarsAPI'

const ViewCars = () => {
    const [cars, setCars] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    const loadCars = async () => {
        try {
            setLoading(true)
            const data = await getAllCars()
            setCars(data)
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
                            <p>Exterior: {car.exterior}</p>
                            <p>Interior: {car.interior}</p>
                            <p>Roof: {car.roof}</p>
                            <p>Wheel: {car.wheel}</p>

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