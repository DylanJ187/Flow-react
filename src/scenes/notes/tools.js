import Paragraph from "@editorjs/paragraph";
import Header from "@editorjs/header";
import List from "@editorjs/list";
/*import Link from "@editorjs/link"; */
import Delimiter from "@editorjs/delimiter";
import CheckList from "@editorjs/checklist";
import Table from "@editorjs/table";
/*import ImageTool from "@editorjs/image"; */

export const EDITOR_JS_TOOLS = {
  paragraph: {
    class: Paragraph,
    inlineToolbar: true,
  },
  header: Header,
  table: Table,
  checkList: CheckList,
  list: List,
  /*
  image: {
    class: ImageTool,
    config: {
      endpoints: {
        byFile: "http://localhost:8008/uploadFile", // Your backend file uploader endpoint
        byUrl: "http://localhost:8008/fetchUrl", // Your endpoint that provides uploading by Url
      },
    },
  }, 
  link: Link,*/
  delimiter: Delimiter,
};
