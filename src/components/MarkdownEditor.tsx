"use client"; // Penting karena menggunakan useEffect

import { useEffect, useRef } from "react";
import EasyMDE from "easymde";
import "easymde/dist/easymde.min.css";

export default function MarkdownEditor({ content = "", onChange }) {
  const textareaRef = useRef(null);
  const editorRef = useRef(null);

  useEffect(() => {
    // Inisialisasi EasyMDE
    editorRef.current = new EasyMDE({
      element: textareaRef.current,
      spellChecker: false, // Matikan jika tidak butuh
    });

    // Menangkap perubahan konten
    editorRef?.current?.codemirror?.on("change", () => {
      const content = editorRef?.current.value();
      onChange(content);
    });

    // Cleanup saat komponen unmount
    return () => {
      if (editorRef?.current) {
        editorRef?.current.toTextArea();
        editorRef.current = null;
      }
    };
  }, [onChange]);

  return <textarea ref={textareaRef} defaultValue={content} />;
}
