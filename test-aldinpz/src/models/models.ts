export interface ToDos {
    records: Record[]
}

export interface Record {
    id: string
    createdTime: string
    fields: Fields
}

export interface Fields {
    AssignedTo: string
    Done: boolean
    Description: string
    CCNr: string
}

export interface ITodo {
    Id : string
    AssignedTo: string
    Done: boolean
    Description: string
    CCNr: string
}

export interface PostToDo {
    fields: Fields
}
