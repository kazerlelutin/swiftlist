import { units } from '@/data'
import { ItemInput } from './item-input'
import { UnitSelector } from './unit-selector'
import { useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { idb } from '@/lib/idb'
import { Item } from '@prisma/client'
import { DelListButton } from './del-list-button'

const itemInitialState = {
  quantity: 1,
  unit: units[0],
  name: '',
}

export function ItemForm() {
  const [loading, setLoading] = useState(false)
  const subSections = useLiveQuery(async () => await idb.sections.toArray())
  const [item, setItem] = useState(itemInitialState)

  const abortAdd = () => {
    setItem(itemInitialState)
    setLoading(false)
    return true
  }
  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault()
    if (!item.name || loading) return

    //delete item immediately to reduce lag
    const itemToSend = { ...item }
    setItem(itemInitialState)

    const searchItem = await idb.items.get({ name: itemToSend.name })

    if (searchItem) {
      const findItem = await idb.itemsList.get({
        name: searchItem.name,
      })

      if (findItem) {
        await idb.itemsList.where({ name: findItem.name }).modify({
          quantity: itemToSend.quantity,
          unit: itemToSend.unit,
        })
      } else {
        await idb.itemsList.add({
          unit: itemToSend.unit,
          quantity: itemToSend.quantity,
          checked: false,
          ...searchItem,
        })
      }

      setItem(itemInitialState)
      return
    }

    // l'item n'existe pas en local, on le crée _______________________________________________________
    setLoading(true)

    const flatSections = subSections
      ?.filter((section) => !!section.parentId)
      .map((section) => section.name)
      .join('\n')

    if (!flatSections) return abortAdd()

    const createdItem = await fetch('/api/items', {
      method: 'POST',
      body: JSON.stringify({
        name: item.name,
      }),
    })

    const createdItemData: { item: Item } = await createdItem.json()

    if (!createdItemData?.item) return abortAdd()

    // on ajoute l'item en local _______________________________________________________
    const itemId = await idb.items.add({
      ...createdItemData.item,
      name: item.name,
    })

    if (!itemId) return abortAdd()
    const localItem = await idb.items.get(itemId)

    if (!localItem) return abortAdd()

    await idb.itemsList.add({
      unit: item.unit,
      quantity: item.quantity,
      checked: false,
      ...localItem,
    })

    setLoading(false)
  }

  return (
    <form className="flex flex-col gap-1 mb-4 px-3" onSubmit={handleSubmit}>
      <div className="grid grid-cols-[1fr_2fr] gap-1">
        <div className="cursor-default overflow-hidden border-sl-tile text-sl-text border rounded-sm mt-2 text-left focus:outline-none p-0  sm:text-sm">
          <input
            type="number"
            value={item.quantity}
            onChange={(e) =>
              setItem((prev) => ({
                ...prev,
                quantity: parseInt(e.target.value),
              }))
            }
            className="w-full border-none bg-transparent p-2 text-sm leading-5 focus:outline-none"
          />
        </div>
        <UnitSelector
          quantity={item.quantity}
          onChange={(unit) => setItem((prev) => ({ ...prev, unit }))}
        />
      </div>
      <ItemInput
        query={item.name}
        setQuery={(name) => setItem((prev) => ({ ...prev, name }))}
      />
      <div className="flex justify-between gap-1 mt-3">
        <DelListButton />
        <button
          type="submit"
          className="bg-sl-bg text-sl-text border border-sl-tile p-1 uppercase rounded-md"
        >
          {loading ? '...' : 'Ajouter'}
        </button>
      </div>
    </form>
  )
}
