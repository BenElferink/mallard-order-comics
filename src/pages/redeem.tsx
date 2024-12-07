import Link from 'next/link'
import { Antonio, Imbue, Inter } from 'next/font/google'
import { ChangeEventHandler, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { useData } from '@/contexts/DataContext'
import getSerialStringFromSerialNumber from '@/functions/getSerialStringFromSerialNumber'
import DiscordIcon from '@/icons/Discord'
import { LINKS } from '@/constants'

const inter = Inter({ weight: '300', subsets: ['latin'] })
const interBold = Inter({ weight: '900', subsets: ['latin'] })
const imbue = Imbue({ weight: '300', subsets: ['latin'] })
const antonio = Antonio({ weight: '300', subsets: ['latin'] })

const Page = () => {
  const { populatedWallet } = useData()

  const availableForClaim = useMemo(() => populatedWallet?.tokens.filter((token) => !token.isClaimed), [populatedWallet])

  const [startedJourney, setStartedJourney] = useState(false)
  const [confirmedSelections, setConfirmedSelections] = useState(false)
  const [finishedForm, setFinishedForm] = useState(false)

  const [selectedSerials, setSelectedSerials] = useState<number[]>([])
  const [formData, setFormData] = useState<Record<string, string>>({})

  const handleChangeFormData: ChangeEventHandler<HTMLInputElement> = (e) => {
    const {
      target: { name, value },
    } = e

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const [loading, setLoading] = useState(false)

  const submitOrder = async () => {
    setLoading(true)

    toast.error('COMING SOON')

    // setLoading(false)
  }

  return (
    <main className='min-h-screen px-4 flex flex-col items-center'>
      {finishedForm ? (
        <div className={`max-w-[750px] w-full p-8 sm:p-12 text-center rounded-lg border border-sky-500 bg-stone-950 ${antonio.className}`}>
          <p className={`mb-10 sm:mb-20 text-4xl sm:text-5xl ${imbue.className}`}>ISSUE ONE COMICS ELIGIBLE FOR REDEMPTION</p>

          <p className={`text-sm ${inter.className}`}>
            YOU ARE CLAIMING <strong className={interBold.className}>{selectedSerials.length}</strong>{' '}
            {selectedSerials.length > 1 ? 'COPIES' : 'COPY'} TO BE SENT TO:
            <br />
            <br />
            {formData['address']}
            <br />
            {formData['cityName']}, {formData['cityCode']} {formData['zipCode']}
            <br />
            {formData['countryName']}
          </p>

          <div className='mt-4 sm:mt-8 flex flex-wrap items-center justify-center text-xl'>
            {selectedSerials.map((serial) => (
              <div key={serial} className='m-1 sm:m-2 py-2 px-6 sm:py-4 sm:px-12 rounded-lg border bg-red-800'>
                {getSerialStringFromSerialNumber(serial)}
              </div>
            ))}
          </div>

          <div className='mt-4 sm:mt-8 flex items-center justify-end'>
            <button
              type='button'
              disabled={loading}
              onClick={() => setFinishedForm(false)}
              className='w-[140px] mx-1 py-2 text-xl text-center bg-cyan-700 disabled:opacity-40 disabled:cursor-not-allowed'
            >
              EDIT ADDRESS
            </button>
            <button
              type='button'
              disabled={loading}
              onClick={() => {
                setSelectedSerials([])
                setFormData({})
                setConfirmedSelections(false)
                setFinishedForm(false)
              }}
              className='w-[140px] mx-1 py-2 text-xl text-center bg-sky-900 disabled:opacity-40 disabled:cursor-not-allowed'
            >
              START OVER
            </button>
          </div>

          <button
            type='button'
            disabled={loading}
            onClick={submitOrder}
            className='mt-10 sm:mt-20 py-2 px-6 sm:py-4 sm:px-12 text-xl rounded-lg border border-transparent bg-red-900 disabled:opacity-40 disabled:cursor-not-allowed'
          >
            SUBMIT ORDER
          </button>
        </div>
      ) : confirmedSelections ? (
        <div className='max-w-[750px] w-full p-8 sm:p-12 text-center rounded-lg border border-sky-500 bg-stone-950'>
          <p className={`text-4xl sm:text-5xl ${imbue.className}`}>WHERE DO WE SEND YOUR COMIC?</p>

          <p className='my-10'>
            ALL PERSONAL DATA IS HANDLED BY STANDARD ENCRYPTION PROTOCOLS AND A CRYPTOGRAPHIC VERIFICATION TO CONFIRM ELIGIBILITY FOR PHYSICAL CLAIM
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault()
              setFinishedForm(true)
            }}
            className='w-4/5 mx-auto flex flex-col items-center'
          >
            <div className='w-full my-4 flex flex-col items-start'>
              <label htmlFor='firstName' className='mb-2'>
                FIRST NAME *
              </label>
              <input
                id='firstName'
                name='firstName'
                autoComplete='given-name'
                required
                value={formData['firstName'] || ''}
                onChange={handleChangeFormData}
                className='w-full p-2 rounded-lg border bg-stone-950'
              />
            </div>

            <div className='w-full my-4 flex flex-col items-start'>
              <label htmlFor='firstName' className='mb-2'>
                LAST NAME *
              </label>
              <input
                id='lastName'
                name='lastName'
                autoComplete='family-name'
                required
                value={formData['lastName'] || ''}
                onChange={handleChangeFormData}
                className='w-full p-2 rounded-lg border bg-stone-950'
              />
            </div>

            <div className='w-[120%] my-12 h-[1px] rounded-full bg-sky-500' />

            <div className='w-full my-4 flex flex-col items-start'>
              <label htmlFor='address' className='mb-2'>
                ADDRESS *
              </label>
              <input
                id='address'
                name='address'
                autoComplete='shipping street-address'
                required
                value={formData['address'] || ''}
                onChange={handleChangeFormData}
                className='w-full p-2 rounded-lg border bg-stone-950'
              />
            </div>

            <div className='w-full my-4 flex flex-col items-start'>
              <label htmlFor='cityName' className='mb-2'>
                CITY *
              </label>
              <input
                id='cityName'
                name='cityName'
                autoComplete='home city'
                required
                value={formData['cityName'] || ''}
                onChange={handleChangeFormData}
                className='w-full p-2 rounded-lg border bg-stone-950'
              />
            </div>

            <div className='w-full my-4 flex justify-between'>
              <div className='w-[60%] flex flex-col items-start'>
                <label htmlFor='countryCode' className='mb-2'>
                  STATE/PROVINCE/REGION *
                </label>
                <input
                  id='countryCode'
                  name='countryCode'
                  autoComplete='country'
                  required
                  value={formData['countryCode'] || ''}
                  onChange={handleChangeFormData}
                  className='w-full p-2 rounded-lg border bg-stone-950'
                />
              </div>

              <div className='w-[35%] flex flex-col items-start'>
                <label htmlFor='zipCode' className='mb-2'>
                  ZIP/POSTAL CODE *
                </label>
                <input
                  id='zipCode'
                  name='zipCode'
                  autoComplete='postal-code'
                  required
                  value={formData['zipCode'] || ''}
                  onChange={handleChangeFormData}
                  className='w-full p-2 rounded-lg border bg-stone-950'
                />
              </div>
            </div>

            <div className='w-full my-4 flex flex-col items-start'>
              <label htmlFor='countryName' className='mb-2'>
                COUNTRY *
              </label>
              <input
                id='countryName'
                name='countryName'
                autoComplete='country-name'
                required
                value={formData['countryName'] || ''}
                onChange={handleChangeFormData}
                className='w-full p-2 rounded-lg border bg-stone-950'
              />
            </div>

            <div className='w-[120%] my-12 h-[1px] rounded-full bg-sky-500' />

            <div className='w-full my-4 flex flex-col items-start'>
              <label htmlFor='email' className='mb-2'>
                E-MAIL *
              </label>
              <input
                id='email'
                name='email'
                autoComplete='email'
                required
                value={formData['email'] || ''}
                onChange={handleChangeFormData}
                className='w-full p-2 rounded-lg border bg-stone-950'
              />
            </div>

            <div className='w-full my-4 flex flex-col items-start'>
              <label htmlFor='phoneNumber' className='mb-2'>
                PHONE NUMBER *
              </label>
              <input
                id='phoneNumber'
                name='phoneNumber'
                autoComplete='tel'
                required
                value={formData['phoneNumber'] || ''}
                onChange={handleChangeFormData}
                className='w-full p-2 rounded-lg border bg-stone-950'
              />
            </div>

            <div className='w-full my-4 flex flex-col items-start'>
              <label htmlFor='xHandle' className='mb-2'>
                X/TWITTER HANDLE (OPTIONAL)
              </label>
              <input
                id='xHandle'
                name='xHandle'
                value={formData['xHandle'] || ''}
                onChange={handleChangeFormData}
                className='w-full p-2 rounded-lg border bg-stone-950'
              />
            </div>

            <button type='submit' className='mt-4 sm:mt-8 py-2 px-6 sm:py-4 sm:px-12 text-xl rounded-lg border border-transparent bg-red-900'>
              REVIEW & CONFIRM
            </button>
          </form>
        </div>
      ) : (
        <div className={`max-w-[750px] w-full p-8 sm:p-12 text-center rounded-lg border border-sky-500 bg-stone-950 ${antonio.className}`}>
          <p className={`text-4xl sm:text-5xl ${imbue.className}`}>ISSUE ONE COMICS ELIGIBLE FOR REDEMPTION</p>

          <div className='mt-4 sm:mt-8 text-xl'>
            {!availableForClaim?.length
              ? 'NONE'
              : availableForClaim.map((token) => {
                  const isSelected = selectedSerials.find((num) => num === token.serialNumber)

                  return (
                    <button
                      key={token.tokenId}
                      type='button'
                      disabled={!startedJourney}
                      onClick={() =>
                        setSelectedSerials((prev) => {
                          const payload = [...prev]
                          const idx = payload.findIndex((num) => num === token.serialNumber)

                          if (idx !== -1) {
                            payload.splice(idx, 1)
                          } else {
                            payload.push(token.serialNumber)
                          }

                          return payload
                        })
                      }
                      className={
                        `m-1 sm:m-2 py-2 px-6 sm:py-4 sm:px-12 rounded-lg border ` +
                        (isSelected ? 'border-transparent bg-red-800' : 'border-white disabled:border-transparent bg-zinc-950 disabled:bg-sky-800')
                      }
                    >
                      {getSerialStringFromSerialNumber(token.serialNumber)}
                    </button>
                  )
                })}
          </div>

          {startedJourney ? (
            <button
              type='button'
              disabled={!selectedSerials.length}
              onClick={() => setConfirmedSelections(true)}
              className='mt-4 sm:mt-8 py-2 px-6 sm:py-4 sm:px-12 text-xl rounded-lg border border-transparent bg-red-900 disabled:opacity-40 disabled:cursor-not-allowed'
            >
              SUBMIT SELECTION
            </button>
          ) : (
            <button
              type='button'
              disabled={!availableForClaim?.length}
              onClick={() => setStartedJourney(true)}
              className='mt-4 sm:mt-8 py-2 px-6 sm:py-4 sm:px-12 text-xl rounded-lg border border-transparent bg-red-900 disabled:opacity-40 disabled:cursor-not-allowed'
            >
              PROCEED
            </button>
          )}
        </div>
      )}

      <div className={`my-20 sm:my-40 flex flex-col items-center ${antonio.className}`}>
        <p className={`mb-4 text-3xl sm:text-4xl ${imbue.className}`}>NEED SUPPORT? OPEN A TICKET.</p>

        <Link
          href={LINKS['DISCORD']}
          target='_blank'
          rel='noopener noreferrer'
          className='w-[250px] h-[150px] p-8 rounded-lg flex flex-col items-center justify-center bg-gradient-to-b from-[#1C3D55] to-[#101010]'
        >
          <div className='w-14 h-14 p-1.5 flex items-center justify-center rounded-full bg-sky-500'>
            <DiscordIcon className='w-14 h-14 fill-[#101010]' />
          </div>

          <span className='mt-2 text-xl'>DISCORD</span>
        </Link>
      </div>
    </main>
  )
}

export default Page
