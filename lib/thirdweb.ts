import { createThirdwebClient } from "thirdweb";

export const client = createThirdwebClient({
  // use clientId for client side usage
  clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID as string,
  // use secretKey for server side usage
  secretKey: process.env.THIRDWEB_CLIENT_SECRET as string, // replace this with full secret key
});
