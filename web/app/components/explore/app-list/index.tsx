'use client'

import React, { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { useContext } from 'use-context-selector'
import useSWR from 'swr'
import { useDebounceFn } from 'ahooks'
import Toast from '../../base/toast'
import s from './style.module.css'
import cn from '@/utils/classnames'
import ExploreContext from '@/context/explore-context'
import type { App } from '@/models/explore'
import Category from '@/app/components/explore/category'
import AppCard from '@/app/components/explore/app-card'
import { fetchAppDetail, fetchAppList } from '@/service/explore'
import { importDSL } from '@/service/apps'
import { useTabSearchParams } from '@/hooks/use-tab-searchparams'
import CreateAppModal from '@/app/components/explore/create-app-modal'
import type { CreateAppModalProps } from '@/app/components/explore/create-app-modal'
import Loading from '@/app/components/base/loading'
import { NEED_REFRESH_APP_LIST_KEY } from '@/config'
import { useAppContext } from '@/context/app-context'
import { getRedirection } from '@/utils/app-redirection'
import Input from '@/app/components/base/input'
import { DSLImportMode } from '@/models/app'
import { usePluginDependencies } from '@/app/components/workflow/plugin-dependency/hooks'

type AppsProps = {
  onSuccess?: () => void
}

export enum PageType {
  EXPLORE = 'explore',
  CREATE = 'create',
}

const Apps = ({
  onSuccess,
}: AppsProps) => {
  const { t } = useTranslation()
  const { isCurrentWorkspaceEditor } = useAppContext()
  const { push } = useRouter()
  const { hasEditPermission } = useContext(ExploreContext)
  const allCategoriesEn = t('explore.apps.allCategories', { lng: 'en' })

  const [keywords, setKeywords] = useState('')
  const [searchKeywords, setSearchKeywords] = useState('')

  const { run: handleSearch } = useDebounceFn(() => {
    setSearchKeywords(keywords)
  }, { wait: 500 })

  const handleKeywordsChange = (value: string) => {
    setKeywords(value)
    handleSearch()
  }

  const [currentType, setCurrentType] = useState<string>('')
  const [currCategory, setCurrCategory] = useTabSearchParams({
    defaultTab: allCategoriesEn,
    disableSearchParams: false,
  })

  const {
    data: { categories, allList },
  } = useSWR(
    ['/explore/apps'],
    () =>
      fetchAppList().then(({ categories, recommended_apps }) => ({
        categories,
        allList: recommended_apps.sort((a, b) => a.position - b.position),
      })),
    {
      fallbackData: {
        categories: [],
        allList: [],
      },
    },
  )

  const filteredList = useMemo(() => {
    if (currCategory === allCategoriesEn) {
      if (!currentType)
        return allList
      else if (currentType === 'chatbot')
        return allList.filter(item => (item.app.mode === 'chat' || item.app.mode === 'advanced-chat'))
      else if (currentType === 'agent')
        return allList.filter(item => (item.app.mode === 'agent-chat'))
      else
        return allList.filter(item => (item.app.mode === 'workflow'))
    }
    else {
      if (!currentType)
        return allList.filter(item => item.category === currCategory)
      else if (currentType === 'chatbot')
        return allList.filter(item => (item.app.mode === 'chat' || item.app.mode === 'advanced-chat') && item.category === currCategory)
      else if (currentType === 'agent')
        return allList.filter(item => (item.app.mode === 'agent-chat') && item.category === currCategory)
      else
        return allList.filter(item => (item.app.mode === 'workflow') && item.category === currCategory)
    }
  }, [currentType, currCategory, allCategoriesEn, allList])

  const searchFilteredList = useMemo(() => {
    if (!searchKeywords || !filteredList || filteredList.length === 0)
      return filteredList

    const lowerCaseSearchKeywords = searchKeywords.toLowerCase()

    return filteredList.filter(item =>
      item.app && item.app.name && item.app.name.toLowerCase().includes(lowerCaseSearchKeywords),
    )
  }, [searchKeywords, filteredList])

  const [currApp, setCurrApp] = React.useState<App | null>(null)
  const [isShowCreateModal, setIsShowCreateModal] = React.useState(false)
  const { handleCheckPluginDependencies } = usePluginDependencies()
  const onCreate: CreateAppModalProps['onConfirm'] = async ({
    name,
    icon_type,
    icon,
    icon_background,
    description,
  }) => {
    const { export_data, mode } = await fetchAppDetail(
      currApp?.app.id as string,
    )
    try {
      const app = await importDSL({
        mode: DSLImportMode.YAML_CONTENT,
        yaml_content: export_data,
        name,
        icon_type,
        icon,
        icon_background,
        description,
      })
      setIsShowCreateModal(false)
      Toast.notify({
        type: 'success',
        message: t('app.newApp.appCreated'),
      })
      if (onSuccess)
        onSuccess()
      if (app.app_id)
        await handleCheckPluginDependencies(app.app_id)
      localStorage.setItem(NEED_REFRESH_APP_LIST_KEY, '1')
      getRedirection(isCurrentWorkspaceEditor, { id: app.app_id, mode }, push)
    }
    catch (e) {
      Toast.notify({ type: 'error', message: t('app.newApp.appCreateFailed') })
    }
  }

  if (!categories || categories.length === 0) {
    return (
      <div className="flex h-full items-center">
        <Loading type="area" />
      </div>
    )
  }

  return (
    <div className={cn(
      'flex flex-col h-full border-l-[0.5px] border-divider-regular',
    )}>

      <>
        <div className='px-12 mt-4 h-[220px] relative'>
          <div className='shrink-0 pt-6 px-12 absolute left-8 text-white z-10'>
            <div className={'mb-1 text-white text-3xl'}>Naos: Connect ai to your Apps</div>
            <div className='text-gray-400 text-base mt-2'>Advanced AI application platform.</div>
            <div className='text-gray-400 text-base'>Create and discover popular AI applications, focusing on Web3.</div>
            <div className='mt-4'>

              <Input
                showLeftIcon
                showClearIcon
                className='h-10 w-full bg-white hover:bg-white'
                wrapperClassName='w-full'
                value={keywords}
                onChange={e => handleKeywordsChange(e.target.value)}
                onClear={() => handleKeywordsChange('')}
              />

            </div>
          </div>
          <div className='relative w-full h-full top-0 bottom-0 rounded-xl'>
            <img className='w-full h-full z-0 rounded-xl' src='/imgs/wcl_loading.jpeg' />
          </div>

        </div>
      </>
      <div className={cn(
        'flex items-center justify-between mt-6 mx-12 border-b-gray-200 border-b',
      )}>
        <>
          <Category
            list={categories}
            value={currCategory}
            onChange={setCurrCategory}
            allCategoriesEn={allCategoriesEn}
          />
        </>

      </div>

      <div className={cn(
        'relative flex flex-1 pb-6 flex-col naos-ctx-bg overflow-auto shrink-0 grow mt-4',
      )}>
        <nav
          className={cn(
            s.appList,
            'grid content-start shrink-0 gap-4 px-6 sm:px-12',
          )}>
          {searchFilteredList.map(app => (
            <AppCard
              key={app.app_id}
              isExplore
              app={app}
              canCreate={hasEditPermission}
              onCreate={() => {
                setCurrApp(app)
                setIsShowCreateModal(true)
              }}
            />
          ))}
        </nav>
      </div>
      {isShowCreateModal && (
        <CreateAppModal
          appIconType={currApp?.app.icon_type || 'emoji'}
          appIcon={currApp?.app.icon || ''}
          appIconBackground={currApp?.app.icon_background || ''}
          appIconUrl={currApp?.app.icon_url}
          appName={currApp?.app.name || ''}
          appDescription={currApp?.app.description || ''}
          show={isShowCreateModal}
          onConfirm={onCreate}
          onHide={() => setIsShowCreateModal(false)}
        />
      )}
    </div>
  )
}

export default React.memo(Apps)
