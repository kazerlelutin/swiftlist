import { idb } from '@/lib/idb'
import { useLiveQuery } from 'dexie-react-hooks'
import { ListItemLine, SectionPercent } from '@/components'
import { Disclosure } from '@headlessui/react'
import { ChevronUpIcon } from '@heroicons/react/20/solid'
import { useMemo } from 'react'

export function Sections() {
  const items = useLiveQuery(async () => await idb.itemsList.toArray())
  const sections = useLiveQuery(async () => await idb.sections.toArray())
  const availableSubSections = useMemo(() => {
    if (!items || !sections) return []
    const subSections = sections?.filter((section) => !!section.parentId)
    return subSections?.filter((subSection) => {
      return !!items?.find((item) => item.sectionId === subSection.id)
    })
  }, [items, sections])

  const availableSections = useMemo(() => {
    if (!items || !sections) return []
    const parentSection = sections?.filter((section) => !section.parentId)
    return parentSection?.filter((section) => {
      return !!availableSubSections?.find(
        (subSection) => subSection.parentId === section.id
      )
    })
  }, [items, sections, availableSubSections])

  return (
    <div className="flex flex-col text-sl-text">
      {availableSections?.map((section) => (
        <Disclosure key={section.id} defaultOpen>
          {({ open }) => (
            <>
              <Disclosure.Button className="flex w-full justify-between py-2 mt-5 text-left font-medium  focus:outline-none">
                <span className="px-2">
                  {section.icon} {section.name}
                  {!open && <SectionPercent sectionId={section.id} />}
                </span>
                <ChevronUpIcon
                  className={`${
                    open ? 'rotate-180 transform' : ''
                  } h-5 w-5 text-sl-text mr-2`}
                />
              </Disclosure.Button>
              <Disclosure.Panel className="pt-1 pb-2 text-sm border-sl-tile border-t m-0">
                {availableSubSections
                  ?.filter((subSection) => subSection.parentId === section.id)
                  .map((subSection) => (
                    <div
                      key={subSection.id}
                      className="flex flex-col gap-1 mt-3"
                    >
                      <div className="flex-1 italic border-b border-dashed border-sl-row">
                        <span className="pl-3 text-sl-margin">
                          {subSection.name}
                        </span>
                      </div>
                      <div className="flex flex-col gap-2 pt-2">
                        {items
                          ?.filter((item) => item.sectionId === subSection.id)
                          .map((item) => (
                            <ListItemLine
                              key={`${item.id}-${item.sectionId}`}
                              item={item}
                            />
                          ))}
                      </div>
                    </div>
                  ))}
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
      ))}
    </div>
  )
}
