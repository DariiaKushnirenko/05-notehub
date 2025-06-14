import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";

import { fetchNotes, deleteNote } from "../../services/noteService";
import SearchBox from "../SearchBox/SearchBox";
import NoteList from "../NoteList/NoteList";
import Pagination from "../Pagination/Pagination";
import NoteModal from "../NoteModal/NoteModal";

import css from "./App.module.css";
import type { Note } from "../../types/note";

export default function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const perPage = 12;

  const queryClient = useQueryClient();

  const {
    data,
    isLoading,
    isError,
  } = useQuery<{ notes: Note[]; totalPages: number }, Error>({
    queryKey: ["notes", currentPage, debouncedSearchTerm],
    queryFn: () => fetchNotes(currentPage, perPage, debouncedSearchTerm),
    keepPreviousData: true,
  });

  
  const deleteMutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["notes", currentPage, debouncedSearchTerm],
      });
    },
  });

  const handleDelete = (id: number) => {
    deleteMutation.mutate(id);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm]);

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={searchTerm} onChange={setSearchTerm} />
        <button className={css.button} onClick={() => setIsModalOpen(true)}>
          Create note +
        </button>
      </header>

      {isLoading && <p>Loading...</p>}
      {isError && <p>Error loading notes</p>}

      {data && (
        <>
          <Pagination
            totalPages={data.totalPages}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />

          <NoteList notes={data.notes} onDelete={handleDelete} />
        </>
      )}

      {isModalOpen && (
        <NoteModal
          onClose={() => {
            setIsModalOpen(false);
            queryClient.invalidateQueries({
              queryKey: ["notes", currentPage, debouncedSearchTerm],
            });
          }}
        />
      )}
    </div>
  );
}
