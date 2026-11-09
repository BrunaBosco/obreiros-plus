
import type { Church, Person } from '../types'

export const initialChurches: Church[] = [
  { id: 'sede', name: 'Sede', active: true },
  { id: 'jardim-aurelio', name: 'Jardim Aurélio', active: true },
  { id: 'jardim-da-luz', name: 'Jardim da Luz', active: true },
]

export const initialPeople: Person[] = [
  // Sede
  {
    id: 'adalberto',
    name: 'Adalberto Santana de Oliveira',
    role: 'COOPERADOR',
    churchId: 'sede',
  },
  {
    id: 'agnaldo',
    name: 'Agnaldo Oliveira do Nascimento',
    role: 'PASTOR',
    churchId: 'sede',
  },
  {
    id: 'alexandre',
    name: 'Alexandre Saltelis Rosa',
    role: 'Pr. AGUARD. REC.',
    churchId: 'sede',
  },
  {
    id: 'alisson',
    name: 'Alisson Santos de Almeida',
    role: 'COOPERADOR',
    churchId: 'sede',
  },
  {
    id: 'amaro',
    name: 'Amaro Tavares de Gouveia Filho',
    role: 'COOPERADOR',
    churchId: 'sede',
  },
  {
    id: 'anderson',
    name: 'Anderson Silva Oliveira',
    role: 'COOPERADOR',
    churchId: 'sede',
  },

  // Jardim Aurélio
  {
    id: 'paulo-henrique',
    name: 'Paulo Henrique',
    role: 'COOPERADOR',
    churchId: 'jardim-aurelio',
  },
  {
    id: 'roberto-alves',
    name: 'Roberto Alves',
    role: 'COOPERADOR',
    churchId: 'jardim-aurelio',
  },
  {
    id: 'samuel-costa',
    name: 'Samuel Costa',
    role: 'DIÁCONO',
    churchId: 'jardim-aurelio',
  },
  {
    id: 'daniel-martins',
    name: 'Daniel Martins',
    role: 'COOPERADOR',
    churchId: 'jardim-aurelio',
  },

  
  {
    id: 'marcos-oliveira',
    name: 'Marcos Oliveira',
    role: 'COOPERADOR',
    churchId: 'jardim-aurelio',
  },
  {
    id: 'antonio-santos',
    name: 'Antônio Santos',
    role: 'DIÁCONO',
    churchId: 'jardim-aurelio',
  },


  // Jardim da Luz
  {
    id: 'jose-carlos',
    name: 'José Carlos',
    role: 'DIÁCONO',
    churchId: 'jardim-da-luz',
  },
  {
    id: 'felipe-souza',
    name: 'Felipe Souza',
    role: 'COOPERADOR',
    churchId: 'jardim-da-luz',
  },
  {
    id: 'rafael-lima',
    name: 'Rafael Lima',
    role: 'COOPERADOR',
    churchId: 'jardim-da-luz',
  },
  {
    id: 'lucas-ferreira',
    name: 'Lucas Ferreira',
    role: 'COOPERADOR',
    churchId: 'jardim-da-luz',
  },

  
  {
    id: 'carlos-eduardo',
    name: 'Carlos Eduardo',
    role: 'COOPERADOR',
    churchId: 'jardim-da-luz',
  },
  {
    id: 'antonio-ferreira',
    name: 'Antônio Ferreira',
    role: 'DIÁCONO',
    churchId: 'jardim-da-luz',
  },

]
