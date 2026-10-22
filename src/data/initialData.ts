
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
    photo: 'https://placehold.co/300x300?text=Adalberto',
  },
  {
    id: 'agnaldo',
    name: 'Agnaldo Oliveira do Nascimento',
    role: 'PASTOR',
    churchId: 'sede',
    photo: 'https://placehold.co/300x300?text=Agnaldo',
  },
  {
    id: 'alexandre',
    name: 'Alexandre Saltelis Rosa',
    role: 'Pr. AGUARD. REC.',
    churchId: 'sede',
    photo: 'https://placehold.co/300x300?text=Alexandre',
  },
  {
    id: 'alisson',
    name: 'Alisson Santos de Almeida',
    role: 'COOPERADOR',
    churchId: 'sede',
    photo: 'https://placehold.co/300x300?text=Alisson',
  },
  {
    id: 'amaro',
    name: 'Amaro Tavares de Gouveia Filho',
    role: 'COOPERADOR',
    churchId: 'sede',
    photo: 'https://placehold.co/300x300?text=Amaro',
  },
  {
    id: 'anderson',
    name: 'Anderson Silva Oliveira',
    role: 'COOPERADOR',
    churchId: 'sede',
    photo: 'https://placehold.co/300x300?text=Anderson',
  },

  // Jardim Aurélio
  {
    id: 'paulo-henrique',
    name: 'Paulo Henrique',
    role: 'COOPERADOR',
    churchId: 'jardim-aurelio',
    photo: 'https://placehold.co/300x300?text=Paulo',
  },
  {
    id: 'roberto-alves',
    name: 'Roberto Alves',
    role: 'COOPERADOR',
    churchId: 'jardim-aurelio',
    photo: 'https://placehold.co/300x300?text=Roberto',
  },
  {
    id: 'samuel-costa',
    name: 'Samuel Costa',
    role: 'DIÁCONO',
    churchId: 'jardim-aurelio',
    photo: 'https://placehold.co/300x300?text=Samuel',
  },
  {
    id: 'daniel-martins',
    name: 'Daniel Martins',
    role: 'COOPERADOR',
    churchId: 'jardim-aurelio',
    photo: 'https://placehold.co/300x300?text=Daniel',
  },

  
  {
    id: 'marcos-oliveira',
    name: 'Marcos Oliveira',
    role: 'COOPERADOR',
    churchId: 'jardim-aurelio',
    photo: 'https://placehold.co/300x300?text=Marcos',
  },
  {
    id: 'antonio-santos',
    name: 'Antônio Santos',
    role: 'DIÁCONO',
    churchId: 'jardim-aurelio',
    photo: 'https://placehold.co/300x300?text=Antonio',
  },


  // Jardim da Luz
  {
    id: 'jose-carlos',
    name: 'José Carlos',
    role: 'DIÁCONO',
    churchId: 'jardim-da-luz',
    photo: 'https://placehold.co/300x300?text=Jose',
  },
  {
    id: 'felipe-souza',
    name: 'Felipe Souza',
    role: 'COOPERADOR',
    churchId: 'jardim-da-luz',
    photo: 'https://placehold.co/300x300?text=Felipe',
  },
  {
    id: 'rafael-lima',
    name: 'Rafael Lima',
    role: 'COOPERADOR',
    churchId: 'jardim-da-luz',
    photo: 'https://placehold.co/300x300?text=Rafael',
  },
  {
    id: 'lucas-ferreira',
    name: 'Lucas Ferreira',
    role: 'COOPERADOR',
    churchId: 'jardim-da-luz',
    photo: 'https://placehold.co/300x300?text=Lucas',
  },

  
  {
    id: 'carlos-eduardo',
    name: 'Carlos Eduardo',
    role: 'COOPERADOR',
    churchId: 'jardim-da-luz',
    photo: 'https://placehold.co/300x300?text=Carlos',
  },
  {
    id: 'antonio-ferreira',
    name: 'Antônio Ferreira',
    role: 'DIÁCONO',
    churchId: 'jardim-da-luz',
    photo: 'https://placehold.co/300x300?text=Antonio',
  },

]
