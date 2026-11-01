import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { GetRequest } from "~/utils/request";

interface OrganizationType {
  id: string;
  orgName: string;
  orgEmail: string;
  orgOwnerId: string;
  orgOwnerName: string;
  usersLength: number;
}

const useAcceptOrgInvite = () => {
  const searchParams = useSearchParams();
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const [organization, setOrganization] = useState<OrganizationType>();
  const [userToken, setUserToken] = useState("");
  const [loading, setLoading] = useState(true);
  const org_id = searchParams.get("org_id");
  const invitation_token = searchParams.get("invitation_token");

  useEffect(() => {
    const token = localStorage.getItem("token") || "";
    setUserToken(token);

    if (org_id) {
      localStorage.setItem("orgId", org_id);

      const getOrgDetails = async () => {
        const res = await GetRequest(`/organisations/${org_id}`, token);
        if (res?.status === 200 || res?.status === 201) {
          setOrganization({
            id: res?.data?.data?.id,
            orgName: res?.data?.data?.name,
            orgEmail: res?.data?.data?.email,
            orgOwnerId: res?.data?.data?.owner_id,
            orgOwnerName: res?.data?.data?.owner_name,
            usersLength: res?.data?.data?.users?.length,
          });
        }
        setLoading(false);
      };
      getOrgDetails();
    }
  }, [org_id]);

  return {
    baseUrl,
    userToken,
    organization,
    invitation_token,
    org_id,
    loading,
  };
};

export default useAcceptOrgInvite;
