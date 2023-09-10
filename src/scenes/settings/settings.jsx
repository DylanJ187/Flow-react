import { Box } from "@mui/material";
import Header from "../../components/Header";

const Settings = () => {
  return (
    <Box className="Container" m="10vh 20px 20px 20px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="SETTINGS" subtitle="Customize flow." />
      </Box>
    </Box>
  );
};

export default Settings;
