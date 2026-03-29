import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../App.css'
import { createCar, getAllOptions } from '../services/CarsAPI'
import {
    BASE_PRICE,
    buildOptionPriceLookup,
    calculateTotalPrice,
    getOptionsByCategory
} from '../utilities/calcprice'
import { validateCarConfiguration } from '../utilities/validation'

const CreateCar = () => {
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
        price: BASE_PRICE
    })
    const [loadingOptions, setLoadingOptions] = useState(true)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        const loadOptions = async () => {
            try {
                setLoadingOptions(true)
                const options = await getAllOptions()
                const lookup = buildOptionPriceLookup(options)
                const defaults = {
                    exterior: options.exterior?.[0]?.name || '',
                    interior: options.interior?.[0]?.name || '',
                    roof: options.roof?.[0]?.name || '',
                    wheel: options.wheel?.[0]?.name || ''
                }

                setOptionsData(options)
                setPriceLookup(lookup)
                setFormData((prev) => ({
                    ...prev,
                    ...defaults,
                    price: calculateTotalPrice(defaults, lookup, BASE_PRICE)
                }))
                setError('')
            } catch (err) {
                setError(err.message)
            } finally {
                setLoadingOptions(false)
            }
        }

        loadOptions()
    }, [])

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
            setLoading(true)
            setError('')
            const createdCar = await createCar(formData)
            navigate(`/customcars/${createdCar.id}`)
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div>
            <h2>Create Custom Car</h2>

            {loadingOptions && <p>Loading options...</p>}

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

                <button type='submit' disabled={loading || loadingOptions}>
                    {loading ? 'Saving...' : 'Create Car'}
                </button>
            </form>

            {error && <p>{error}</p>}
        </div>
    )
}

export default CreateCar