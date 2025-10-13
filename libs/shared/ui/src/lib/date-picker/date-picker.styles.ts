import styled from '@emotion/styled'

const StyledDatePicker = styled.div<{ themeColor: string }>`
  .react-datepicker-wrapper > input {
    width: 100% !important;
  }
  .react-datepicker__input-container input {
    width: 100% !important;
  }
  .react-datepicker__close-icon {
    right: 10px;

    &::after {
      cursor: pointer;
      background-color: ${props => props.themeColor};
    }
  }

  .react-datepicker-popper {
    z-index: 25 !important;
    // Eliminating extra space at the bottom of the container
    line-height: 0;
  }

  .react-datepicker__year-dropdown,
  .react-datepicker__month-dropdown,
  .react-datepicker__month-year-dropdown {
    background-color: #ff9900 !important;
    position: absolute;
    width: 50%;
    left: 25%;
    top: 30px;
    z-index: 10 !important;
    text-align: center;

    &:hover {
      cursor: pointer;
    }

    &--scrollable {
      height: 150px;
      overflow-y: scroll;
    }
  }
`

export default StyledDatePicker
