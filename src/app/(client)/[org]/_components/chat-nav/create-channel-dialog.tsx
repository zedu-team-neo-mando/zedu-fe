"use client";
import React, { useContext, useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { PlusIcon, XIcon } from "lucide-react";
import { PostRequest } from "~/utils/new-request";
import { ACTIONS } from "~/store/Actions";
import { DataContext } from "~/store/GlobalState";
import Loading from "~/components/ui/loading";
import { RequirePermission } from "~/components/rbac/RequirePermission";
import { showSuccess } from "~/components/toast/sonner";

const CreateChannelDialog = () => {
  const [channelName, setChannelName] = useState("");
  const [open, setOpen] = useState(false);
  const { state, dispatch } = useContext(DataContext);
  const { orgId, user } = state;
  const [loading, setLoading] = useState(false);
  const [visibility, setVisibility] = useState<"public" | "private">("public");

  const createChannel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!channelName || loading) return;

    setLoading(true);

    const payload = {
      name: channelName,
      organisation_id: orgId,
      is_private: visibility === "private",
      Username: user?.username || user?.email,
    };

    const res = await PostRequest(`/channels`, payload);

    if (res?.status === 200 || res?.status === 201) {
      dispatch({
        type: ACTIONS.CHANNEL_CALLBACK,
      });

      const channelId = res?.data?.data?.channels_id;
      // Fall back to the submitted name when the response omits data.name.
      const createdName = res?.data?.data?.name || channelName;
      localStorage.setItem("channelName", createdName);
      localStorage.setItem("channelId", channelId);

      showSuccess("Channel created", `#${createdName}`);

      setOpen(false);
      setChannelName("");
    }

    setLoading(false);
  };

  return (
    <RequirePermission permission="create:channels">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="border-blue-50 h-9">
            <PlusIcon className="w-5 h-5" color="#8686F9" />
            <span className="ml-1 text-[13px] font-semibold text-blue-200">
              New Channel
            </span>
          </Button>
        </DialogTrigger>

        <DialogContent>
          <div className="flex flex-col gap-5 border-[#E6EAEF]">
            <div className="flex items-center justify-between pb-4 border-b border-[#E6EAEF]">
              <h2 className="text-[#101828] font-black text-xl">
                Create a Channel
              </h2>
              <div
                className="border rounded p-1 cursor-pointer"
                onClick={() => setOpen(false)}
              >
                <XIcon size={20} />
              </div>
            </div>

            <form onSubmit={createChannel} className="flex flex-col gap-6">
              <div className="space-y-2">
                <label
                  htmlFor="name"
                  className="block text-[#344054] text-sm font-medium"
                >
                  Channel name
                </label>
                <div className="relative">
                  <Input
                    id="name"
                    value={channelName}
                    onChange={(e) =>
                      setChannelName(
                        e.target.value.replace(/\s/g, "-").toLowerCase()
                      )
                    }
                    placeholder="e.g. project-x"
                    className="text-[15px] pr-7"
                    maxLength={40}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                    {40 - channelName.length}
                  </span>
                </div>
              </div>

              <div>
                <h3 className="text-[#101828] text-[17px] font-semibold mb-2">
                  Channel Visibility
                </h3>
                <RadioGroup
                  value={visibility}
                  onValueChange={(value) =>
                    setVisibility(value as "public" | "private")
                  }
                  className="flex flex-col gap-3"
                >
                  <div className="flex items-start gap-3">
                    <RadioGroupItem
                      value="public"
                      id="public"
                      className="mt-1"
                    />
                    <label
                      htmlFor="public"
                      className="text-[15px] text-[#0A0A0A]"
                    >
                      Public - Anyone in {state?.orgData?.name}
                    </label>
                  </div>
                  <div className="flex items-start gap-3">
                    <RadioGroupItem
                      value="private"
                      id="private"
                      className="mt-1"
                    />
                    <label
                      htmlFor="private"
                      className="text-[15px] text-[#0A0A0A]"
                    >
                      Private - Only specific people
                    </label>
                  </div>
                </RadioGroup>
              </div>

              <hr />
              <p className="text-sm text-[#344054]">
                Note: Channels can house as many members as necessary.
              </p>

              <div className="flex items-center justify-end gap-4">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={!channelName || loading}
                  className="gap-1 bg-[#7141F9] hover:bg-[#5B2BF0] text-white"
                >
                  Create Channel {loading && <Loading />}
                </Button>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </RequirePermission>
  );
};

export default CreateChannelDialog;
