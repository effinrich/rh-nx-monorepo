import ReactGA from 'react-ga4'

interface UserDetails {
  user_role?: string
  user_membership?: string
}

export const setUserProperties = (userDetails: UserDetails) => {
  ReactGA.gtag('set', 'user_properties', userDetails)
}
