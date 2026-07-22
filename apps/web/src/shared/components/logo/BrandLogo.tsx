import type { SVGProps } from 'react'

const BrandLogo = ({ ...props }: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      viewBox="0 0 316 316"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <circle cx="158" cy="158" r="158" fill="#F4A73B" />
      <circle cx="230" cy="72" r="25" fill="#FFBC42" />
      <circle cx="255" cy="109" r="12" fill="#FFBC42" />
    </svg>
  )
}

export default BrandLogo
