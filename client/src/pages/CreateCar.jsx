import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../App.css'
import OptionPicker from '../components/OptionPicker'
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

    const handleOptionChange = (category, value) => {
        setFormData((prev) => {
            const nextData = {
                ...prev,
                [category]: value
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

                <OptionPicker
                    title='Exterior'
                    category='exterior'
                    options={getOptionsByCategory(optionsData, 'exterior')}
                    selectedValue={formData.exterior}
                    onSelect={(value) => handleOptionChange('exterior', value)}
                />

                <OptionPicker
                    title='Roof'
                    category='roof'
                    options={getOptionsByCategory(optionsData, 'roof')}
                    selectedValue={formData.roof}
                    onSelect={(value) => handleOptionChange('roof', value)}
                />

                <OptionPicker
                    title='Wheels'
                    category='wheel'
                    options={getOptionsByCategory(optionsData, 'wheel')}
                    selectedValue={formData.wheel}
                    onSelect={(value) => handleOptionChange('wheel', value)}
                />

                <OptionPicker
                    title='Interior'
                    category='interior'
                    options={getOptionsByCategory(optionsData, 'interior')}
                    selectedValue={formData.interior}
                    onSelect={(value) => handleOptionChange('interior', value)}
                />

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