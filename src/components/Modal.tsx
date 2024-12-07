import { XMarkIcon } from '@heroicons/react/24/solid'
import type { PropsWithChildren } from 'react'

const Modal = (props: PropsWithChildren<{ open: boolean; onClose: () => void }>) => {
  const { children, open, onClose } = props

  return (
    <div
      className={
        (open ? 'block' : 'hidden') +
        ' w-screen h-screen flex items-center justify-center fixed top-0 left-0 z-50 bg-black bg-opacity-50 backdrop-blur-lg'
      }
    >
      {open ? (
        <section className='relative rounded-xl'>
          <div className='w-screen h-screen sm:w-fit sm:h-fit sm:max-w-[90vw] sm:max-h-[90vh] p-2 pt-8 sm:p-8 flex flex-col items-center sm:rounded-xl bg-neutral-950 sm:border overflow-y-auto'>
            <button className='w-6 h-6 rounded-full absolute top-2 right-4 z-10' onClick={onClose}>
              <XMarkIcon className='w-8 h-8 hover:animate-spin' />
            </button>

            {children}
          </div>
        </section>
      ) : null}
    </div>
  )
}

export default Modal