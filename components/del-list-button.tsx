import { idb } from '@/lib/idb'
import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useState } from 'react'

export function DelListButton() {
  const [isOpen, setIsOpen] = useState(false)
  const openModal = () => setIsOpen(true)
  const closeModal = () => setIsOpen(false)

  const handleDelList = async () => {
    await idb.itemsList.clear()
    closeModal()
  }

  return (
    <>
      <button
        type="button"
        onClick={openModal}
        className="bg-sl-bg text-sl-margin border border-sl-margin p-1 uppercase rounded-md"
      >
        Supprimer la liste
      </button>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded bg-sl-bg border border-sl-row p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-sl-text"
                  >
                    Supprimer la liste
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Vous êtes sur le point de supprimer la liste. Cette action
                      est irréversible.
                    </p>
                  </div>

                  <div className="flex justify-between mt-3">
                    <button
                      type="button"
                      className="bg-sl-bg text-sl-margin border border-sl-margin p-1 uppercase rounded-md"
                      onClick={handleDelList}
                    >
                      Supprimer
                    </button>
                    <button
                      type="button"
                      className="bg-sl-bg text-sl-text border border-sl-tile p-1 uppercase rounded-md"
                      onClick={closeModal}
                    >
                      Annuler
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}
