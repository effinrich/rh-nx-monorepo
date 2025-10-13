import { Locator, Page } from '@playwright/test'
import { SearchPanel } from '../components/searchPanel'

export class CallNoteCard {
  readonly elem: Locator
  readonly header: Locator
  readonly title: Locator
  readonly subtitle: Locator
  readonly readNotesBtn: Locator
  readonly author: Locator
  readonly dateCreated: Locator
  readonly entityType: Locator
  readonly entityName: Locator
  readonly linkedIn: Locator
  readonly additionalTags: Locator
  readonly searchMatches: Locator
  readonly showMoreBtn: Locator
  readonly noteType: Locator
  readonly interviewSource: Locator
  readonly stakeholders: Locator
  readonly intervieweeEmail: Locator
  readonly taxonomy: Locator
  readonly showLessBtn: Locator

  constructor(wrapper: Locator) {
    this.elem = wrapper
    this.header = wrapper.locator('.chakra-card__header')
    this.title = this.header.locator('h3')
    this.subtitle = this.header.locator('h3 + div')
    this.readNotesBtn = this.header.getByRole('link', {
      name: 'Read notes',
      exact: true
    })
    this.entityType = wrapper.locator('li:nth-of-type(1) p')
    this.entityName = wrapper.locator('li:nth-of-type(1) p + div')
    this.linkedIn = wrapper.locator('li:nth-of-type(2) p + div')
    this.additionalTags = wrapper.locator('li:nth-of-type(3) p + div')
    this.searchMatches = wrapper.locator('li:nth-of-type(4) p + div')
    this.showMoreBtn = wrapper.getByRole('button', { name: 'Show more' })
    this.noteType = wrapper.locator('li:nth-of-type(5) p + div')
    this.interviewSource = wrapper.locator('li:nth-of-type(6) p + div')
    this.stakeholders = wrapper.locator('li:nth-of-type(7) p + div')
    this.intervieweeEmail = wrapper.locator('li:nth-of-type(8) p + div')
    this.taxonomy = wrapper.locator('li:nth-of-type(9) p')
    this.showLessBtn = wrapper.getByRole('button', { name: 'Show less' })
  }
}

export class CallNotesTab extends SearchPanel {
  readonly page: Page
  readonly allCardHeadings: Locator
  readonly allCardSubheadings: Locator
  readonly allCardEntityNames: Locator
  readonly allCardSearchMatches: Locator
  readonly allCardAdditionalTags: Locator
  readonly allCardStakeholders: Locator
  readonly allCardTaxonomies: Locator

  constructor(wrapper: Locator) {
    super(wrapper)
    this.allCardHeadings = this.wrapper.locator('.chakra-card__header h3')
    this.allCardSubheadings = this.wrapper.locator(
      '.chakra-card__header h3 + div'
    )
    this.allCardEntityNames = this.wrapper.getByRole('listitem', {
      name: 'OP_CO'
    })
    this.allCardSearchMatches = this.wrapper.getByRole('listitem', {
      name: 'Search matches'
    })
    this.allCardAdditionalTags = this.wrapper.getByRole('listitem', {
      name: 'Additonal tags'
    })
    this.allCardStakeholders = this.wrapper.getByRole('listitem', {
      name: 'Stakeholders'
    })
    this.allCardTaxonomies = this.wrapper.getByRole('listitem', {
      name: 'Taxonomies'
    })
  }

  async allCards() {
    let cards: CallNoteCard[] = []
    for (const card of await this.cards.all()) {
      cards.push(new CallNoteCard(card))
    }
    return cards
  }

  async filterNotes(field: string, term: string) {
    await this.wrapper.locator(`[data-testid=${field}] div`).first().click()
    await this.wrapper.locator(`[data-testid=${field}] input`).fill(term)
    await this.wrapper
      .locator(`[data-testid=${field}]`)
      .getByRole('option', { name: term, exact: true })
      .click()
  }
}
