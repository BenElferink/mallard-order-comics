import Image from 'next/image'
import type { CoverVariant } from '@/@types'

const Cover = ({ variant, className }: { variant: CoverVariant; className?: string }) => {
  return (
    <Image
      src={`/media/cover_varients/${variant.toLowerCase().replaceAll(' ', '_')}.webp`}
      alt={variant}
      width={220}
      height={340}
      className={className}
      priority
      unoptimized
    />
  )
}

export default Cover
