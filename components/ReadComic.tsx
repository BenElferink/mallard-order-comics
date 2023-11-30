import { Fragment, useState } from 'react'
import Modal from './Modal'

const ReadComic = () => {
  const [openReader, setOpenReader] = useState(false)

  const toggleReader = () => setOpenReader((prev) => !prev)

  return (
    <Fragment>
      <button
        type='button'
        onClick={toggleReader}
        className='min-w-[200px] m-1 p-3 flex items-center justify-center rounded-full border border-sky-500 hover:border-neutral-50 focus:border-neutral-50 bg-transparent disabled:border-transparent disabled:opacity-50 disabled:cursor-not-allowed'
      >
        READ COMIC
      </button>

      <Modal open={openReader} onClose={toggleReader}>
        <iframe
          id='read-comic'
          allowFullScreen
          src='https://heyzine.com/flip-book/484669daa8.html'
          className='w-[85vw] h-[85vh] sm:w-[80vw] sm:h-[80vh] mt-6 rounded-xl'
        />
      </Modal>
    </Fragment>
  )
}

export default ReadComic
