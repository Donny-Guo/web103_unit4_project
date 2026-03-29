import React from 'react'
import '../css/OptionPicker.css'

const toImageSrc = (imagePath) => {
    if (!imagePath) return ''
    return imagePath.startsWith('/') ? imagePath : `/${imagePath}`
}

const OptionPicker = ({ title, category, options, selectedValue, onSelect }) => {
    return (
        <section className='option-picker'>
            <h3>{title}</h3>

            <div className='option-grid'>
                {options.map((option) => (
                    <button
                        key={option.id}
                        type='button'
                        className={`option-tile option-${category} interactive-tile ${selectedValue === option.name ? 'selected' : ''}`}
                        onClick={() => onSelect(option.name)}
                    >
                        <img src={toImageSrc(option.imagePath)} alt={option.name} />
                        <span>{option.name}</span>
                        <small>${option.price}</small>
                    </button>
                ))}
            </div>
        </section>
    )
}

export default OptionPicker