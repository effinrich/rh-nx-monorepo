import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { useNavigate } from 'react-router-dom'
import { useLocalStorage } from 'react-use'
import { axiosApi, CompanyApiEnum } from '@redesignhealth/portal/data-assets'
import {
  DisclaimerBox,
  DisclaimerModal,
  DisclaimerText,
  Page
} from '@redesignhealth/portal/ui'
import {
  Box,
  Button,
  FormControl,
  HStack,
  ListItem,
  SectionHeader,
  Text,
  UnorderedList,
  VStack
} from '@redesignhealth/ui'
import { AsyncSelect, OptionBase } from 'chakra-react-select'

import { Results } from '../library/results/results'

import { Category, useDevCategoryStore, VIEW_ALL_CATEGORY } from './store'

export interface Doc {
  type: CompanyApiEnum
  title: string
  id: string
  category: string
  description: string
}

interface Option extends OptionBase {
  label: string
  value: string
  title: string
  id: string
  parentId: string
}

interface LibraryProps {
  libraryId: string
  libraryRoute: string
}

const UNKNOWN_CATEGORY = { title: 'Unknown', id: 'UNKNOWN' }

export const DevLibrary = ({ libraryId, libraryRoute }: LibraryProps) => {
  const navigate = useNavigate()
  const [docs, setDocs] = useState<Doc[]>([])
  const [categories, setCategories] = useState<Array<Category>>([
    VIEW_ALL_CATEGORY
  ])

  const [isFirstVisit, setIsFirstVisit] = useLocalStorage(
    'library-first-visit',
    true
  )

  const selectedDevCategory = useDevCategoryStore(
    state => state.selectedDevCategory
  )
  const setSelectedDevCategory = useDevCategoryStore(
    state => state.setSelectedDevCategory
  )

  useEffect(() => {
    return () => {
      if (isFirstVisit) setIsFirstVisit(false)
    }
  }, [isFirstVisit, setIsFirstVisit])

  useEffect(() => {
    axiosApi
      .get(`library/${libraryId}/content?page=0&size=1000&filter=type,CATEGORY`)
      .then(response => {
        const content: Category[] = response.data.content
        if (content) {
          const newCategories = [
            VIEW_ALL_CATEGORY,
            ...new Set<Category>(
              // TODO filter is a hack for a backend bug Kyle is working 5/12
              content
                .filter(record => {
                  const { type } = record
                  return type?.value === 'CATEGORY'
                })
                .map(record => {
                  const { id, title } = record
                  if (id && title) {
                    return { id, title }
                  }
                  return UNKNOWN_CATEGORY
                })
            )
          ]
          setCategories(newCategories)
        }
        return content
      })
  }, [libraryId])

  useEffect(() => {
    if (selectedDevCategory.id === VIEW_ALL_CATEGORY.id) {
      return
    }

    axiosApi
      .get(`library-content/${selectedDevCategory.id}?expand=children`)
      .then(response => {
        const responseDocs: Doc[] = response.data.children || []
        const newDocs = responseDocs
          .filter(record => record.type && record.type.value === 'SOLUTION')
          .map(record => {
            return {
              title: record.title || 'BUG - Title Undetermined',
              id: record.id || 'BUG',
              category: selectedDevCategory.title,
              description:
                record.description || 'BUG - Description Undetermined',
              type: record.type
            }
          })
          .sort((a, b) => a.title.localeCompare(b.title))
        return setDocs(newDocs || [])
      })
  }, [selectedDevCategory.id, selectedDevCategory.title])

  const handleAsyncSearch = async (query: string) => {
    const { data } = await axiosApi.get(
      `/library/${libraryId}/content?q=${query}&filter=type%2CTEMPLATE%7C%7CARTICLE%7C%7CVIDEO%7C%7CTOOL`
    )

    return data.content
  }

  const onChange = (option: Option | null) => {
    navigate(`/${libraryRoute}/${option?.parentId}/module/${option?.id}`)
  }

  return (
    <Page>
      <Helmet>
        <title>Dev Library</title>
      </Helmet>
      <DisclaimerModal header="Disclaimer" buttonText="Got it">
        <DisclaimerText />
      </DisclaimerModal>
      <SectionHeader title="Developer Tools" />

      <HStack align="top" spacing={8} py={8} w="full">
        <UnorderedList spacing={2} listStyleType="none" m={0} pt={3}>
          <ListItem>
            <FormControl pb={6}>
              <AsyncSelect
                cacheOptions
                isMulti={false}
                name="search"
                colorScheme="primary"
                closeMenuOnSelect={true}
                size="md"
                placeholder="Search"
                loadOptions={handleAsyncSearch}
                onChange={onChange}
                blurInputOnSelect={true}
                getOptionLabel={(option: Option) => `${option.title}`}
                getOptionValue={(option: Option) => `${option.id}`}
              />
            </FormControl>
          </ListItem>
          <Text fontWeight="medium" fontSize="xs" color="gray.500">
            CATEGORIES
          </Text>

          {categories
            .filter(cat => cat.id !== VIEW_ALL_CATEGORY.id)
            .map(cat => {
              return (
                <ListItem
                  key={cat.id}
                  fontWeight={selectedDevCategory.id === cat.id ? 'bold' : ''}
                >
                  <Button
                    onClick={() => setSelectedDevCategory(cat)}
                    variant={
                      selectedDevCategory.id === cat.id
                        ? 'primary-on-accent'
                        : 'ghost-on-accent'
                    }
                    fontSize="14px"
                    fontWeight="medium"
                  >
                    <Text noOfLines={1}>{cat.title}</Text>
                  </Button>
                </ListItem>
              )
            })}
        </UnorderedList>
        <VStack>
          <DisclaimerBox
            isFirstVisit={isFirstVisit}
            onClickAlert={() => setIsFirstVisit(false)}
            title="Disclaimer"
          >
            <DisclaimerText />
          </DisclaimerBox>
          <Results docs={docs} libraryRoute={libraryRoute} />
        </VStack>
      </HStack>
    </Page>
  )
}
