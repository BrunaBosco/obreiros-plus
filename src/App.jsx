

import { useEffect, useState } from 'react'
import './App.css'
import { churches as initialChurches, people } from './dados'


const STORAGE_KEY = 'presenca-obreiros'
const MEETING_PREFIX = 'reuniao-obreiros'

function getMeetingDate(year, month) {
  // month: 0 = janeiro, 11 = dezembro
  const firstDay = new Date(year, month, 1)
  const firstMondayOffset = (8 - firstDay.getDay()) % 7
  const secondMonday = 1 + firstMondayOffset + 7

  return new Date(year, month, secondMonday)
}

function formatDate(date) {
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

function getMeetingId(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  return `${MEETING_PREFIX}-${year}-${month}`
}

function getCurrentMeeting() {
  const now = new Date()
  const meetingDate = getMeetingDate(
    now.getFullYear(),
    now.getMonth()
  )

  return {
    id: getMeetingId(meetingDate),
    date: meetingDate,
  }
}

function getMeetingStatus(meetingDate) {
  const now = new Date()
  const deadline = new Date(
    meetingDate.getFullYear(),
    meetingDate.getMonth(),
    meetingDate.getDate() + 1,
    0,
    0,
    0,
    0
  )

  return now >= deadline ? 'ENCERRADA' : 'EM ANDAMENTO'
}

function loadMeetings() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (!saved) return {}

    const parsed = JSON.parse(saved)

    // Migração dos registros antigos, que eram salvos por pessoa.
    if (
      parsed &&
      typeof parsed === 'object' &&
      !Array.isArray(parsed) &&
      Object.values(parsed).some(
        (value) =>
          value &&
          typeof value === 'object' &&
          'status' in value
      )
    ) {
      const current = getCurrentMeeting()
      return {
        [current.id]: {
          date: current.date.toISOString(),
          attendance: parsed,
        },
      }
    }

    return parsed && typeof parsed === 'object' ? parsed : {}
  } catch {
    return {}
  }
}

function App() {

const [churches, setChurches] = useState(() => {
  try {
    const saved = localStorage.getItem('igrejas-obreiros')
    const list = saved ? JSON.parse(saved) : initialChurches

    return list.map((church) => ({
      ...church,
      active: church.active !== false,
    }))
  } catch {
    return initialChurches.map((church) => ({
      ...church,
      active: true,
    }))
  }
})


  useEffect(() => {
    localStorage.setItem('igrejas-obreiros', JSON.stringify(churches))
  }, [churches])

  
  const [newChurchName, setNewChurchName] = useState('')

  function addChurch(event) {
    event.preventDefault()

    const name = newChurchName.trim()

    if (!name) {
      alert('Digite o nome da igreja.')
      return
    }

    const alreadyExists = churches.some(
      (church) => church.name.toLowerCase() === name.toLowerCase()
    )

    if (alreadyExists) {
      alert('Já existe uma igreja com esse nome.')
      return
    }

    
    const id = `igreja-${Date.now()}`

    setChurches((previous) => [
      ...previous,
      { id, name, active: true },
    ])


    setNewChurchName('')
    setSelectedChurch(id)
    alert('Igreja cadastrada com sucesso!')
  }

  
  function editChurch(churchId) {
    const church = churches.find((item) => item.id === churchId)

    if (!church) return

    const newName = prompt('Digite o novo nome da igreja:', church.name)

    if (newName === null) return

    const name = newName.trim()

    if (!name) {
      alert('O nome da igreja não pode ficar vazio.')
      return
    }

    const alreadyExists = churches.some(
      (item) =>
        item.id !== churchId &&
        item.name.toLowerCase() === name.toLowerCase()
    )

    if (alreadyExists) {
      alert('Já existe uma igreja com esse nome.')
      return
    }

    setChurches((previous) =>
      previous.map((item) =>
        item.id === churchId ? { ...item, name } : item
      )
    )

    alert('Nome da igreja atualizado com sucesso!')
  }

  
  function deactivateChurch(churchId) {
    const church = churches.find((item) => item.id === churchId)

    if (!church || church.active === false) return

    const confirmed = window.confirm(
      `Deseja desativar a igreja "${church.name}"? O histórico será preservado.`
    )

    if (!confirmed) return

    const activeChurches = churches.filter(
      (item) => item.id !== churchId && item.active !== false
    )

    if (activeChurches.length === 0) {
      alert('Não é possível desativar a última igreja ativa.')
      return
    }

    setChurches((previous) =>
      previous.map((item) =>
        item.id === churchId ? { ...item, active: false } : item
      )
    )

    if (selectedChurch === churchId) {
      setSelectedChurch(activeChurches[0].id)
    }

    alert('Igreja desativada. O histórico foi preservado.')
  }

  
  function reactivateChurch(churchId) {
    const church = churches.find((item) => item.id === churchId)

    if (!church || church.active !== false) return

    setChurches((previous) =>
      previous.map((item) =>
        item.id === churchId ? { ...item, active: true } : item
      )
    )

    alert('Igreja reativada com sucesso!')
  }


  const currentMeeting = getCurrentMeeting()

  const [meetings, setMeetings] = useState(loadMeetings)
  const [currentTime, setCurrentTime] = useState(() => Date.now())

useEffect(() => {
  const timer = setInterval(() => {
    setCurrentTime(Date.now())
  }, 1000)

  return () => clearInterval(timer)
}, [])
  const [selectedMeetingId, setSelectedMeetingId] = useState(
    currentMeeting.id
  )
  const [selectedChurch, setSelectedChurch] = useState('sede')
  const [selectedPerson, setSelectedPerson] = useState(null)
  const [justification, setJustification] = useState('')
  const [showJustification, setShowJustification] = useState(false)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(meetings))
  }, [meetings])

  const meeting = meetings[selectedMeetingId]
  const meetingDate = meeting
    ? new Date(meeting.date)
    : selectedMeetingId === currentMeeting.id
      ? currentMeeting.date
      : (() => {
          const parts = selectedMeetingId.split('-')
          return getMeetingDate(Number(parts[2]), Number(parts[3]) - 1)
        })()

  const isCurrentMeeting = selectedMeetingId === currentMeeting.id
  const isLocked =
  !isCurrentMeeting ||
  currentTime >= new Date(
    meetingDate.getFullYear(),
    meetingDate.getMonth(),
    meetingDate.getDate() + 1,
    0, 0, 0, 0
  ).getTime()

  const attendance = meeting?.attendance || {}

  
  const activeChurches = churches.filter(
    (church) => church.active !== false
  )

  
  const inactiveChurches = churches.filter(
    (church) => church.active === false
  )

  const churchPeople = people.filter(
    (person) => person.churchId === selectedChurch
  )

  const currentChurch = churches.find(
    (church) => church.id === selectedChurch
  )

  const summary = [
    {
      label: 'Total de pessoas',
      value: churchPeople.length,
    },
    {
      label: 'Presentes',
      value: churchPeople.filter(
        (person) => attendance[person.id]?.status === 'PRESENTE'
      ).length,
    },
    {
      label: 'Ausentes',
      value: churchPeople.filter(
        (person) => attendance[person.id]?.status === 'AUSENTE'
      ).length,
    },
    {
      label: 'Faltas',
      value: churchPeople.filter(
        (person) => attendance[person.id]?.status === 'FALTA'
      ).length,
    },
    {
      label: 'Pendentes',
      value: churchPeople.filter(
        (person) => !attendance[person.id]
      ).length,
    },
  ]

  function saveRecord(personId, record) {
    if (isLocked) return

    setMeetings((previous) => ({
      ...previous,
      [selectedMeetingId]: {
        date: meetingDate.toISOString(),
        attendance: {
          ...(previous[selectedMeetingId]?.attendance || {}),
          [personId]: record,
        },
      },
    }))
  }

  function registerAttendance(status) {
    if (!selectedPerson || isLocked) return

    if (status === 'AUSENTE') {
      setJustification('')
      setShowJustification(true)
      return
    }

    saveRecord(selectedPerson.id, {
      status,
      justification: '',
    })

    closeModal()
  }

  function saveAbsence() {
    if (!selectedPerson || isLocked) return

    const reason = justification.trim()

    if (!reason) {
      alert('Por favor, informe a justificativa da ausência.')
      return
    }

    saveRecord(selectedPerson.id, {
      status: 'AUSENTE',
      justification: reason,
    })

    closeModal()
  }

  function closeModal() {
    setSelectedPerson(null)
    setShowJustification(false)
    setJustification('')
  }

  function openMeetingHistory(event) {
    const value = event.target.value
    setSelectedMeetingId(value)
    closeModal()
  }

  function getRecentMeetings() {
    const now = new Date()
    const list = []

    // Exibe as reuniões do mês atual e dos 23 meses anteriores.
    for (let offset = 0; offset < 24; offset++) {
      const date = new Date(
        now.getFullYear(),
        now.getMonth() - offset,
        1
      )
      const meetingDate = getMeetingDate(
        date.getFullYear(),
        date.getMonth()
      )

      const id = getMeetingId(meetingDate)

      list.push({
        id,
        date: meetingDate,
      })
    }

    return list
  }

  const recentMeetings = getRecentMeetings()

  return (
    <main className="app">
      <header className="page-header">
        <div>
          <span className="eyebrow">GESTÃO DE OBREIROS</span>
          <h1>Controle de Presença</h1>
          <p>Reunião de Obreiros</p>
        </div>

        <div className="meeting-date">
          <span>Data da reunião</span>
          <strong>{formatDate(meetingDate)}</strong>
          <label htmlFor="meeting-history">Reunião / histórico</label>
          <select
            id="meeting-history"
            value={selectedMeetingId}
            onChange={openMeetingHistory}
          >
            {recentMeetings.map((item) => (
              <option key={item.id} value={item.id}>
                {formatDate(item.date)}
                {item.id === currentMeeting.id ? ' (atual)' : ''}
              </option>
            ))}
          </select>
          <strong className={isLocked ? 'meeting-locked' : 'meeting-open'}>
            {isLocked ? 'REUNIÃO BLOQUEADA' : 'REUNIÃO ABERTA'}
          </strong>
        </div>
      </header>

      {isLocked && (
        <div className="meeting-notice">
          Esta reunião está bloqueada para alterações. Os registros podem
          ser consultados, mas não modificados.
        </div>
      )}

      <section className="summary-grid" aria-label="Resumo da reunião">
        {summary.map((item) => (
          <article className="summary-card" key={item.label}>
            <span>{item.label}</span>
            <strong>{item.value}</strong>
          </article>
        ))}
      </section>

      <section className="church-section">
        
<div className="section-heading">
  <div>
    <h2>Igrejas</h2>
    <p>Selecione uma igreja para visualizar os obreiros.</p>
  </div>
</div>

<form className="church-form" onSubmit={addChurch}>
  <input
    type="text"
    value={newChurchName}
    onChange={(event) => setNewChurchName(event.target.value)}
    placeholder="Nome da nova igreja"
    aria-label="Nome da nova igreja"
    maxLength={80}
    required
  />

  <button type="submit" className="church-form-button">
    + Cadastrar igreja
  </button>
</form>

        <nav className="church-tabs" aria-label="Igrejas">
          
{activeChurches.map((church) => (
  <div className="church-tab-wrapper" key={church.id}>
    <button
      type="button"
      className={
        selectedChurch === church.id
          ? 'church-tab active'
          : 'church-tab'
      }
      onClick={() => setSelectedChurch(church.id)}
    >
      {church.name}
    </button>

    <button
      type="button"
      className="church-edit-button"
      onClick={() => editChurch(church.id)}
      aria-label={`Editar ${church.name}`}
      title={`Editar ${church.name}`}
    >
      ✎
    </button>

    
{church.active !== false && (
  <button
    type="button"
    className="church-deactivate-button"
    onClick={() => deactivateChurch(church.id)}
    aria-label={`Desativar ${church.name}`}
    title={`Desativar ${church.name}`}
  >
    ×
  </button>
)}

  </div>
))}

        </nav>

        <div className="people-grid">
          {churchPeople.map((person) => {
            const record = attendance[person.id]

            return (
              <article
                className={`person-card ${record ? 'has-attendance' : ''}`}
                key={person.id}
                onClick={() => setSelectedPerson(person)}
                role="button"
                tabIndex={0}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault()
                    setSelectedPerson(person)
                  }
                }}
              >
                <img
                  className={`person-photo ${
                    record ? 'photo-registered' : ''
                  }`}
                  src={person.photo}
                  alt={`Foto de ${person.name}`}
                />

                <div className="person-info">
                  <h3>{person.name}</h3>
                  <span>{currentChurch?.name}</span>

                  {record && (
                    <span
                      className={`attendance-status ${record.status.toLowerCase()}`}
                    >
                      {record.status}
                    </span>
                  )}

                  {record?.justification && (
                    <span className="record-justification">
                      Justificativa: {record.justification}
                    </span>
                  )}
                </div>
              </article>
            )
          })}
        </div>
      </section>

      
      {inactiveChurches.length > 0 && (
        <section className="church-section inactive-church-section">
          <div className="section-heading">
            <div>
              <h2>Igrejas desativadas</h2>
              <p>
                Estas igrejas não aparecem nas opções principais,
                mas seus históricos continuam preservados.
              </p>
            </div>
          </div>

          <div className="inactive-church-list">
            {inactiveChurches.map((church) => (
              <div className="inactive-church-item" key={church.id}>
                <div>
                  <strong>{church.name}</strong>
                  <span>Igreja desativada</span>
                </div>

                <button
                  type="button"
                  className="church-reactivate-button"
                  onClick={() => reactivateChurch(church.id)}
                >
                  Reativar
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {selectedPerson && (
        <div className="modal-overlay" onClick={closeModal}>
          <section
            className="modal-content"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            <button
              type="button"
              className="modal-close"
              onClick={closeModal}
              aria-label="Fechar janela"
            >
              ×
            </button>

            <img
              className="modal-photo"
              src={selectedPerson.photo}
              alt={`Foto de ${selectedPerson.name}`}
            />

            <h2 id="modal-title">{selectedPerson.name}</h2>
            <p>{currentChurch?.name}</p>

            {attendance[selectedPerson.id] && (
              <p>
                Registro atual: <strong>{attendance[selectedPerson.id].status}</strong>
              </p>
            )}

            {isLocked ? (
              <p>
                Esta reunião está bloqueada. O registro é somente para consulta.
              </p>
            ) : !showJustification ? (
              <div className="attendance-options">
                <button
                  type="button"
                  className="attendance-button present"
                  onClick={() => registerAttendance('PRESENTE')}
                >
                  PRESENTE
                </button>

                <button
                  type="button"
                  className="attendance-button absent"
                  onClick={() => registerAttendance('AUSENTE')}
                >
                  AUSENTE
                </button>

                <button
                  type="button"
                  className="attendance-button missing"
                  onClick={() => registerAttendance('FALTA')}
                >
                  FALTA
                </button>
              </div>
            ) : (
              <div className="justification-form">
                <h3>Justificativa da ausência</h3>
                <p>Informe o motivo da ausência deste obreiro.</p>

                <textarea
                  className="justification-input"
                  value={justification}
                  onChange={(event) => setJustification(event.target.value)}
                  placeholder="Digite a justificativa..."
                  rows={4}
                  required
                />

                <button
                  type="button"
                  className="attendance-button absent"
                  onClick={saveAbsence}
                >
                  CONFIRMAR AUSÊNCIA
                </button>

                <button
                  type="button"
                  className="cancel-button"
                  onClick={() => {
                    setShowJustification(false)
                    setJustification('')
                  }}
                >
                  VOLTAR
                </button>
              </div>
            )}
          </section>
        </div>
      )}
    </main>
  )
}

export default App
