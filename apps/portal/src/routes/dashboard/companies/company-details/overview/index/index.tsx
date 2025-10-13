import useDrivePicker from 'react-google-drive-picker'
import { MdLaunch } from 'react-icons/md'
import { Link, useParams } from 'react-router-dom'
import { useGoogleLogin } from '@react-oauth/google'
import analytics from '@redesignhealth/analytics'
import {
  useGetCompanyById,
  useGetUserInfo
} from '@redesignhealth/portal/data-assets'
import { OverviewCard } from '@redesignhealth/portal/ui'
import { Button, Card, Flex, Text } from '@redesignhealth/ui'

export const CompanyDetailsOverview = () => {
  const { companyId } = useParams()
  const { data: company } = useGetCompanyById(companyId)
  const { data: userInfo } = useGetUserInfo()
  const companyOnboardingLink = company?.links?.find(
    link => link?.rel === 'onboardDocs'
  )?.href

  const experienceCloudLink = company?.links?.find(
    link => link?.rel === 'xCloud'
  )?.href

  const openPicker = useDrivePicker()[0]
  const handleOpenOnboardingDocs = useGoogleLogin({
    flow: 'implicit',
    scope: 'https://www.googleapis.com/auth/drive.file',
    prompt: '',
    hint: userInfo?.email,
    onSuccess: ({ access_token: token }) => {
      let parentFolder: string | undefined = undefined
      if (companyOnboardingLink) {
        parentFolder = companyOnboardingLink.substring(
          companyOnboardingLink.lastIndexOf('/') + 1
        )
      }
      openPicker({
        clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID || '',
        developerKey: import.meta.env.VITE_GOOGLE_API_KEY || '',
        viewId: 'DOCS',
        showUploadView: false,
        showUploadFolders: false,
        supportDrives: true,
        multiselect: false,
        setParentFolder: companyOnboardingLink ? parentFolder : undefined,
        token,
        // customViews: customViewsArray, // custom view
        callbackFunction: data => {
          if (data.action !== 'picked') {
            return
          }
          analytics.sendSelectContentEvent({
            content_type: 'CompanyDocument',
            content_id: data.docs[0].name
          })
          const docUrl = data.docs[0].url
          window.open(docUrl, '_blank')
        }
      })
    }
  })

  if (!company) return null

  return (
    <>
      <Flex gap={8} mb={8} flexDirection="column">
        {companyOnboardingLink && (
          <OverviewCard
            flex={1}
            title="Documentation"
            rightElement={
              <Button
                onClick={() => {
                  analytics.sendSelectContentEvent({
                    content_type: 'CompanyDrive',
                    content_id: company.name || company.id
                  })

                  handleOpenOnboardingDocs()
                }}
                colorScheme="primary"
                size="md"
              >
                View docs
              </Button>
            }
          >
            <Text>
              We provide documentation to help you get started with Redesign
              Health. It includes what to expect your first month, key people on
              the team and in leadership, and upfront deliverables. Please make
              sure to disable pop-up blockers for this website to access these
              documents.
            </Text>
          </OverviewCard>
        )}
        {experienceCloudLink && (
          <OverviewCard
            flex={1}
            title="Business development & fundraising"
            rightElement={
              <Button
                as={Link}
                rightIcon={<MdLaunch />}
                to={experienceCloudLink}
                target="_blank"
                colorScheme="primary"
                size="md"
              >
                Launch CRM
              </Button>
            }
            data-id="get-started"
          >
            <Text>
              Take charge of your company's partnership and fundraising
              pipelines with Salesforce Experience Cloud. Track pipeline
              performance and streamline CRM communications with Redesign
              Health's Enterprise Growth & Finance teams.
            </Text>
          </OverviewCard>
        )}
      </Flex>

      {company?.dashboardHref && (
        <Card w="full" position="relative" overflow="hidden" pt="56.25%">
          <iframe
            title="Onboarding Doc"
            src={company.dashboardHref}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
              width: '100%',
              height: '100%'
            }}
          />
        </Card>
      )}
    </>
  )
}
