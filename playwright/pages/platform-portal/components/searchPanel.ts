import { Locator } from '@playwright/test'

export class SearchPanel {
  readonly wrapper: Locator
  private count: Locator
  readonly searchbox: Locator
  protected cards: Locator
  readonly loadingSpinner: Locator

  constructor(wrapper: Locator) {
    this.wrapper = wrapper
    this.searchbox = this.wrapper.getByRole('textbox', { name: 'Search' })
    this.count = this.wrapper.locator('p', {
      hasText: 'Results: '
    })
    this.cards = this.wrapper.locator('.chakra-card')
    this.loadingSpinner = this.wrapper
      .locator('div')
      .filter({ hasText: /^Loading\.\.\.$/ })
      .nth(1)
  }

  async resultsCount() {
    const str = await this.count.textContent()
    const i = str.indexOf(':')
    const subs = str.substring(i + 1)
    const num = Number(subs)
    return num
  }

  async search(term: string) {
    await this.searchbox.fill(term)
  }
}
