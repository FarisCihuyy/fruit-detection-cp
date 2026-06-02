"use client";

import FileDropzone from "@/components/ui/inputFile";

export default function Page() {
  return <FileDropzone accept="image/*" multiple={false} maxSizeMB={3} />;
}
