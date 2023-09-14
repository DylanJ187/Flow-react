import { Box } from "@mui/material";
import Header from "../../components/Header";

const Profile = () => {
  return (
    <Box className="Container" m="10vh 20px 20px 20px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="PROFILE" subtitle="Welcome to your profile." />
      </Box>
    </Box>
  );
};

export default Profile;
