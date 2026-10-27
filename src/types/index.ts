export interface ContactForm {
  id?: string
  nombre: string
  email: string
  servicio: string
  mensaje: string
  created_at?: string
}

export interface Service {
  id: number
  icon: string
  title: string
  description: string
  link: string
}

export interface CaseStudy {
  id: number
  category: string
  title: string
  description: string
  result: string
  resultLabel: string
  image: string
}

export interface Stat {
  id: number
  value: string
  label: string
  icon: string
}
