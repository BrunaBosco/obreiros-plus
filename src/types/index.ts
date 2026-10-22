export type AttendanceStatus =
  | 'presente'
  | 'ausente'
  | 'falta'
  | 'pendente'

export interface Church {
  id: string
  name: string
  active: boolean
}

export interface Person {
  id: string
  name: string
  role: string
  churchId: string
  photo: string
}

export interface Meeting {
  id: string
  name: string
  date: string
}

export interface Attendance {
  id: string
  meetingId: string
  personId: string
  churchId: string
  status: AttendanceStatus
  justification: string
  updatedAt: string
}
