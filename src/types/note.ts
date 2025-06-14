export interface Note {
    id: number;
    title: string;
    content: string;
    tag: string;
}


export interface NewNoteData {
    title: string;
    content: string;
    tag: "Todo" | "Work" | "Personal" | "Meeting" | "Shopping";
  }
  
 
  export interface NotesResponse {
    notes: Note[];
    totalPages: number;
  }