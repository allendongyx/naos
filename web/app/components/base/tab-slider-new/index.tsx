import type { FC } from 'react'
import cn from '@/utils/classnames'

type Option = {
  value: string
  text: string
  icon?: React.ReactNode
}
type TabSliderProps = {
  className?: string
  value: string
  onChange: (v: string) => void
  options: Option[]
}
const TabSliderNew: FC<TabSliderProps> = ({
  className,
  value,
  onChange,
  options,
}) => {
  return (
    <div className={cn(className, 'relative flex flex-col w-full items-center justify-center mt-4 gap-2')}>
      {options.map(option => (
        <div
          key={option.value}
          onClick={() => onChange(option.value)}
          className={cn(
            'mr-1 px-3 py-[7px] w-full h-[40px] flex items-center rounded-lg border-[0.5px] border-transparent text-text-tertiary text-sm font-medium leading-[18px] cursor-pointer hover:bg-components-main-nav-nav-button-bg-active',
            value === option.value && 'bg-components-main-nav-nav-button-bg-active bg-gray-200 border-components-main-nav-nav-button-border shadow-xs text-gray-700',
          )}
        >
          <span className={cn(value === option.value && 'text-components-main-nav-nav-button-text-active')}>
            {option.icon}
          </span>
          {option.text}
        </div>
      ))}
    </div>
  )
}

export default TabSliderNew
