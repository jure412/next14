import { validateRequest } from "../../../../utils/auth";
import Typography from "../../components/Typography";
import ClientUser from "../../modules/ClientUser";

export default async function Protected() {
  const { user } = await validateRequest();
  return (
    <div className="container mx-auto px-6 py-8">
      <Typography p>{user?.username}</Typography>
      <ClientUser />
    </div>
  );
}
