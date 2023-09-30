import React, { useState, useRef, useEffect } from "react";
import { ProSidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import {
  Box,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Button,
  useTheme,
  Link,
} from "@mui/material";
import { tokens } from "../../theme";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import "react-pro-sidebar/dist/css/styles.css";
import Editor from "./editor";

const uniqueID = () => Math.random().toString(36).substr(2, 9);

const Item = ({ title, to, icon, selected, setSelected, onClick, key }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <MenuItem
      active={selected === title}
      style={{ color: colors.grey[100] }}
      onClick={onClick || (() => setSelected(title))}
      icon={icon}
      key={key}
    >
      <Typography>{title}</Typography>
      <Link to={to} />
    </MenuItem>
  );
};

const INITIAL_FOLDERS = Array.from({ length: 6 }).map((_, index) => ({
  id: uniqueID(),
  title: `Subject ${index + 1}`,
  type: "folder",
  children: [],
}));

const INITIAL_DATA = {};

const findItemAndParent = (arr, id) => {
  for (const item of arr) {
    if (item.id === id) return { item, parent: arr };
    if (item.children) {
      const found = findItemAndParent(item.children, id);
      if (found) return found;
    }
  }
  return null;
};

const Notes = () => {
  const [folders, setFolders] = useState(INITIAL_FOLDERS);
  const [currentNote, setCurrentNote] = useState(null);
  const [deletePrompt, setDeletePrompt] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const editorRef = useRef(null);

  useEffect(() => {
    if (editorRef.current && currentNote && currentNote.content) {
      editorRef.current.isReady.then(() => {
        editorRef.current.clear();
        editorRef.current.render(currentNote.content);
      });
    }
  }, [currentNote]);

  const handleAddFolder = (parentId) => {
    const newFolder = {
      id: uniqueID(),
      title: "New Folder",
      type: "folder",
      children: [],
    };

    if (!parentId) {
      setFolders((prev) => [...prev, newFolder]);
      return;
    }

    const deepCopy = JSON.parse(JSON.stringify(folders));
    const parentFolder = findItemAndParent(deepCopy, parentId).item;
    parentFolder.children.push(newFolder);
    setFolders(deepCopy);
  };

  const handleAddPage = (parentId) => {
    const newPage = {
      id: uniqueID(),
      title: "New Page",
      type: "page",
      content: {
        blocks: [
          {
            type: "header",
            data: { text: `${uniqueID()}`, level: 1 },
          },
        ],
      },
    };

    const deepCopy = JSON.parse(JSON.stringify(folders));
    const parentFolder = findItemAndParent(deepCopy, parentId).item;
    parentFolder.children.push(newPage);
    setFolders(deepCopy);
  };

  const handleDeletePrompt = (id) => {
    setDeletePrompt(true);
    setDeleteTarget(id);
  };

  const handleDelete = () => {
    if (!deleteTarget) return; // Check if the delete target is valid

    const deepCopy = JSON.parse(JSON.stringify(folders));
    const { item, parent } = findItemAndParent(deepCopy, deleteTarget);

    if (item && parent) {
      parent.splice(parent.indexOf(item), 1);
      setFolders(deepCopy);

      // Reset the current note only if it matches the deleted target
      if (currentNote && currentNote.id === deleteTarget) setCurrentNote(null);
    }

    setDeletePrompt(false);
    setDeleteTarget(null);
  };

  const handleEditorChange = (newData) => {
    if (currentNote) {
      const deepCopy = JSON.parse(JSON.stringify(folders));
      const itemToUpdate = findItemAndParent(deepCopy, currentNote.id).item;
      if (itemToUpdate.type === "page") {
        itemToUpdate.content = newData;
        itemToUpdate.title =
          newData.blocks.length > 0 ? newData.blocks[0].data.text : "";

        setFolders(deepCopy);
        setCurrentNote((prev) => ({
          ...prev,
          content: newData,
          title: itemToUpdate.title,
        }));
      }
    }
  };

  const renderFolders = (items) => {
    return items.map((item) => {
      if (item.type === "folder") {
        return (
          <SubMenu key={item.id} title={item.title}>
            {item.children && renderFolders(item.children)}
            <Item
              icon={<AddIcon size="small" />}
              onClick={() => handleAddFolder(item.id)}
              title="Add Folder"
              key={uniqueID()}
            />
            <Item
              icon={<AddIcon size="small" />}
              onClick={() => handleAddPage(item.id)}
              title="Add Page"
              key={uniqueID()}
            />

            {/* Deletes Current folder, can be moved to top*/}
            <Item
              icon={<DeleteIcon size="small" />}
              onClick={() => handleDeletePrompt(item.id)}
              key={uniqueID()}
            />
          </SubMenu>
        );
      } else {
        return (
          <MenuItem
            key={item.id}
            onClick={() => {
              setCurrentNote(item);
              console.log("Current Note:", item); //checking if set current note actually fooken works
            }}
          >
            {item.title}
            <IconButton
              size="small"
              onClick={(event) => {
                handleDeletePrompt(item.id);
                event.stopPropagation();
              }}
            >
              <DeleteIcon />
            </IconButton>
          </MenuItem>
        );
      }
    });
  };

  return (
    <Box display="flex" height="100vh">
      <Dialog open={deletePrompt} onClose={() => setDeletePrompt(false)}>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this item?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDelete} color="primary">
            Delete
          </Button>
          <Button onClick={() => setDeletePrompt(false)} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
      <Box width="25%" p={2} borderRight="1px solid gray">
        <Typography variant="h4" gutterBottom>
          Notes
        </Typography>
        <ProSidebar>
          <Menu>
            {renderFolders(folders)}
            <MenuItem>
              <IconButton size="small" onClick={() => handleAddFolder(null)}>
                <AddIcon />
              </IconButton>
              Add Subject Folder
            </MenuItem>
          </Menu>
        </ProSidebar>
      </Box>
      <Box className="notes-text-area" sx={{ width: "85%", padding: "20px" }}>
        {currentNote && (
          <Box
            className="editor"
            sx={{
              backgroundColor: `${colors.notesBack[100]}`,
              height: "93.6vh",
              overflow: "auto",

              borderRadius: "0.5rem",
              "& .ce-toolbar__plus": {
                //theming the buttons
                color: `${colors.blackWhite[100]} !important`,
                "&:hover": {
                  backgroundColor: `${colors.primary[400]} !important`,
                },
              },
              "& .ce-toolbar__settings-btn": {
                color: `${colors.blackWhite[100]} !important`,
                "&:hover": {
                  backgroundColor: `${colors.primary[400]} !important`,
                },
              },
              "& .tc-toolbox--showed": {
                color: `${colors.blackWhite[200]} !important`,
              },
              "& .tc-add-row": {
                "&::before": {
                  color: "rgba(0,0,0,0) !important",
                  backgroundColor: "rgba(0,0,0,0) !important",
                },
                "&:hover": {
                  backgroundColor: `${colors.sunglasses[400]} !important`,
                  borderRadius: "5px !important",
                },
              },
              "& .tc-add-column": {
                backgroundColor: "rgba(0,0,0,0) !important",
                "&:hover": {
                  backgroundColor: `${colors.sunglasses[400]} !important`,
                  borderRadius: "5px !important",
                },
              },
              "& .tc-table": {
                backgroundColor: "rgba(0,0,0,0) !important",
              },
              "& .tc-toolbox--row": {
                backgroundColor: "rgba(0,0,0,0) !important",
              },
              "& .tc-cell--selected": {
                backgroundColor: "rgba(0,0,200,0.1) !important",
                borderRadius: "5px !important",
              },
              "& .tc-row--selected": {
                backgroundColor: "rgba(0,0,200,0.1) !important",
                borderRadius: "5px !important",
              },
              "& .tc-row--selected::after": {
                backgroundColor: "rgba(0,0,0,0) !important",
              },
              "& .tc-wrap": {
                border: "5px !important",
                borderColor: `${colors.blackWhite[100]} !important`,
              },
              "& .tc-popover__item-icon": {
                color: "#000 !important",
              },
              "& .tc-popover__item": {
                color: "#000 !important",
              },
              "& .tc-popover__item-label": {
                color: "#000 !important",
              },
              "& .ce-inline-toolbar__dropdown-content": {
                color: "#000 !important",
              },
              "& .ce-inline-toolbar__dropdown-arrow": {
                color: "#000 !important",
              },
              "& .ce-inline-toolbar__buttons": {
                color: "#000 !important",
              },
              "& a": {
                color: `${colors.blueAccent[300]}`,
              },
            }}
          >
            <Editor
              key={currentNote.id}
              data={currentNote.content}
              onChange={handleEditorChange}
              editorblock="editorjs-container"
            />
            <button onClick={() => alert(JSON.stringify(currentNote.content))}>
              Display Data
            </button>
          </Box>
        )}
      </Box>
    </Box>
  );
};
export default Notes;
