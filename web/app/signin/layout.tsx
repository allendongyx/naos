import Header from './_header'
import style from './page.module.css'

import cn from '@/utils/classnames'

export default async function SignInLayout({ children }: any) {
  const tags = ['Agent', 'Workflow', 'Web3', 'Deepseek']
  return <>
    <div className={cn(
      style.background,
      'flex w-full min-h-screen',
      // 'sm:p-4 lg:p-8',
      // 'gap-x-20',
      'justify-center lg:justify-start',
    )}>
      <div className={
        cn(
          'flex w-full flex-col bg-white shadow rounded-2xl shrink-0',
          'space-between',
          style.signBackground,
        )
      }>
        <Header />
        <div className={
          cn(
            'flex flex-row items-center w-full grow justify-center gap-20',
            ' px-56',
          )
        }>
          <div className=' w-1/2'>
            <div className=' h-12 text-4xl font-bold'>
              Naos
            </div>
            <div className=' text-2xl font-light'>
              Web3 时代的 AI 平台
            </div>
            <div className='mt-4 flex-row flex gap-4'>
              {
                tags.map((item, index) => {
                  return <div key={index} className='border border-solid text-gray-700 font-normal px-4 py-2 border-gray-600 flex justify-center items-center'>
                    {item}
                  </div>
                })
              }
            </div>
            <div className='mt-6'>
              <div className='bg-primary-500 px-4 py-2 flex-initial inline text-white text-sm font-normal'>😄 即刻创建你的 AI Agent</div>
            </div>
            <div className='mt-6 '>
              <img className='shadow-2xl shadow-primary-400 border-solid rounded-xl border border-transparent' alt='bg' src='/imgs/feature-1.jpeg' />
            </div>
          </div>
          <div className='flex flex-col bg-white shadow-xl rounded-3xl px-20 mx-20 pt-10 pb-10 w-1/2'>
            {children}
          </div>
        </div>
        <div className='px-8 py-6 system-xs-regular text-text-tertiary'>
          © {new Date().getFullYear()} Naos
        </div>
      </div>
    </div>
  </>
}
