import React from 'react'

const Button = ({
    children,
    className="",
    type,
    bgColor = "bg-blue-500",
    textColor = "text-white",
    ...props
}) => {
  return (
    <div>
        <button type={type} className={` px-4 py-2 ${bgColor} ${textColor} ${className} rounded-lg`} {...props}>{children}</button>
    </div>
  )
}

export default Button