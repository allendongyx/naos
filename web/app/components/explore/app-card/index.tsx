'use client'
import { useTranslation } from 'react-i18next'
import { PlusIcon } from '@heroicons/react/20/solid'
import Button from '../../base/button'
import cn from '@/utils/classnames'
import type { App } from '@/models/explore'
import AppIcon from '@/app/components/base/app-icon'

import { AiText, ChatBot, CuteRobot } from '@/app/components/base/icons/src/vender/solid/communication'
import { Route } from '@/app/components/base/icons/src/vender/solid/mapsAndTravel'
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
  return (
    <div className={cn('relative overflow-hidden pb-2 group col-span-1 bg-white border-gray-100 border border-solid rounded-md flex flex-col transition-all duration-200 ease-in-out cursor-pointer hover:shadow-lg')}>
      <div className='flex pt-[14px] px-[14px] pb-3 h-[80px] items-center gap-3 grow-0 shrink-0'>
        <div className='relative shrink-0'>
          <AppIcon
            size='xxl'
            iconType={appBasicInfo.icon_type}
            icon={appBasicInfo.icon}
            background={appBasicInfo.icon_background}
            imageUrl={appBasicInfo.icon_url}
          />
          <span className='absolute bottom-[-3px] right-[-3px] w-4 h-4 p-0.5 bg-white rounded border-[0.5px] border-[rgba(0,0,0,0.02)] shadow-sm'>
            {appBasicInfo.mode === 'advanced-chat' && (
              <ChatBot className='w-3 h-3 text-[#1570EF]' />
            )}
            {appBasicInfo.mode === 'agent-chat' && (
              <CuteRobot className='w-3 h-3 text-indigo-600' />
            )}
            {appBasicInfo.mode === 'chat' && (
              <ChatBot className='w-3 h-3 text-[#1570EF]' />
            )}
            {appBasicInfo.mode === 'completion' && (
              <AiText className='w-3 h-3 text-[#0E9384]' />
            )}
            {appBasicInfo.mode === 'workflow' && (
              <Route className='w-3 h-3 text-[#f79009]' />
            )}
          </span>
        </div>
        <div className='grow w-0 py-[1px]'>
          {/* <div className='flex items-center text-sm leading-5 font-semibold text-text-secondary'>
            <div className='truncate text-lg text-black' title={appBasicInfo.name}>{appBasicInfo.name}</div>
          </div> */}
          <div className='flex items-center justify-end text-gray-800 leading-[18px] text-sm font-light'>
            ❤️ {(Math.floor(Math.random() * 2000000) + 1).toLocaleString('en-US')}
            {/* {appBasicInfo.mode === 'advanced-chat' && <div className='truncate'>@{t('app.types.advanced').toUpperCase()}</div>}
            {appBasicInfo.mode === 'chat' && <div className='truncate'>@{t('app.types.chatbot').toUpperCase()}</div>}
            {appBasicInfo.mode === 'agent-chat' && <div className='truncate'>@{t('app.types.agent').toUpperCase()}</div>}
            {appBasicInfo.mode === 'workflow' && <div className='truncate'>@{t('app.types.workflow').toUpperCase()}</div>}
            {appBasicInfo.mode === 'completion' && <div className='truncate'>@{t('app.types.completion').toUpperCase()}</div>} */}
          </div>
        </div>
      </div>
      <div className="description-wrapper h-[105px] px-[14px] text-sm leading-normal text-text-tertiary ">
        <div className=' mb-2 font-bold text-base  text-gray-800'>
          {appBasicInfo.name}
        </div>
        <div className='line-clamp-3'>
          {app.description}
        </div>
      </div>
      <div className='px-[14px]'>
        <hr className='bg-gray-200' />
      </div>
      <div className='px-[14px] mt-2 flex flex-row text-sm text-text-tertiary gap-4'>
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
        <div className={cn('hidden justify-center items-center flex-row gap-2 min-h-[42px] px-[14px] pt-2 pb-[10px] bg-white group-hover:flex absolute bottom-0 left-0 right-0')}>
          <div className={cn('flex items-center w-2/5 space-x-2 ')}>
            <Button variant='primary' className='grow h-8' onClick={() => onCreate()}>
              <PlusIcon className='w-4 h-4 mr-1' />
              <span className='text-xs'>{t('explore.appCard.addToWorkspace')}</span>
            </Button>
          </div>
          <div className={cn('flex items-center w-3/5 space-x-2 ')}>
            <Button variant='tertiary' className='grow h-8' onClick={() => onCreate()}>
              <PlusIcon className='w-4 h-4 mr-1' />
              <span className='text-xs'>{t('app.newApp.useTemplate')}</span>
            </Button>
          </div>
        </div>
      )}
      {!isExplore && (
        <div className={cn('hidden items-center flex-wrap min-h-[42px] px-[14px] pt-2 pb-[10px] bg-white group-hover:flex absolute bottom-0 left-0 right-0')}>
          <div className={cn('flex items-center w-full space-x-2')}>
            <Button variant='primary' className='grow h-7' onClick={() => onCreate()}>
              <PlusIcon className='w-4 h-4 mr-1' />
              <span className='text-xs'>{t('app.newApp.useTemplate')}</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export default AppCard
