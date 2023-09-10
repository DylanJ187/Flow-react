import React, { useState } from "react";
import { Box, useTheme } from "@mui/material";
import "./Modal.css";
import { tokens } from "../../theme";

const Modal = ({ closeModal, onSubmit, defaultValue }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [formState, setFormState] = useState(
    defaultValue || {
      subject: "hl-chemistry",
      description: "",
      status: "not-Started",
    }
  );
  const [errors, setErrors] = useState("");

  const validateForm = () => {
    if (formState.subject && formState.description && formState.status) {
      setErrors("");
      return true;
    } else {
      let errorFields = [];
      for (const [key, value] of Object.entries(formState)) {
        if (!value) {
          errorFields.push(key);
        }
      }
      setErrors(errorFields.join(", "));
      return false;
    }
  };

  const handleChange = (e) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    if (typeof onSubmit === "function") {
      onSubmit(formState);
      closeModal();
    } else {
      console.log("onSubmit prop is not provided or is not a function");
    }
  };

  return (
    <Box
      className="modal-container"
      onClick={(e) => {
        if (e.target.className === "modal-container") closeModal();
      }}
    >
      <Box className="modal" backgroundColor={colors.primary[400]}>
        <form>
          <Box className="form-group">
            <label htmlFor="subject">Subject</label>
            <select
              name="subject"
              onChange={handleChange}
              value={formState.subject}
            >
              <option value="hl-chemistry"> HL Chemistry</option>
              <option value="hl-physics">HL Physics</option>
              <option value="hl-maths-aa">HL Maths</option>
              <option value="sl-economics">SL Economics</option>
              <option value="sl-japanese-b">SL Japanese B</option>
              <option value="sl-langlit-a">SL LangLit A</option>

              {/*make this part dynamic using a survey at the start as to what IB specific subjects they take */}
            </select>
          </Box>
          <Box className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              name="description"
              onChange={handleChange}
              value={formState.description}
              autoComplete="off"
              backgroundColor={colors.primary[400]}
            />
          </Box>
          <Box className="form-group">
            <label htmlFor="status">Status</label>
            <select
              name="status"
              onChange={handleChange}
              value={formState.status}
            >
              <option value="not-Started">Not Started</option>
              <option value="in-Progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="overdue">Overdue</option>
            </select>
          </Box>
          {errors && <Box className="error">{`Please include: ${errors}`}</Box>}
          <button type="submit" className="submit-btn" onClick={handleSubmit}>
            Submit
          </button>
        </form>
      </Box>
    </Box>
  );
};

export default Modal;
