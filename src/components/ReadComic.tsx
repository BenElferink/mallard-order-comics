import { Fragment, useState } from 'react'
import Modal from './Modal'

const ReadComic = ({ className }: { className: string }) => {
  const [openReader, setOpenReader] = useState(false)
  const toggleReader = () => setOpenReader((prev) => !prev)

  return (
    <Fragment>
      <button type='button' onClick={toggleReader} className={className}>
        READ COMIC
      </button>

      <Modal open={openReader} onClose={toggleReader}>
        <iframe
          id='read-comic'
          allowFullScreen
          src='https://heyzine.com/flip-book/484669daa8.html'
          className='w-[95vw] h-[95vh] sm:w-[80vw] sm:h-[80vh] mt-4 rounded-xl'
        />
      </Modal>
    </Fragment>
  )
}

export default ReadComic
