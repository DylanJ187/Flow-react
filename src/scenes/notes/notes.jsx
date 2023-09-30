import React, { useState, useRef, useEffect, useContext } from "react";
import { ProSidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import { SubjectContext } from "./../../App";
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
import DeleteIcon from "@mui/icons-material/Delete";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import ArticleIcon from "@mui/icons-material/Article";
import FolderIcon from "@mui/icons-material/Folder";
import "react-pro-sidebar/dist/css/styles.css";
import Editor from "./editor";
import ClearIcon from "@mui/icons-material/Clear";

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
  const [currentNote, setCurrentNote] = useState(null);
  const [deletePrompt, setDeletePrompt] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const editorRef = useRef(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingFolderId, setEditingFolderId] = useState(null);
  const [editedTitle, setEditedTitle] = useState("");
  const [openSubMenus, setOpenSubMenus] = useState([]);

  const { subjectArray } = useContext(SubjectContext);

  const INITIAL_FOLDERS = [
    ...subjectArray.slice(0, 6).map((subject, index) => ({
      id: uniqueID(),
      title: subject,
      type: "folder",
      children: [],
    })),
    {
      id: uniqueID(),
      title: "Core",
      type: "folder",
      children: [],
    },
  ];

  const [folders, setFolders] = useState(INITIAL_FOLDERS);

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
            data: { text: `New Page`, level: 1 },
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

  const renderFolders = (items, isSubfolder = false, depth = 0) => {
    return items.map((item) => {
      const toggleSubMenu = (id) => {
        if (openSubMenus.includes(id)) {
          setOpenSubMenus((prev) => prev.filter((menuId) => menuId !== id));
        } else {
          setOpenSubMenus((prev) => [...prev, id]);
        }
      };

      if (item.type === "folder") {
        const isCurrentEditing = isEditing && editingFolderId === item.id;
        const titleContent = isCurrentEditing ? (
          <input
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            onBlur={() => {
              const deepCopy = JSON.parse(JSON.stringify(folders));
              const itemToEdit = findItemAndParent(deepCopy, item.id).item;
              itemToEdit.title = editedTitle;
              setFolders(deepCopy);
              setIsEditing(false);
              setEditingFolderId(null);
              setEditedTitle("");
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                e.currentTarget.blur(); // This will trigger the onBlur event
              }
            }}
          />
        ) : (
          item.title
        );
        return (
          <SubMenu
            key={item.id}
            onTitleClick={() => toggleSubMenu(item.id)}
            title={
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                width="100%"
              >
                {titleContent}
                <Box display="flex" alignItems="center">
                  {depth !== 2 && (
                    <IconButton
                      size="small"
                      onClick={(event) => {
                        if (!openSubMenus.includes(item.id)) {
                          toggleSubMenu(item.id); // Toggle the submenu if it's collapsed
                        } else {
                          event.stopPropagation(); // If expanded, stop propagation to avoid collapsing it
                        }
                        handleAddFolder(item.id);
                      }}
                      key={uniqueID()}
                    >
                      <CreateNewFolderIcon
                        sx={{ fontSize: "16px !important" }}
                      />
                    </IconButton>
                  )}
                  <IconButton
                    size="small"
                    onClick={(event) => {
                      if (!openSubMenus.includes(item.id)) {
                        toggleSubMenu(item.id); // Toggle the submenu if it's collapsed
                      } else {
                        event.stopPropagation(); // If expanded, stop propagation to avoid collapsing it
                      }
                      handleAddPage(item.id);
                    }}
                    key={uniqueID()}
                  >
                    <NoteAddIcon sx={{ fontSize: "16px !important" }} />
                  </IconButton>

                  {isSubfolder && (
                    <IconButton
                      onClick={(event) => {
                        handleDeletePrompt(item.id);
                        event.stopPropagation();
                      }}
                      key={uniqueID()}
                    >
                      <DeleteIcon sx={{ fontSize: "16px !important" }} />
                    </IconButton>
                  )}
                </Box>
              </Box>
            }
            icon={<FolderIcon />}
            onDoubleClick={
              isSubfolder
                ? () => {
                    // Check if it's a subfolder
                    if (!isCurrentEditing) {
                      setIsEditing(true);
                      setEditingFolderId(item.id);
                      setEditedTitle(item.title);
                    }
                  }
                : null
            } // If not a subfolder, don't assign any double-click action
          >
            {item.children && renderFolders(item.children, true, depth + 1)}
          </SubMenu>
        );
      } else {
        return (
          <MenuItem
            key={item.id}
            icon={<ArticleIcon />}
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
              <ClearIcon sx={{ fontSize: "16px" }} />
            </IconButton>
          </MenuItem>
        );
      }
    });
  };

  return (
    <Box display="flex" height="100vh" width="100%">
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
      <Box
        width="25%"
        height="100vh "
        borderRight="1px solid gray"
        borderLeft="1px solid gray"
      >
        <Box
          sx={{
            "& .pro-sidebar-inner": {
              background: `${colors.notesBack[100]} !important`,
              paddingTop: "15px",
            },
            "& .react-slidedown": {
              background: `rgba(0,0,0,0) !important`,
            },
            "& .pro-icon-wrapper": {
              backgroundColor: "transparent !important",
            },
            "& .pro-inner-item": {
              padding: "0px 35px 0px 20px !important",
            },
            "& .pro-inner-item:hover": {
              color: "#868dfb !important",
            },
            "& .pro-menu-item.active": {
              color: "#868dfb !important",
            },
            "& .css-1phms0m": {
              margin: "0px !important",
            },
            "& .pro-item-content": {
              color: `${colors.blackWhite[100]} !important`,
            },
            "& .pro-arrow": {
              color: `${colors.primary[400]} !important`,
            },
            ".react-slidedown > div": {
              borderLeft: "0.5px solid gray !important",
            },
            "& .react-slidedown > div > ul": {
              paddingBottom: "50px",
              margin: "0px",
            },
            height: "100%",
          }}
        >
          <ProSidebar
            width="100%"
            style={{
              height: "100vh",
              overflow: "auto",
            }}
          >
            <Menu>
              {renderFolders(folders)}
              {/*<Item
                icon={<AddIcon size="small" />}
                onClick={() => handleAddFolder(null)}
                title="Add Subject Folder"
                key={uniqueID()}
          />*/}
            </Menu>
          </ProSidebar>
        </Box>
      </Box>
      <Box
        className="notes-text-area"
        sx={{
          width: "75%",
          height: "100vh",
          minWidth: "300px",
          overflow: "auto",
        }}
      >
        {currentNote && (
          <Box
            className="editor"
            sx={{
              backgroundColor: `${colors.notesBack[100]}`,
              height: "100%",
              paddingTop: "15px",
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
              overflow: "auto",
            }}
          >
            <Editor
              key={currentNote.id}
              data={currentNote.content}
              onChange={handleEditorChange}
              editorblock="editorjs-container"
            />
            {/*
            IF YOU WANNA GET THE DATA OF THE NOTES ITS IN currentNote.content SO U CAN USE THIS BUTTON IF U WANT TO SEE THE DATA HAHAHA IM GOING FUCKING
            
            <button onClick={() => alert(JSON.stringify(currentNote.content))}>
              Display Data
            </button>
          */}
          </Box>
        )}
      </Box>
    </Box>
  );
};
export default Notes;
