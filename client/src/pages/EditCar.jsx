import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import '../App.css'
import { getAllOptions, getCar, updateCar } from '../services/CarsAPI'
import {
    BASE_PRICE,
    buildOptionPriceLookup,
    calculateTotalPrice,
    getOptionsByCategory
} from '../utilities/calcprice'
import { validateCarConfiguration } from '../utilities/validation'

const EditCar = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [optionsData, setOptionsData] = useState({
        exterior: [],
        interior: [],
        roof: [],
        wheel: []
    })
    const [priceLookup, setPriceLookup] = useState({})
    const [formData, setFormData] = useState({
        name: '',
        exterior: '',
        interior: '',
        roof: '',
        wheel: '',
        price: 0
    })
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        const loadCar = async () => {
            try {
                setLoading(true)
                const [options, car] = await Promise.all([getAllOptions(), getCar(id)])
                const lookup = buildOptionPriceLookup(options)
                const loadedData = {
                    name: car.name,
                    exterior: car.exterior,
                    interior: car.interior,
                    roof: car.roof,
                    wheel: car.wheel
                }

                setOptionsData(options)
                setPriceLookup(lookup)

                setFormData({
                    ...loadedData,
                    price: calculateTotalPrice(loadedData, lookup, BASE_PRICE)
                })
                setError('')
            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        loadCar()
    }, [id])

    const handleChange = (event) => {
        const { name, value } = event.target
        setFormData((prev) => {
            const nextData = {
                ...prev,
                [name]: value
            }

            return {
                ...nextData,
                price: calculateTotalPrice(nextData, priceLookup, BASE_PRICE)
            }
        })
    }

    const handleSubmit = async (event) => {
        event.preventDefault()

        const validationResult = validateCarConfiguration(formData, optionsData, priceLookup, BASE_PRICE)
        if (!validationResult.isValid) {
            setError(validationResult.errors[0])
            return
        }

        try {
            setSaving(true)
            setError('')
            await updateCar(id, formData)
            navigate(`/customcars/${id}`)
        } catch (err) {
            setError(err.message)
        } finally {
            setSaving(false)
        }
    }

    return (
        <div>
            <h2>Edit Custom Car</h2>

            {loading && <p>Loading car...</p>}
            {error && <p>{error}</p>}

            {!loading && (
                <form onSubmit={handleSubmit}>
                    <label htmlFor='name'>Name</label>
                    <input id='name' name='name' type='text' value={formData.name} onChange={handleChange} required />

                    <label htmlFor='exterior'>Exterior</label>
                    <select id='exterior' name='exterior' value={formData.exterior} onChange={handleChange} required>
                        {getOptionsByCategory(optionsData, 'exterior').map((option) => (
                            <option key={option.id} value={option.name}>{option.name}</option>
                        ))}
                    </select>

                    <label htmlFor='interior'>Interior</label>
                    <select id='interior' name='interior' value={formData.interior} onChange={handleChange} required>
                        {getOptionsByCategory(optionsData, 'interior').map((option) => (
                            <option key={option.id} value={option.name}>{option.name}</option>
                        ))}
                    </select>

                    <label htmlFor='roof'>Roof</label>
                    <select id='roof' name='roof' value={formData.roof} onChange={handleChange} required>
                        {getOptionsByCategory(optionsData, 'roof').map((option) => (
                            <option key={option.id} value={option.name}>{option.name}</option>
                        ))}
                    </select>

                    <label htmlFor='wheel'>Wheel</label>
                    <select id='wheel' name='wheel' value={formData.wheel} onChange={handleChange} required>
                        {getOptionsByCategory(optionsData, 'wheel').map((option) => (
                            <option key={option.id} value={option.name}>{option.name}</option>
                        ))}
                    </select>

                    <label htmlFor='price'>Price</label>
                    <input id='price' name='price' type='number' value={formData.price} readOnly />

                    <button type='submit' disabled={saving}>
                        {saving ? 'Saving...' : 'Update Car'}
                    </button>
                </form>
            )}
        </div>
    )
}

export default EditCar