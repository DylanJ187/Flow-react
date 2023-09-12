import { Box } from "@mui/material";
import Header from "../../components/Header";

const Notes = () => {
  return (
    <Box className="Container" m="10vh 20px 20px 20px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="Notes" subtitle="Write your notes here." />
      </Box>
    </Box>
  );
};

export default Notes;
