declare module "react-file-viewer" {
  import * as React from "react";

  export interface FileViewerProps {
    fileType: string;
    filePath: string;
    onError?: (error: unknown) => void;
    style?: React.CSSProperties;
  }

  const FileViewer: React.ComponentType<FileViewerProps>;
  export default FileViewer;
}
