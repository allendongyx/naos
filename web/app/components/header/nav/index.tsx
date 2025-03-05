'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useSelectedLayoutSegment } from 'next/navigation'
import type { INavSelectorProps } from './nav-selector'
import classNames from '@/utils/classnames'
import { useStore as useAppStore } from '@/app/components/app/store'

type INavProps = {
  icon: React.ReactNode
  activeIcon?: React.ReactNode
  text: string
  activeSegment: string | string[]
  link: string
  isApp: boolean
} & INavSelectorProps

const Nav = ({
  icon,
  activeIcon,
  text,
  activeSegment,
  link,
  curNav,
  navs,
  createText,
  onCreate,
  onLoadmore,
  isApp,
}: INavProps) => {
  const setAppDetail = useAppStore(state => state.setAppDetail)
  const [hovered, setHovered] = useState(false)
  const segment = useSelectedLayoutSegment()
  const isActivated = Array.isArray(activeSegment) ? activeSegment.includes(segment!) : segment === activeSegment
  return (
    <div className={`
      
      flex items-center justify-center h-20 w-24 mr-0 rounded-xl text-sm shrink-0 font-medium
      ${isActivated && ' xx shadow-md font-semibold'}
      ${!curNav && !isActivated && 'hover:bg-components-main-nav-nav-button-bg-hover'}
    `}>
      <Link href={link}>
        <div
          onClick={() => setAppDetail()}
          className={classNames(`
            flex items-center flex-col h-7 px-2.5 cursor-pointer rounded-[10px]
            ${isActivated ? 'xxx' : 'text-components-main-nav-nav-button-text'}
            ${curNav && isActivated && 'hover:bg-components-main-nav-nav-button-bg-active-hover'}
          `)}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <div className='mr-2'>
            {
              (curNav && isActivated) ? activeIcon : icon
            }
          </div>
          {text}
        </div>
      </Link>
      {/* {
        curNav && isActivated && (
          <>
            <div className='font-light text-gray-300 '>/</div>
            <NavSelector
              isApp={isApp}
              curNav={curNav}
              navs={navs}
              createText={createText}
              onCreate={onCreate}
              onLoadmore={onLoadmore}
            />
          </>
        )
      } */}
    </div>
  )
}

export default Nav
