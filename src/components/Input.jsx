import React, { useId } from 'react'

const Input = ({
    label,
    type="text",
    className="",
    ...props
}) => {
  return (
    <div className='w-full'>
        {label && <label 
            className='inline-block mb-1 pl-1'
            >
                {label}
            </label>
            }
        <input type={type} className={`${className} p-2 outline-none bg-gray-200 rounded-lg w-full`} {...props}></input>
    </div>
  )
}

export default Input