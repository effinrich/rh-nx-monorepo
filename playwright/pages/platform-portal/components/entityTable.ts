import { Locator, Page } from '@playwright/test'

class TableFooter {
  readonly page: Page
  readonly previousBtn: Locator
  readonly pageNumberBtnLeft: Locator
  readonly pageNumberBtnRight: Locator
  readonly nextBtn: Locator

  constructor(page: Page) {
    this.page = page
    this.previousBtn = this.page.locator('')
    this.pageNumberBtnLeft = this.page.locator('')
    this.pageNumberBtnRight = this.page.locator('')
    this.nextBtn = this.page.locator('')
  }
}

// class PaginationControls {
//   clickPreviousBtn() {
//     this.footer.previousBtn.click()
//   }
//   clickLeftPageNumberBtn() {
//     this.footer.pageNumberBtnLeft.click()
//   }
//   clickRightPageNumberBtn() {
//     this.footer.pageNumberBtnRight.click()
//   }
//   clickNextBtn() {
//     this.footer.nextBtn.click()
//   }
// }

class Row {
  readonly row: Locator

  constructor(row: Locator) {
    this.row = row
  }
}

export class EntityTable {
  readonly table: Locator
  readonly headerRow: Locator
  readonly allHeaders: Locator
  readonly allRows: Locator

  constructor(tableLocator: Locator) {
    this.table = tableLocator
    this.headerRow = this.table.locator('thead')
    this.allHeaders = this.headerRow.locator('th')
    this.allRows = this.table.locator('tbody tr')
  }
}
