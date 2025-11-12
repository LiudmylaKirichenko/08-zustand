"use client";

import { useState, useEffect } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { fetchNotes } from "../../../../lib/api";
import { Toaster } from "react-hot-toast";
import { useDebounce } from "use-debounce";
import Pagination from "../../../../components/Pagination/Pagination";
import NoteList from "../../../../components/NoteList/NoteList";
import SearchBox from "../../../../components/SearchBox/SearchBox";
import Modal from "../../../../components/Modal/Modal";
import NoteForm from "../../../../components/NoteForm/NoteForm";
import Loader from "../../../../components/Loader/Loader";
import ErrorMessage from "../../../../components/ErrorMessage/ErrorMessage";
import css from "./NotesClient.module.css";

type Props = {
  tag?: string;
};

export default function NotesClient({ tag }: Props) {
  const [inputValue, setInputValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [debouncedValue] = useDebounce(inputValue, 300);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const { data, isLoading, error, isError, isSuccess } = useQuery({
    queryKey: ["notes", tag, debouncedValue, currentPage],
    queryFn: () =>
      fetchNotes({
        tag: tag && tag.toLowerCase() !== "all" ? tag : undefined,
        search: debouncedValue || "",
        page: currentPage,
      }),
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    setInputValue("");
    setCurrentPage(1);
  }, [tag]);

  const totalPages = data?.totalPages ?? 0;

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <Toaster position="top-center" />
        <SearchBox
          onSearch={(val) => {
            setInputValue(val);
            setCurrentPage(1);
          }}
        />
        {isLoading && <Loader />}
        {isError && (
          <ErrorMessage
            message={error instanceof Error ? error.message : "Unknown error"}
          />
        )}
        {isSuccess && totalPages > 1 && (
          <Pagination
            page={currentPage}
            total={totalPages}
            onChange={setCurrentPage}
          />
        )}
        <button className={css.button} onClick={openModal}>
          Create note +
        </button>
      </header>

      {isSuccess && data?.notes?.length === 0 && (
        <div className={css.emptyState}>
          <p>Any notes found for your request.</p>
        </div>
      )}

      {isSuccess && data?.notes && data?.notes.length > 0 && (
        <NoteList notes={data.notes} />
      )}

      {isModalOpen && (
        <Modal onClose={closeModal}>
          <NoteForm onClose={closeModal} />
        </Modal>
      )}
    </div>
  );
}
