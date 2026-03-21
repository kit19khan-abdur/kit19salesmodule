import React from 'react';
import { popularCountryCodes, sortedCountryCodes } from '../../utils/countryCodes';

/**
 * Reusable Country Code Select Component
 * 
 * @param {Object} props
 * @param {string} props.value - Selected country code (e.g., '+91')
 * @param {function} props.onChange - Change handler function
 * @param {string} props.name - Input name attribute
 * @param {string} props.className - Additional CSS classes
 * @param {boolean} props.showCountryName - Show full country name in selected value (default: true)
 * @param {boolean} props.disabled - Disable the select
 * @param {boolean} props.required - Make field required
 * @param {string} props.size - Size variant: 'sm' | 'md' | 'lg' (default: 'md')
 */
const CountryCodeSelect = ({
  value = '+91',
  onChange,
  name = 'countryCode',
  className = '',
  showCountryName = true,
  disabled = false,
  required = false,
  size = 'md'
}) => {
  
  // Size variants
  const sizeClasses = {
    sm: 'w-[140px] px-2 py-1.5 text-xs',
    md: 'w-[180px] px-2 py-2.5 text-sm',
    lg: 'w-[220px] px-3 py-3 text-base'
  };

  const baseClasses = `border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none bg-white ${sizeClasses[size] || sizeClasses.md}`;

  return (
    <select
      name={name}
      value={value}
      onChange={onChange}
      className={`${baseClasses} ${className}`}
      disabled={disabled}
      required={required}
      style={{ paddingRight: '8px' }}
    >
      <optgroup label="Popular Countries">
        {popularCountryCodes.map((country) => (
          <option key={`popular-${country.iso}-${country.code}`} value={country.code}>
            {country.flag} {country.code} {showCountryName ? country.country : ''}
          </option>
        ))}
      </optgroup>
      <optgroup label="All Countries">
        {sortedCountryCodes.map((country) => (
          <option key={`all-${country.iso}-${country.code}`} value={country.code}>
            {country.flag} {country.code} {showCountryName ? country.country : ''}
          </option>
        ))}
      </optgroup>
    </select>
  );
};

export default CountryCodeSelect;
