import { useUser } from "../../auth/user";

const Logout = () => {
  const { logout } = useUser();

  return logout();
};

export default Logout;
