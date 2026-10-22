
import { useState } from 'react'
import type { Meeting } from '../types'
import { storage } from '../services/storage'

export function useMeetings() {
  const [meetings, setMeetings] = useState<Meeting[]>(() =>
    storage.getMeetings(),
  )

  function createMeeting(name: string, date: string) {
    const newMeeting: Meeting = {
      id: crypto.randomUUID(),
      name,
      date,
    }

    const updatedMeetings = [...meetings, newMeeting]

    storage.saveMeetings(updatedMeetings)
    setMeetings(updatedMeetings)

    return newMeeting
  }

  function getCurrentMeeting() {
    return [...meetings].sort((a, b) =>
      b.date.localeCompare(a.date),
    )[0] ?? null
  }

  return {
    meetings,
    createMeeting,
    getCurrentMeeting,
  }
}
