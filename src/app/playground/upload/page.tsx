"use client";

import FileDropzone from "@/components/ui/inputFile";

export default function Page() {
  return (
    <div className="p-10">
      <FileDropzone
        accept="image/*"
        multiple={false}
        maxSizeMB={3}
        onFilesChange={(files) => console.log(files)}
      />
    </div>
  );
}
