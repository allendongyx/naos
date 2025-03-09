'use client'
import { useCallback, useEffect } from 'react'
import Link from 'next/link'
import { useBoolean } from 'ahooks'
import { useSelectedLayoutSegment } from 'next/navigation'
import { Bars3Icon } from '@heroicons/react/20/solid'
import AccountDropdown from './account-dropdown'
import AppNav from './app-nav'
import DatasetNav from './dataset-nav'
import EnvNav from './env-nav'
import PluginsNav from './plugins-nav'
import ExploreNav from './explore-nav'
import ToolsNav from './tools-nav'
import { WorkspaceProvider } from '@/context/workspace-context'
import { useAppContext } from '@/context/app-context'
import LogoSite from '@/app/components/base/logo/logo-site'
import WorkplaceSelector from '@/app/components/header/account-dropdown/workplace-selector'
import useBreakpoints, { MediaType } from '@/hooks/use-breakpoints'
import { useProviderContext } from '@/context/provider-context'
import { useModalContext } from '@/context/modal-context'
import PlanBadge from './plan-badge'
import LicenseNav from './license-env'
import { Plan } from '../billing/type'
import classNames from '@/utils/classnames'
import styles from './index.module.css'

const navClassName = `
  flex items-center relative mr-0 justify-center px-3 h-20 w-24 rounded-xl
  font-medium text-sm
  cursor-pointer
`

const Header = () => {
  const { isCurrentWorkspaceEditor, isCurrentWorkspaceDatasetOperator } = useAppContext()
  const selectedSegment = useSelectedLayoutSegment()
  const media = useBreakpoints()
  const isMobile = media === MediaType.mobile
  const [isShowNavMenu, { toggle, setFalse: hideNavMenu }] = useBoolean(false)
  const { enableBilling, plan } = useProviderContext()
  const { setShowPricingModal, setShowAccountSettingModal } = useModalContext()
  const isFreePlan = plan.type === Plan.sandbox
  const handlePlanClick = useCallback(() => {
    if (isFreePlan)
      setShowPricingModal()
    else
      setShowAccountSettingModal({ payload: 'billing' })
  }, [isFreePlan, setShowAccountSettingModal, setShowPricingModal])

  useEffect(() => {
    hideNavMenu()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSegment])
  return (
    <div className={classNames('flex flex-1 flex-col px-4 bg-background-body', styles.sideCls)}>
      <div className='flex items-center'>
        {isMobile && <div
          className='flex items-center justify-center h-8 w-8 cursor-pointer'
          onClick={toggle}
        >
          <Bars3Icon className="h-4 w-4 text-gray-500" />
        </div>}
        {
          !isMobile
          && <div className='flex w-64 p-2 pl-3 gap-1.5 items-center shrink-0 self-stretch'>
            <Link href="/apps" className='flex w-20 h-8 items-center justify-center gap-2 shrink-0'>
              <LogoSite className='object-contain' />
            </Link>
            {/* <div className='font-light text-divider-deep'>/</div> */}
            {/* <div className='flex items-center gap-0.5'>
              <WorkspaceProvider>
                <WorkplaceSelector />
              </WorkspaceProvider>
              {enableBilling ? <PlanBadge allowHover sandboxAsUpgrade plan={plan.type} onClick={handlePlanClick} /> : <LicenseNav />}
            </div> */}
          </div>
        }
      </div >
      {isMobile && (
        <div className='fle flex-col'>
          <Link href="/apps" className='flex items-center mr-4'>
            <LogoSite />
          </Link>
          <div className='font-light text-divider-deep'>/</div>
          {enableBilling ? <PlanBadge allowHover sandboxAsUpgrade plan={plan.type} onClick={handlePlanClick} /> : <LicenseNav />}
        </div >
      )}
      {
        !isMobile && (
          <div className='flex flex-col h-full col-span-2 items-center mt-4'>
            {!isCurrentWorkspaceDatasetOperator && <ExploreNav className={navClassName} />}
            {!isCurrentWorkspaceDatasetOperator && <AppNav />}
            {/* {(isCurrentWorkspaceEditor || isCurrentWorkspaceDatasetOperator) && <DatasetNav />} */}
            {!isCurrentWorkspaceDatasetOperator && <ToolsNav className={navClassName} />}
          </div>
        )
      }
      <div className='flex flex-col items-center shrink-0'>
        {/* <EnvNav />
        <div className='mr-3'>
          <PluginsNav />
        </div> */}
        <AccountDropdown isMobile={isMobile} />
      </div>
      {
        (isMobile && isShowNavMenu) && (
          <div className='w-full flex flex-col p-2 gap-y-1'>
            {!isCurrentWorkspaceDatasetOperator && <ExploreNav className={navClassName} />}
            {!isCurrentWorkspaceDatasetOperator && <AppNav />}
            {(isCurrentWorkspaceEditor || isCurrentWorkspaceDatasetOperator) && <DatasetNav />}
            {!isCurrentWorkspaceDatasetOperator && <ToolsNav className={navClassName} />}
          </div>
        )
      }
    </div >
  )
}
export default Header
