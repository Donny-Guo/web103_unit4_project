import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import '../App.css'
import { deleteCar, getCar } from '../services/CarsAPI'

const CarDetails = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [car, setCar] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        const loadCar = async () => {
            try {
                setLoading(true)
                const data = await getCar(id)
                setCar(data)
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
                    <p>Exterior: {car.exterior}</p>
                    <p>Interior: {car.interior}</p>
                    <p>Roof: {car.roof}</p>
                    <p>Wheel: {car.wheel}</p>

                    <Link to={`/edit/${car.id}`}>Edit</Link>
                    {' | '}
                    <button type='button' onClick={handleDelete}>Delete</button>
                </article>
            )}

        </div>
    )
}

export default CarDetails