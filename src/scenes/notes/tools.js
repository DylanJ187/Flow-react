import Paragraph from "@editorjs/paragraph";
import Header from "@editorjs/header";
import NestedList from "@editorjs/nested-list";
import Delimiter from "@editorjs/delimiter";
import CheckList from "@editorjs/checklist";
import Table from "@editorjs/table";
const SimpleImage = require("simple-image-editorjs");
const Marker = require("@editorjs/marker");

export const EDITOR_JS_TOOLS = {
  paragraph: {
    class: Paragraph,
    inlineToolbar: true,
  },
  header: {
    class: Header,
    config: {
      placeholder: "Double click to add a title...",
      levels: [1, 2, 3, 4],
      defaultLevel: 2,
    },
  },
  table: Table,
  checkList: CheckList,
  list: {
    class: NestedList,
    inlineToolbar: true,
    config: {
      defaultStyle: "unordered",
    },
  },
  simpleImage: SimpleImage,
  delimiter: Delimiter,
  Marker: {
    class: Marker,
    shortcut: "CMD+M",
  },
};
