"use client";

import FileDropzone from "@/components/ui/inputFile";

const Playground = () => {
  return <FileDropzone accept="image/*" multiple={false} maxSizeMB={3} />;
};

export default Playground;
