import { MBTI as MBTIType } from '@/types/misc'

const ENTJ = (): MBTIType => ({
  dominant: 'Te',
  auxiliary: 'Ni',
  tertiary: 'Se',
  inferior: 'Fi',
  opposing: 'Ti',
  critical: 'Ne',
  trickster: 'Si',
  demon: 'Fe',
  name: 'ENTJ',
})

const INTJ = (): MBTIType => ({
  dominant: 'Ni',
  auxiliary: 'Te',
  tertiary: 'Fi',
  inferior: 'Se',
  opposing: 'Ne',
  critical: 'Ti',
  trickster: 'Fe',
  demon: 'Si',
  name: 'INTJ',
})

const ENTP = (): MBTIType => ({
  dominant: 'Ne',
  auxiliary: 'Ti',
  tertiary: 'Fe',
  inferior: 'Si',
  opposing: 'Ni',
  critical: 'Te',
  trickster: 'Fi',
  demon: 'Se',
  name: 'ENTP',
})

const INTP = (): MBTIType => ({
  dominant: 'Ti',
  auxiliary: 'Ne',
  tertiary: 'Si',
  inferior: 'Fe',
  opposing: 'Te',
  critical: 'Ni',
  trickster: 'Se',
  demon: 'Fi',
  name: 'INTP',
})

const ENFJ = (): MBTIType => ({
  dominant: 'Fe',
  auxiliary: 'Ni',
  tertiary: 'Se',
  inferior: 'Ti',
  opposing: 'Fi',
  critical: 'Ne',
  trickster: 'Si',
  demon: 'Te',
  name: 'ENFJ',
})

const INFJ = (): MBTIType => ({
  dominant: 'Ni',
  auxiliary: 'Fe',
  tertiary: 'Ti',
  inferior: 'Se',
  opposing: 'Ne',
  critical: 'Fi',
  trickster: 'Te',
  demon: 'Si',
  name: 'INFJ',
})

const ENFP = (): MBTIType => ({
  dominant: 'Ne',
  auxiliary: 'Fi',
  tertiary: 'Te',
  inferior: 'Si',
  opposing: 'Ni',
  critical: 'Fe',
  trickster: 'Ti',
  demon: 'Se',
  name: 'ENFP',
})

const INFP = (): MBTIType => ({
  dominant: 'Fi',
  auxiliary: 'Ne',
  tertiary: 'Si',
  inferior: 'Te',
  opposing: 'Fe',
  critical: 'Ni',
  trickster: 'Se',
  demon: 'Ti',
  name: 'INFP',
})

const ESTJ = (): MBTIType => ({
  dominant: 'Te',
  auxiliary: 'Si',
  tertiary: 'Ne',
  inferior: 'Fi',
  opposing: 'Ti',
  critical: 'Se',
  trickster: 'Ni',
  demon: 'Fe',
  name: 'ESTJ',
})

const ISTJ = (): MBTIType => ({
  dominant: 'Si',
  auxiliary: 'Te',
  tertiary: 'Fi',
  inferior: 'Ne',
  opposing: 'Se',
  critical: 'Ti',
  trickster: 'Fe',
  demon: 'Ni',
  name: 'ISTJ',
})

const ESFJ = (): MBTIType => ({
  dominant: 'Fe',
  auxiliary: 'Si',
  tertiary: 'Ne',
  inferior: 'Ti',
  opposing: 'Fi',
  critical: 'Se',
  trickster: 'Ni',
  demon: 'Te',
  name: 'ESFJ',
})

const ISFJ = (): MBTIType => ({
  dominant: 'Si',
  auxiliary: 'Fe',
  tertiary: 'Ti',
  inferior: 'Ne',
  opposing: 'Se',
  critical: 'Fi',
  trickster: 'Te',
  demon: 'Ni',
  name: 'ISFJ',
})

const ESTP = (): MBTIType => ({
  dominant: 'Se',
  auxiliary: 'Ti',
  tertiary: 'Fe',
  inferior: 'Ni',
  opposing: 'Si',
  critical: 'Te',
  trickster: 'Fi',
  demon: 'Ne',
  name: 'ESTP',
})

const ISTP = (): MBTIType => ({
  dominant: 'Ti',
  auxiliary: 'Se',
  tertiary: 'Ni',
  inferior: 'Fe',
  opposing: 'Te',
  critical: 'Si',
  trickster: 'Ne',
  demon: 'Fi',
  name: 'ISTP',
})

const ESFP = (): MBTIType => ({
  dominant: 'Se',
  auxiliary: 'Fi',
  tertiary: 'Te',
  inferior: 'Ni',
  opposing: 'Si',
  critical: 'Fe',
  trickster: 'Ti',
  demon: 'Ne',
  name: 'ESFP',
})

const ISFP = (): MBTIType => ({
  dominant: 'Fi',
  auxiliary: 'Se',
  tertiary: 'Ni',
  inferior: 'Te',
  opposing: 'Fe',
  critical: 'Si',
  trickster: 'Ne',
  demon: 'Ti',
  name: 'ISFP',
})

export const MBTIs = {
  ENTJ,
  INTJ,
  ENTP,
  INTP,
  ENFJ,
  INFJ,
  ENFP,
  INFP,
  ESTJ,
  ISTJ,
  ESFJ,
  ISFJ,
  ESTP,
  ISTP,
  ESFP,
  ISFP,
}
