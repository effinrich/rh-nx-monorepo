import { Locator, Page } from '@playwright/test'

export class Accordion {
  readonly elem: Locator
  readonly label: Locator
  readonly button: Locator
  readonly contents: Locator

  constructor(elem: Locator) {
    this.elem = elem
    this.button = this.elem.locator('button')
    this.contents = this.elem.locator('.chakra-accordion__panel')
  }
  async isExpanded() {
    return (await this.button.getAttribute('aria-expanded')) == 'true'
  }
}
export class ChakraAlert {
  readonly page: Page
  readonly wrapper: Locator
  readonly title: Locator
  readonly description: Locator

  constructor(page: Page) {
    this.page = page
    this.wrapper = this.page.locator('.chakra-alert')
    this.title = this.wrapper.locator('.chakra-alert__title')
    this.description = this.wrapper.locator('.chakra-alert__desc')
  }
}
export class ChakraCheckbox {
  readonly page: Page
  readonly wrapper: Locator
  readonly input: Locator
  readonly label: Locator

  constructor(page: Page) {
    this.page = page
    this.wrapper = this.page.locator('.chakra-checkbox')
    this.input = this.page.locator('.chakra-checkbox__input')
    this.label = this.page.locator('.chakra-checkbox__label')
  }
}

export class ChakraCheckboxGroup {
  readonly elem: Locator
  readonly options: Locator
  readonly wrapper: Locator

  constructor(elem: Locator) {
    this.elem = elem
    this.options = this.elem.locator('.chakra-checkbox')
  }
}
type FormControl =
  | ChakraAlert
  | ChakraCheckbox
  | ChakraCheckboxGroup
  | ChakraRadioButton
  | ChakraRadioButtonGroup
  | CheckboxGroup
  | FileUploader
  | MultiSelect
  | Searchbox
  | Select
  | SingleSelect
  | Textarea
  | Textbox

export class ChakraFormControl {
  private wrapper: Locator
  readonly control
  readonly label?: Locator
  readonly errors?: Locator

  constructor(props: {
    locator: Locator
    control: FormControl
    label?: string
  }) {
    this.wrapper = props.locator
    this.label = this.wrapper.locator('label')
    this.errors = this.wrapper.locator('.chakra-form__error-message')
    this.control = props.control
  }
}

export class ChakraRadioButton {
  readonly wrapper: Locator
  readonly input: Locator
  readonly label: Locator

  constructor(wrapper: Locator) {
    this.wrapper = wrapper
    this.input = this.wrapper.locator('input')
    this.label = this.wrapper.locator('label')
  }
  async click() {
    await this.wrapper.click()
  }
  async isChecked() {
    return (await this.wrapper.getAttribute('data-checked')) != null
  }
  async value() {
    return await this.input.getAttribute('value')
  }
}

export class ChakraRadioButtonGroup {
  readonly elem: Locator
  readonly options: Locator
  readonly selectedOption: Locator

  constructor(elem: Locator) {
    this.elem = elem
    this.options = this.elem.locator('.chakra-radio__label')
    this.selectedOption = this.elem.locator('label[data-checked] input')
  }

  async select(value: string) {
    await this.elem.getByText(value, { exact: true }).click()
  }
  async selected() {
    if ((await this.selectedOption.count()) > 0) {
      return await this.selectedOption.getAttribute('value')
    } else {
      return null
    }
  }
}

export class CheckboxGroup {
  readonly wrapper: Locator
  readonly checked: Locator

  constructor(wrapper) {
    this.wrapper = wrapper
    this.checked = this.wrapper.locator('label[data-checked]')
  }

  async check(options: string[]) {
    for (const option of options) {
      await this.wrapper.getByText(option).click()
    }
  }
  async allChecked() {
    const allCheckedBoxes = await this.checked.all()
    let labels = []
    for (let i = 0; i < allCheckedBoxes.length; i++) {
      labels.push(await allCheckedBoxes[i].textContent())
    }
    return labels
  }
  async countChecked() {
    return (await this.checked.all()).length
  }
}

export class DrawerForm {
  readonly page: Page
  readonly modal: Locator
  readonly heading: Locator
  readonly subheading: Locator
  readonly xcloseBtn: Locator

  constructor(page: Page) {
    this.page = page
    this.modal = this.page.locator('.chakra-modal__content')
    this.heading = this.modal.locator('p').first()
    this.subheading = this.modal.locator('p:nth-of-type(2)').first()
    this.xcloseBtn = this.modal.getByRole('button', { name: 'close form' })
  }
}

export class FileUploader {
  private page: Page
  readonly wrapper: Locator
  readonly triggerLabel: string

  constructor(props: { page: Page; wrapper: Locator; triggerLabel: string }) {
    this.page = props.page
    this.wrapper = props.wrapper
    this.triggerLabel = props.triggerLabel
  }

  async upload(files: { href: string }[]) {
    let [fileChooser] = await Promise.all([
      this.page.waitForEvent('filechooser'),
      await this.page.getByRole('button', { name: this.triggerLabel }).click()
    ])
    const paths = files.map(a => a.href)
    await fileChooser.setFiles(paths)
  }
}

export class MultiSelect {
  readonly wrapper: Locator
  readonly input: Locator
  readonly icon: Locator
  readonly optionsList: Locator

  constructor(wrapper: Locator) {
    this.wrapper = wrapper
    this.input = this.wrapper.locator('div div input').nth(0)
    this.icon = this.wrapper.locator('svg')
    this.optionsList = this.wrapper
      .locator('[id$="listbox"]')
      .locator('[role="button"]')
  }
  async allSelected() {
    const selectedElements = await this.wrapper.locator('.css-1h8gyx6').all()
    let labels = []
    for (let i = 0; i < selectedElements.length; i++) {
      labels.push(await selectedElements[i].textContent())
    }
    return labels
  }

  async select(options: string[]) {
    for (const option of options) {
      await this.wrapper.getByRole('combobox').click()
      await this.wrapper
        .getByRole('option', { name: option, exact: true })
        .click()
    }
  }

  async clearAll() {
    await this.wrapper.getByLabel('Clear selected options').click()
  }
}

export class Searchbox {
  readonly page: Page
  readonly wrapper: Locator
  readonly inputWrapper: Locator
  readonly inputTB: Locator
  readonly optionsLB: Locator

  constructor(page: Page, wrapper: Locator) {
    this.page = page
    this.wrapper = wrapper
    this.inputWrapper = wrapper.locator('[data-value]')
    this.inputTB = this.inputWrapper.getByRole('combobox')
    this.optionsLB = wrapper.locator('#react-select-2-listbox')
  }
}

export class Select {
  readonly wrapper: Locator
  readonly select: Locator
  readonly icon: Locator
  readonly optionsList: Locator

  constructor(wrapper: Locator) {
    this.wrapper = wrapper
    this.select = this.wrapper.locator('select')
    this.icon = this.wrapper.locator('svg')
    this.optionsList = this.wrapper.getByRole('option')
  }
}

export class SingleSelect {
  private wrapper: Locator
  private selectedOption: Locator

  constructor(wrapper: Locator) {
    this.wrapper = wrapper
    this.selectedOption = this.wrapper.locator('.css-1xa1gs2')
  }
  async open() {
    await this.wrapper.getByRole('combobox').click()
  }
  async option(value) {
    await this.wrapper.getByRole('combobox').click()
    return this.wrapper.getByRole('option', { name: value })
  }
  async select(value, exact = false) {
    await this.open()
    await this.wrapper
      .getByRole('option', { name: value, exact: exact })
      .click()
  }
  async selected() {
    if ((await this.selectedOption.count()) > 0) {
      return await this.selectedOption.textContent()
    } else {
      return null
    }
  }
}

export class Textarea {
  private wrapper: Locator
  readonly textbox: Locator

  constructor(wrapper: Locator) {
    this.wrapper = wrapper
    this.textbox = this.wrapper.getByRole('textbox')
  }

  async fill(value: string) {
    await this.textbox.fill(value)
  }
  async textContent() {
    return await this.textbox.textContent()
  }
}

export class Textbox {
  private wrapper: Locator
  readonly input: Locator

  constructor(wrapper: Locator) {
    this.wrapper = wrapper
    this.input = this.wrapper.locator('input')
  }

  async fill(value: string) {
    await this.input.fill(value)
  }
  async textContent() {
    let textContent = await this.input.textContent()
    if (textContent.length == 0) {
      textContent = await this.input.getAttribute('value')
    }
    return textContent
  }
}
