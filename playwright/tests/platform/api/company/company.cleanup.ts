import { expect, test } from '@playwright/test'
import { deleteCompany } from '../../../../utils/platform/company'
import { deletePerson } from '../../../../utils/platform/person'

test('Test CEO Cleanup', async ({ request }) => {
  const ceos = await request
    .get('/ceos?page=0&size=9999')
    .then(res => res.json())

  for (const d of ceos.content) {
    const resp = await request.delete(`/ceos/${d.id}`)
    if (resp.status() == 404) {
      await console.log('manually delete:', d.id)
    }
  }
})


test('Test Research Cleanup', async ({ request }) => {
  const docs = await request
    .get('/research?page=0&size=9999')
    .then(res => res.json())

  const toDelete = await docs.content.filter(d => {
    return d.title.match(/^Test:/)
  })

  for (const d of toDelete) {
    await console.log('deleting:', d.title)
    const resp = await request.delete(`/research/${d.id}`)
    await expect.soft(resp.status()).toBe(204)
  }
})

test('Test Company Cleanup', async ({ request }) => {
  const companies = await request
    .get('/company?page=0&size=9999')
    .then(res => res.json())

  const toDelete = await companies.content.filter(co => {
    return co.name.startsWith('Test:')
  })

  for (const co of toDelete) {
    await console.log('deleting:', co.name)
    const resp = await deleteCompany(request, co.id)
    await expect.soft(resp.status()).toBe(204)
  }
})

test('Test User Cleanup', async ({ request }) => {
  const users = await request
    .get('/person?page=0&size=9999')
    .then(res => res.json())

  const toDelete = await users.content.filter(u => {
    return u.email.match(/test_[0-9]{13}@email.test/)
  })

  for (const u of toDelete) {
    await console.log('deleting:', u.email)
    const resp = await deletePerson(request, u.email)
    await expect.soft(resp.status()).toBe(204)
  }
})
