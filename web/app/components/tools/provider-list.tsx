'use client'
import { useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { Collection } from './types'
import Marketplace from './marketplace'
import cn from '@/utils/classnames'
import { useTabSearchParams } from '@/hooks/use-tab-searchparams'
import TabSliderNew from '@/app/components/base/tab-slider-new'
import LabelFilter from '@/app/components/tools/labels/filter'
import Input from '@/app/components/base/input'
import ProviderDetail from '@/app/components/tools/provider/detail'
import Empty from '@/app/components/plugins/marketplace/empty'
import CustomCreateCard from '@/app/components/tools/provider/custom-create-card'
import WorkflowToolEmpty from '@/app/components/tools/add-tool-modal/empty'
import Card from '@/app/components/plugins/card'
import CardMoreInfo from '@/app/components/plugins/card/card-more-info'
import PluginDetailPanel from '@/app/components/plugins/plugin-detail-panel'
import { useSelector as useAppContextSelector } from '@/context/app-context'
import { useAllToolProviders } from '@/service/use-tools'
import { useInstalledPluginList, useInvalidateInstalledPluginList } from '@/service/use-plugins'
import { RiArrowRightUpLine } from '@remixicon/react'

const ProviderList = () => {
  const { t } = useTranslation()
  const containerRef = useRef<HTMLDivElement>(null)
  const { enable_marketplace } = useAppContextSelector(s => s.systemFeatures)

  const [activeTab, setActiveTab] = useTabSearchParams({
    defaultTab: 'builtin',
  })
  const options = [
    { value: 'builtin', text: t('tools.type.builtIn') },
    { value: 'api', text: t('tools.type.custom') },
    { value: 'workflow', text: t('tools.type.workflow') },
  ]
  const [tagFilterValue, setTagFilterValue] = useState<string[]>([])
  const handleTagsChange = (value: string[]) => {
    setTagFilterValue(value)
  }
  const [keywords, setKeywords] = useState<string>('')
  const handleKeywordsChange = (value: string) => {
    setKeywords(value)
  }
  const { data: collectionList = [], refetch } = useAllToolProviders()
  const filteredCollectionList = useMemo(() => {
    return collectionList.filter((collection) => {
      if (collection.type !== activeTab)
        return false
      if (tagFilterValue.length > 0 && (!collection.labels || collection.labels.every(label => !tagFilterValue.includes(label))))
        return false
      if (keywords)
        return Object.values(collection.label).some(value => value.toLowerCase().includes(keywords.toLowerCase()))
      return true
    })
  }, [activeTab, tagFilterValue, keywords, collectionList])

  const [currentProvider, setCurrentProvider] = useState<Collection | undefined>()
  const { data: pluginList } = useInstalledPluginList()
  const invalidateInstalledPluginList = useInvalidateInstalledPluginList()
  const currentPluginDetail = useMemo(() => {
    const detail = pluginList?.plugins.find(plugin => plugin.plugin_id === currentProvider?.plugin_id)
    return detail
  }, [currentProvider?.plugin_id, pluginList?.plugins])

  return (
    <>
      <div className='relative flex overflow-hidden naos-ctx-bg shrink-0 h-0 grow'>
        <div
          ref={containerRef}
          className='relative flex flex-row overflow-y-auto naos-ctx-bg grow'
        >
          <div className={cn(
            'sticky top-0 flex flex-col min-w-[216px] w-[216px] bg-white items-center px-4 pb-2 leading-[56px] z-20 flex-wrap gap-y-2',
            // currentProvider && 'pr-6',
          )}>

            <div className='flex items-center gap-2'>
              <Input
                showLeftIcon
                showClearIcon
                className='h-10'

                wrapperClassName='w-full'
                value={keywords}
                onChange={e => handleKeywordsChange(e.target.value)}
                onClear={() => handleKeywordsChange('')}
              />
            </div>
            <CustomCreateCard onRefreshData={refetch} />
            <TabSliderNew
              value={activeTab}
              onChange={(state) => {
                setActiveTab(state)
                if (state !== activeTab)
                  setCurrentProvider(undefined)
              }}
              options={options}
            />
          </div>
          <div className='px-12 w-full pt-4'>
            <LabelFilter value={tagFilterValue} onChange={handleTagsChange} />
            <div className='sticky top-0 pt-5 pb-3 bg-background-default-subtle z-10'>
              <div className='title-2xl-semi-bold bg-gradient-to-r from-[rgba(11,165,236,0.95)] to-[rgba(21,90,239,0.95)] bg-clip-text text-transparent'>
                {t('plugin.marketplace.moreFrom')}
              </div>
              <div className='flex items-center text-center body-md-regular text-text-tertiary'>
                {t('plugin.marketplace.discover')}
                <span className="relative ml-1 body-md-medium text-text-secondary after:content-[''] after:absolute after:left-0 after:bottom-[1.5px] after:w-full after:h-2 after:bg-text-text-selected">
                  {t('plugin.category.models')}
                </span>
                ,
                <span className="relative ml-1 body-md-medium text-text-secondary after:content-[''] after:absolute after:left-0 after:bottom-[1.5px] after:w-full after:h-2 after:bg-text-text-selected">
                  {t('plugin.category.tools')}
                </span>
                ,
                <span className="relative ml-1 body-md-medium text-text-secondary after:content-[''] after:absolute after:left-0 after:bottom-[1.5px] after:w-full after:h-2 after:bg-text-text-selected">
                  {t('plugin.category.agents')}
                </span>
                ,
                <span className="relative ml-1 mr-1 body-md-medium text-text-secondary after:content-[''] after:absolute after:left-0 after:bottom-[1.5px] after:w-full after:h-2 after:bg-text-text-selected">
                  {t('plugin.category.extensions')}
                </span>
                {t('plugin.marketplace.and')}
                <span className="relative ml-1 mr-1 body-md-medium text-text-secondary after:content-[''] after:absolute after:left-0 after:bottom-[1.5px] after:w-full after:h-2 after:bg-text-text-selected">
                  {t('plugin.category.bundles')}
                </span>
                {t('common.operation.in')}
                {/* <a
                  href={`${MARKETPLACE_URL_PREFIX}?language=${locale}&q=${searchPluginText}&tags=${filterPluginTags.join(',')}`}
                  className='flex items-center ml-1 system-sm-medium text-text-accent'
                  target='_blank'
                >
                  {t('plugin.marketplace.difyMarketplace')}
                  <RiArrowRightUpLine className='w-4 h-4' />
                </a> */}
              </div>
            </div>
            {(filteredCollectionList.length > 0 || activeTab !== 'builtin') && (
              <div className={cn(
                'relative flex flex-col gap-4 pt-2 pb-4 shrink-0',
                !filteredCollectionList.length && activeTab === 'workflow' && 'grow',
              )}>
                {filteredCollectionList.map(collection => (
                  <div
                    key={collection.id}
                    onClick={() => setCurrentProvider(collection)}
                  >
                    <Card
                      className={cn(
                        'border-[1.5px] border-transparent cursor-pointer',
                        currentProvider?.id === collection.id && 'border-components-option-card-option-selected-border',
                      )}
                      hideCornerMark
                      payload={{
                        ...collection,
                        brief: collection.description,
                        org: collection.plugin_id ? collection.plugin_id.split('/')[0] : '',
                        name: collection.plugin_id ? collection.plugin_id.split('/')[1] : collection.name,
                      } as any}
                      footer={
                        <CardMoreInfo
                          tags={collection.labels}
                        />
                      }
                    />
                  </div>
                ))}
                {!filteredCollectionList.length && activeTab === 'workflow' && <div className=''><WorkflowToolEmpty /></div>}
              </div>
            )}
            {!filteredCollectionList.length && activeTab === 'builtin' && (
              <Empty lightCard text={t('tools.noTools')} className='px-12 h-[224px]' />
            )}
            {
              enable_marketplace && activeTab === 'builtin' && (
                <Marketplace
                  onMarketplaceScroll={() => {
                    containerRef.current?.scrollTo({ top: containerRef.current.scrollHeight, behavior: 'smooth' })
                  }}
                  searchPluginText={keywords}
                  filterPluginTags={tagFilterValue}
                />
              )
            }
          </div>
        </div>
      </div>
      {currentProvider && !currentProvider.plugin_id && (
        <ProviderDetail
          collection={currentProvider}
          onHide={() => setCurrentProvider(undefined)}
          onRefreshData={refetch}
        />
      )}
      <PluginDetailPanel
        detail={currentPluginDetail}
        onUpdate={() => invalidateInstalledPluginList()}
        onHide={() => setCurrentProvider(undefined)}
      />
    </>
  )
}
ProviderList.displayName = 'ToolProviderList'
export default ProviderList
