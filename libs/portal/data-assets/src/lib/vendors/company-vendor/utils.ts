interface Category {
  name?: string
  apiId?: string
}

export const parseCategory = (category?: Category) => ({
  name: category?.name,
  id: category?.apiId
})
