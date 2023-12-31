import { Fragment, useState } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import { units } from '@/data'

interface UnitSelectorProps {
  onChange: (unit: string) => void
  quantity: number
}
export function UnitSelector({ onChange, quantity }: UnitSelectorProps) {
  const [selected, setSelected] = useState(units[0])

  const handleSelect = (unit: string) => {
    setSelected(unit)
    onChange(unit)
  }

  return (
    <Listbox value={selected} onChange={handleSelect}>
      <div className="relative ">
        <Listbox.Button className="relative w-full mt-2 text-sl-text cursor-default border-sl-tile border rounded-sm py-2 pl-3 pr-10 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-offset-2 sm:text-sm">
          <span className="block truncate">
            {selected}
            {quantity > 1 ? 's' : ''}
          </span>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <ChevronUpDownIcon
              className="h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
          </span>
        </Listbox.Button>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options className="absolute mt-1 -top-60 max-h-60 w-full overflow-auto border-sl-tile border bg-sl-bg py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm z-10">
            {units.map((unit) => (
              <Listbox.Option
                key={unit}
                className={({ active }) =>
                  `relative cursor-default select-none py-2 pl-10 pr-4 ${
                    active ? 'bg-sl-tile text-sl-bg' : 'text-sl-text'
                  }`
                }
                value={unit}
              >
                {({ selected }) => (
                  <>
                    <span
                      className={`block truncate ${
                        selected ? 'font-medium' : 'font-normal'
                      }`}
                    >
                      {`${unit}${quantity > 1 ? 's' : ''}`}
                    </span>
                    {selected ? (
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-sl-tile">
                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                      </span>
                    ) : null}
                  </>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  )
}
