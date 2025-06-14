import axios from 'axios';
import type { Note, NotesResponse, NewNoteData } from "../types/note";

const token = import.meta.env.VITE_NOTEHUB_TOKEN;

axios.defaults.baseURL = 'https://notehub-public.goit.study/api';

export const fetchNotes = async (search: string, page: number): Promise<NotesResponse> => {
  const params: Record<string, string | number> = { page };
  if (search) {
    params.search = search;
  }

  const response = await axios.get<NotesResponse>("/notes", {
    params,
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

export const deleteNote = async (noteId: number) => {
  const response = await axios.delete(`/notes/${noteId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
