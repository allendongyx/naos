'use client'
import type { FC } from 'react'
import classNames from '@/utils/classnames'

type LogoSiteProps = {
  className?: string
}

const LogoSite: FC<LogoSiteProps> = ({
  className,
}) => {
  return (
    <img
      src={'/logo/logo.png'}
      className={classNames('block', className)}
      alt='logo'
    />
  )
}

export default LogoSite
