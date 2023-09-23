import { Option } from "@/types/misc"

const MBTIs = () : Option<string>[] => [
    {display:'ENTP',value:'ENTP'},
    {display:'ENTJ',value:'ENTJ'},
    {display:'INTJ',value:'INTJ'},
    {display:'INTP',value:'INTP'},
    {display:'ENFP',value:'ENFP'},
    {display:'ENFJ',value:'ENFJ'},
    {display:'INFP',value:'INFP'},
    {display:'INFJ',value:'INFJ'},
    {display:'ESTP',value:'ESTP'},
    {display:'ESTJ',value:'ESTJ'},
    {display:'ISTP',value:'ISTP'},
    {display:'ISTJ',value:'ISTJ'},
    {display:'ESFP',value:'ESFP'},
    {display:'ESFJ',value:'ESFJ'},
    {display:'ISFJ',value:'ISFJ'},
    {display:'ISFP',value:'ISFP'},
    {display:'Not sure',value:'NS'}
]

const Ages = () : Option<string>[] => [
    {display:'12 or under',value:'u12'},
    {display:'13-17',value:'13-17'},
    {display:'18-22',value:'18-22'},
    {display:'23-26',value:'23-26'},
    {display:'27-33',value:'27-33'},
    {display: '34-40',value:'34-40'},
    {display:'41-50',value:'41-50'},
    {display:'51 or over',value:'o51'}
]

const Genders = () : Option<string>[] => [
    {display:'Male',value:'M'},
    {display:'Female',value:'F'},
    {display:'Other',value:'?'}
]

export const Constants = {
    MBTIs,
    Ages,
    Genders,
    unknownError: 'Unexpected error occured',
    unknownSQLError: 'SQL returned error with no message',
    developmentHost: process.env.NEXT_PUBLIC_DEVELOPMENT_HOST,
}