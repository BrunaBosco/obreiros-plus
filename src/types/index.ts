export type AttendanceStatus =
  | 'presente'
  | 'falta_justificada'
  | 'falta_nao_justificada'
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
  phone?: string
  active?: boolean
  birthDate?: string
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

export interface Occurrence {
  id: string
  name: string
  churchId: string
  justification: string
  date: string
  responsible: string
}
