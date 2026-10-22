
import { useState } from 'react'
import type { Attendance, AttendanceStatus } from '../types'
import { storage } from '../services/storage'

export function useAttendance() {
  const [attendance, setAttendance] = useState<Attendance[]>(() =>
    storage.getAttendance(),
  )

  function registerAttendance(
    meetingId: string,
    personId: string,
    churchId: string,
    status: AttendanceStatus,
    justification = '',
  ) {
    const existingRecord = attendance.find(
      (item) =>
        item.meetingId === meetingId &&
        item.personId === personId,
    )

    const updatedRecord: Attendance = {
      id: existingRecord?.id ?? crypto.randomUUID(),
      meetingId,
      personId,
      churchId,
      status,
      justification,
      updatedAt: new Date().toISOString(),
    }

    const updatedAttendance = existingRecord
      ? attendance.map((item) =>
          item.id === existingRecord.id ? updatedRecord : item,
        )
      : [...attendance, updatedRecord]

    storage.saveAttendance(updatedAttendance)
    setAttendance(updatedAttendance)
  }

  function getAttendanceForMeeting(meetingId: string) {
    return attendance.filter((item) => item.meetingId === meetingId)
  }

  return {
    attendance,
    registerAttendance,
    getAttendanceForMeeting,
  }
}
