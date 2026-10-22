
import type {
  Attendance,
  Church,
  Meeting,
  Person,
} from '../types'

import {
  initialChurches,
  initialPeople,
} from '../data/initialData'

const KEYS = {
  churches: 'obreiros-plus-igrejas',
  people: 'obreiros-plus-obreiros',
  meetings: 'obreiros-plus-reunioes',
  attendance: 'obreiros-plus-presencas',
}

function readData<T>(key: string, fallback: T): T {
  try {
    const saved = localStorage.getItem(key)
    return saved ? (JSON.parse(saved) as T) : fallback
  } catch {
    return fallback
  }
}

function saveData<T>(key: string, data: T): void {
  localStorage.setItem(key, JSON.stringify(data))
}

export const storage = {
  getChurches(): Church[] {
  const churches = readData<Church[]>(KEYS.churches, initialChurches)

  return churches.map((church) => ({
    ...church,
    active: church.active ?? true,
  }))
},

  saveChurches(churches: Church[]): void {
    saveData(KEYS.churches, churches)
  },

  getPeople(): Person[] {
    return readData(KEYS.people, initialPeople)
  },

  savePeople(people: Person[]): void {
    saveData(KEYS.people, people)
  },

  getMeetings(): Meeting[] {
    return readData<Meeting[]>(KEYS.meetings, [])
  },

  saveMeetings(meetings: Meeting[]): void {
    saveData(KEYS.meetings, meetings)
  },

  getAttendance(): Attendance[] {
    return readData<Attendance[]>(KEYS.attendance, [])
  },

  saveAttendance(attendance: Attendance[]): void {
    saveData(KEYS.attendance, attendance)
  },
}

