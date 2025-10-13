import { useEffect } from 'react'
import { Helmet } from 'react-helmet'
import { Outlet, useNavigate } from 'react-router-dom'
import {
  Ceo,
  useGetCeoById,
  useGetUserInfo
} from '@redesignhealth/portal/data-assets'
import { CeoDirectoryPage, Page } from '@redesignhealth/portal/ui'
import { Stack } from '@redesignhealth/ui'

const hasNotCompletedOnboarding = (ceo?: Ceo) =>
  ceo && ceo.visible === undefined

export const CeoDirectory = () => {
  const { data: user } = useGetUserInfo()
  const { data: userCeo, isFetched: isCeoFetched } = useGetCeoById(
    user?.ceoInfo.id
  )
  const navigate = useNavigate()

  useEffect(() => {
    if (user?.ceoInfo.ceo && hasNotCompletedOnboarding(userCeo)) {
      navigate('/ceo-directory/onboarding')
    }
  }, [navigate, user, userCeo])

  if (user?.ceoInfo.ceo && !isCeoFetched) {
    return null
  }

  return (
    <Page>
      <Helmet>
        <title>CEO Directory</title>
      </Helmet>
      <Stack>
        <CeoDirectoryPage
          isCeoOptOut={
            user?.ceoInfo?.ceo && userCeo?.visible?.value !== 'OPT_IN'
          }
          ceoId={user?.ceoInfo.id}
        />
        <Outlet />
      </Stack>
    </Page>
  )
}

export default CeoDirectory
