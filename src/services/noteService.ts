import axios from 'axios';
import type { Note, NewNoteData } from "../types/note";
const token = import.meta.env.VITE_NOTEHUB_TOKEN;

axios.defaults.baseURL = 'https://notehub-public.goit.study/api';

export const fetchNotes = async (
  page = 1,
  perPage = 12,
): Promise<{ notes: Note[]; totalPages: number }> => {
  const response = await axios.get<{ notes: Note[]; totalPages: number }>("/notes", {
    params: {
      page,
      perPage,
    
    },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  
  return {
    notes: response.data.notes,
    totalPages: response.data.totalPages,
  };
};


export const createNote = async (noteData: NewNoteData) => {
  const response = await axios.post<Note>("/notes", noteData, {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});
  return response.data;
};

export const deleteNote = async (noteId: string) => {
  const response = await axios.delete(`/notes/${noteId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },

  });
  return response.data;
}

