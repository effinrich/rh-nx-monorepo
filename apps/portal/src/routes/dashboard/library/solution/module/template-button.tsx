import { memo } from 'react'
import { MdLaunch } from 'react-icons/md'
import { useGoogleLogin } from '@react-oauth/google'
import analytics from '@redesignhealth/analytics'
import { useGetUserInfo } from '@redesignhealth/portal/data-assets'
import { Button } from '@redesignhealth/ui'

import { usePostCopyTemplateMutation } from './hooks'

export interface TemplateButtonProps {
  remoteContentId: string
}

export const TemplateButton = memo(
  ({ remoteContentId }: TemplateButtonProps) => {
    const { data: userInfo } = useGetUserInfo()

    const { mutate, isPending } = usePostCopyTemplateMutation()

    const login = useGoogleLogin({
      flow: 'implicit',
      scope: 'https://www.googleapis.com/auth/drive.file',
      prompt: '',
      hint: userInfo?.email,
      onSuccess: ({ access_token: token }) =>
        mutate({ id: remoteContentId, token })
    })

    if (!userInfo) return null

    return (
      <Button
        variant="solid"
        colorScheme="primary"
        rightIcon={<MdLaunch />}
        onClick={() => {
          analytics.sendSelectContentEvent({
            content_type: 'Template',
            content_id: remoteContentId
          })
          login()
        }}
        isLoading={isPending}
        isDisabled={isPending}
      >
        Open template
      </Button>
    )
  }
)

TemplateButton.displayName = 'TemplateButton'
