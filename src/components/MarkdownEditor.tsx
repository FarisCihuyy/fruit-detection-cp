"use client"; // Penting karena menggunakan useEffect

import { useEffect, useRef } from "react";
import EasyMDE from "easymde";
import "easymde/dist/easymde.min.css";

interface MarkdownEditorProps {
  content?: string;
  onChange: (value: string) => void;
}

export default function MarkdownEditor({
  content = "",
  onChange,
}: MarkdownEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const editorRef = useRef<EasyMDE | null>(null);

  useEffect(() => {
    if (!textareaRef.current) return;

    // Inisialisasi EasyMDE
    editorRef.current = new EasyMDE({
      element: textareaRef.current,
      spellChecker: false, // Matikan jika tidak butuh
    });

    // Menangkap perubahan konten
    editorRef.current.codemirror.on("change", () => {
      if (editorRef.current) {
        onChange(editorRef.current.value());
      }
    });

    // Cleanup saat komponen unmount
    return () => {
      if (editorRef.current) {
        editorRef.current.toTextArea();
        editorRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Hapus onChange dari dependencies agar tidak memicu re-render

  return <textarea ref={textareaRef} defaultValue={content} />;
}
