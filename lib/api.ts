import axios from "axios";
import type { Note, NewNoteData } from "@/types/note";

export interface FetchNotesParams {
  page?: number;
  perPage?: number;
  search?: string;
  tag?: string | undefined;
}

export interface FetchNotesResponse {
  totalPages: number;
  notes: Note[];
}

axios.defaults.baseURL = "https://notehub-public.goit.study/api";
const token = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;

export async function fetchNotes({
  page = 1,
  perPage = 12,
  search = "",
  tag = undefined,
}: FetchNotesParams): Promise<FetchNotesResponse> {
  const response = await axios.get<FetchNotesResponse>(`/notes`, {
    params: {
      page,
      perPage,
      ...(search?.trim() ? { search } : {}),
      tag,
    },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}

export async function fetchNoteById(id: string): Promise<Note> {
  const response = await axios.get<Note>(`/notes/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}

export async function createNote(noteData: NewNoteData): Promise<Note> {
  const response = await axios.post<Note>("/notes", noteData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}

export async function deleteNote(noteId: string): Promise<Note> {
  const response = await axios.delete<Note>(`/notes/${noteId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}
