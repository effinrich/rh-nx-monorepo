import localforage from 'localforage'

const opCos = [
  {
    internalOpCoName: 'Pip',
    setupStatus: 'In progress',
    numberOfUsers: 15
  },
  {
    internalOpCoName: 'Fort',
    setupStatus: 'Released',
    numberOfUsers: 44
  },
  {
    internalOpCoName: 'Calibrate',
    setupStatus: 'Planning',
    numberOfUsers: 36
  }
]

const users = [
  {
    name: 'Rich',
    email: 12,
    role: 'admin',
    _id: 'x8345wer2vrwf'
  },
  {
    name: 'Stevie',
    email: 134,
    role: 'admin',
    _id: 'x8345we35gvrwf'
  },
  {
    name: 'Hursh',
    email: 34,
    role: 'opco user',
    _id: 'x8345wedsrfwvr'
  }
]

export function setUsers() {
  return localforage.setItem('users', users)
}

export function setOpCos() {
  return localforage.setItem('opCos', opCos)
}

export async function getUsers() {
  const users = await localforage.getItem('users')
  if (!users) throw new Response('', { status: 404 })
  return users
}

export async function getOpCos() {
  const opCos = await localforage.getItem('opCos')
  if (!opCos) throw new Response('', { status: 404 })
  return opCos
}
