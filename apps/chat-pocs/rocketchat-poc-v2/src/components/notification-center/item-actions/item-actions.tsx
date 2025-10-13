import { FiArchive, FiCheck } from 'react-icons/fi'
import type {
  NotificationCenterItem,
  UseNotificationCenter
} from 'react-toastify/addons/use-notification-center'
import { Button } from '@chakra-ui/react'
import styled from '@emotion/styled'

import { PulsatingDot } from './pulsing-dot'

const Wrapper = styled.div`
  margin-left: auto;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
`

interface Props
  extends Pick<UseNotificationCenter<object>, 'markAsRead' | 'remove'> {
  notification: NotificationCenterItem
}

export function ItemActions({ notification, markAsRead, remove }: Props) {
  return (
    <Wrapper>
      {notification.read ? (
        <FiCheck color="green" />
      ) : (
        <Button
          title="Mark as read"
          onClick={() => {
            markAsRead(notification.id)
          }}
          variant="ghost"
        >
          <PulsatingDot />
        </Button>
      )}
      <Button
        onClick={() => remove(notification.id)}
        title="Archive"
        variant="ghost"
      >
        <FiArchive color="#666" />
      </Button>
    </Wrapper>
  )
}
