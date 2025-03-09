'use client'
import { useTranslation } from 'react-i18next'
import { PlusIcon } from '@heroicons/react/20/solid'
import Button from '../../base/button'
import cn from '@/utils/classnames'
import type { App } from '@/models/explore'
import AppIcon from '@/app/components/base/app-icon'
export type AppCardProps = {
  app: App
  canCreate: boolean
  onCreate: () => void
  isExplore: boolean
}

const AppCard = ({
  app,
  canCreate,
  onCreate,
  isExplore,
}: AppCardProps) => {
  const { t } = useTranslation()
  const { app: appBasicInfo } = app

  // 定义包含 40 个标签的数组
  const tags = [
    'DeFi',
    'Ethereum',
    'Coinbase',
    'Huobi',
    '跨链桥',
    'NFT',
    'Solana',
    'Kraken',
    '抹茶',
    '流动性挖矿',
    '波卡',
    '交易策略',
    'Avalanche',
    'Bitfinex',
    'BNB',
    '闪电网络',
    'Terra',
    'Gate.io',
    'Twitter',
    'Algorand',
    'Gemini',
    '聚合交易',
    '稳定币兑换',
    'Cosmos',
    'Bitstamp',
    '抵押借贷',
    '自动化做市',
    'Near Protocol',
    'Bithumb',
    '收益聚合',
    '数据存储',
    'Tezos',
    'Upbit',
    '借贷清算',
    '身份验证',
    'Cardano',
    'Bybit',
  ]
  // 随机生成 2 - 4 之间的整数
  function getRandomCount() {
    return Math.floor(Math.random() * 3) + 2
  }

  // 从数组中随机选取指定数量的元素
  function getRandomTags() {
    const count = getRandomCount()
    const shuffled = [...tags].sort(() => 0.5 - Math.random())
    return shuffled.slice(0, count)
  }

  // 调用函数获取随机标签
  const randomTags = getRandomTags()
  console.log(`/imgs/${appBasicInfo.icon}`)
  return (
    <div className={cn('relative overflow-hidden pt-4 pb-4 group col-span-1 bg-components-panel-on-panel-item-bg border-[0.5px] border-components-panel-border rounded-lg shadow-sm flex flex-col transition-all duration-200 ease-in-out cursor-pointer hover:shadow-lg')}>
      <div className='flex h-[80px] px-4 items-center gap-3 grow-0 shrink-0'>
        <div className='relative shrink-0'>
          <AppIcon
            size='xxl'
            iconType='image'
            // icon={appBasicInfo.icon}
            background={appBasicInfo.icon_background}
            imageUrl={`/imgs/${appBasicInfo.icon}`}
          />
          {/* <AppTypeIcon wrapperClassName='absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-[4px] border border-divider-regular outline outline-components-panel-on-panel-item-bg'
            className='w-3 h-3' type={appBasicInfo.mode} /> */}
        </div>
        <div className='grow w-0 py-[1px]'>
          {/* <div className='flex items-center text-sm leading-5 font-semibold text-text-secondary'>
            <div className='truncate text-lg text-black' title={appBasicInfo.name}>{appBasicInfo.name}</div>
          </div> */}
          <div className='flex items-center text-gray-800 leading-[18px] text-sm font-light'>
            {/* ❤️ {(Math.floor(Math.random() * 2000000) + 1).toLocaleString('en-US')} */}
            <div className=' mb-2 font-bold text-base  text-gray-800'>
              {appBasicInfo.name}
            </div>
            {/* {appBasicInfo.mode === 'advanced-chat' && <div className='truncate'>@{t('app.types.advanced').toUpperCase()}</div>}
            {appBasicInfo.mode === 'chat' && <div className='truncate'>@{t('app.types.chatbot').toUpperCase()}</div>}
            {appBasicInfo.mode === 'agent-chat' && <div className='truncate'>@{t('app.types.agent').toUpperCase()}</div>}
            {appBasicInfo.mode === 'workflow' && <div className='truncate'>@{t('app.types.workflow').toUpperCase()}</div>}
            {appBasicInfo.mode === 'completion' && <div className='truncate'>@{t('app.types.completion').toUpperCase()}</div>} */}
          </div>
        </div>
      </div>
      <div className="description-wrapper px-4 h-[85px] mt-2 text-sm leading-normal text-text-tertiary ">
        <div className='line-clamp-3'>
          {app.description}
        </div>
      </div>

      <div className='px-[14px]'>
        <hr className=' bg-gray-100' />
      </div>
      <div className='px-[14px] mt-4 flex flex-row text-sm text-text-tertiary gap-4'>
        {
          randomTags.map((tag) => {
            return (
              <div key={tag} className='bg-gray-100 px-2 rounded-lg text-xs flex py-1 justify-center items-center text-gray-700 '>
                {tag}
              </div>
            )
          })
        }
      </div>
      {isExplore && canCreate && (
        <div className={cn('hidden absolute bottom-0 left-0 right-0 p-4 pt-8 group-hover:flex bg-gradient-to-t from-[60.27%] from-components-panel-gradient-2 to-transparent')}>
          <div className={cn('flex items-center w-full space-x-2 h-8')}>
            <Button variant='primary' className='grow h-7' onClick={() => onCreate()}>
              <PlusIcon className='w-4 h-4 mr-1' />
              <span className='text-xs'>{t('explore.appCard.addToWorkspace')}</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export default AppCard
