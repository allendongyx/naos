import {
  useEffect,
  useRef,
} from 'react'
import {
  RiArrowUpDoubleLine,
} from '@remixicon/react'
import { useTranslation } from 'react-i18next'
import { useMarketplace } from './hooks'
import List from '@/app/components/plugins/marketplace/list'
import Loading from '@/app/components/base/loading'
import { getLocaleOnClient } from '@/i18n'

type MarketplaceProps = {
  searchPluginText: string
  filterPluginTags: string[]
  onMarketplaceScroll: () => void
}
const Marketplace = ({
  searchPluginText,
  filterPluginTags,
  onMarketplaceScroll,
}: MarketplaceProps) => {
  const locale = getLocaleOnClient()
  const { t } = useTranslation()

  const {
    isLoading,
    marketplaceCollections,
    marketplaceCollectionPluginsMap,
    plugins,
    handleScroll,
    page,
  } = useMarketplace(searchPluginText, filterPluginTags)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (container)
      container.addEventListener('scroll', handleScroll)

    return () => {
      if (container)
        container.removeEventListener('scroll', handleScroll)
    }
  }, [handleScroll])

  return (
    <div
      ref={containerRef}
      className='grow flex flex-col shrink-0 sticky bottom-[-442px] h-[530px] py-2 pt-0 bg-background-default-subtle'
    >
      <RiArrowUpDoubleLine
        className='absolute top-2 left-1/2 -translate-x-1/2 w-4 h-4 text-text-quaternary cursor-pointer'
        onClick={() => onMarketplaceScroll()}
      />

      {
        isLoading && page === 1 && (
          <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
            <Loading />
          </div>
        )
      }
      {
        (!isLoading || page > 1) && (
          <List
            marketplaceCollections={marketplaceCollections || []}
            marketplaceCollectionPluginsMap={marketplaceCollectionPluginsMap || {}}
            plugins={plugins}
            showInstallButton
            locale={locale}
          />
        )
      }
    </div>
  )
}

export default Marketplace
