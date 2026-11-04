"use client";
import React, { useState, useRef, useContext, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Upload } from "lucide-react";
import Image from "next/image";
import { DataContext } from "~/store/GlobalState";
import images from "~/assets/images";
import Loading from "~/components/ui/loading";
import { ACTIONS } from "~/store/Actions";
import { Country } from "country-state-city";
import UpdateCustomSelect from "~/components/ui/update-custom-select";
import { PutRequest } from "~/utils/new-request";
import { getInitials } from "~/utils/utils";
import { getCountryName } from "~/utils/country-name";
import { showError, showSuccess } from "~/components/toast/sonner";

const EditOrganisationDialog = ({ isOpen, onClose }: any) => {
  const { state, dispatch } = useContext(DataContext);
  const { orgData: user } = state;
  const [name, setName] = useState(user?.name);
  const [type, setType] = useState(user?.type || "");
  const [avatar, setAvatar] = useState(user?.logo_url || images?.user);
  const [image, setImage] = useState("");
  const [isReadingImage, setIsReadingImage] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [country, setCountry] = useState<any>(null);
  const [countries, setCountries] = useState<any>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const activeReaderRef = useRef<FileReader | null>(null);
  const previewUrlRef = useRef<string | null>(null);

  const stopReadingImage = () => {
    const reader = activeReaderRef.current;
    activeReaderRef.current = null;
    if (reader?.readyState === FileReader.LOADING) reader.abort();
    if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    previewUrlRef.current = null;
    setIsReadingImage(false);
  };

  useEffect(() => {
    if (!isOpen) {
      stopReadingImage();
      setAvatar(user?.logo_url);
      setImage("");
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
    return () => {
      stopReadingImage();
    };
  }, [isOpen, user?.logo_url]);

  useEffect(() => {
    setName(user?.name);
    setType(user?.type);
    setAvatar(user?.logo_url);

    if (user?.country && countries.length > 0) {
      const countryName = getCountryName(user.country).toLowerCase();
      const matchedCountry = countries?.find(
        (c: any) => c.value.toLowerCase() === countryName
      );
      setCountry(matchedCountry || null);
    }
  }, [user, countries]);

  useEffect(() => {
    const allcountries = Country.getAllCountries();
    const response = allcountries?.map((item) => ({
      label: item.name,
      value: item.name,
    }));

    setCountries(response);
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    const orgId = localStorage.getItem("orgId");
    event.preventDefault();
    if (activeReaderRef.current || isReadingImage) return;

    setButtonLoading(true);

    let payload = {
      name,
      description: user?.description || "",
      email: user?.email,
      type,
      location: user?.location || "",
      country: country?.value,
      logo_url: avatar ? image || user?.logo_url || "" : "",
    };

    const res = await PutRequest(`/organisations/${orgId}`, payload);
    if (res?.status === 200 || res?.status === 201) {
      dispatch({ type: ACTIONS.CALLBACK, payload: !state?.callback });
      showSuccess(res?.data.message);
      onClose();
    }
    setButtonLoading(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file?.type !== "image/jpeg" && file?.type !== "image/png") {
      return showError("Image type is not supported");
    }

    if (file) {
      stopReadingImage();
      const url = URL.createObjectURL(file);
      previewUrlRef.current = url;
      setAvatar(url);
      setImage("");

      const reader = new FileReader();
      activeReaderRef.current = reader;
      setIsReadingImage(true);
      reader.onloadend = () => {
        if (activeReaderRef.current !== reader) return;
        activeReaderRef.current = null;
        if (typeof reader.result === "string") {
          setImage(reader.result);
        } else {
          setAvatar(user?.logo_url || "");
          if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
          previewUrlRef.current = null;
          showError("Could not read the selected image");
        }
        setIsReadingImage(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    stopReadingImage();
    setAvatar("");
    setImage("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  //

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[90%] max-w-md p-4 sm:max-w-[700px] max-h-[90vh] flex flex-col">
        <DialogHeader className={`px-4 pb-0`}>
          <DialogTitle className="text-[#1D2939] text-xl font-black">
            Update organisation details
          </DialogTitle>
        </DialogHeader>

        <div
          ref={contentRef}
          className={`flex-1 overflow-y-auto border-t border-[#E6EAEF] space-y-5 py-6 sm:scrollbar-hide`}
        >
          <div className="flex flex-col sm:flex-row">
            {/* Left side - Form fields */}
            <div className="flex-1 px-4 space-y-5">
              {/* Full Name */}
              <div className="space-y-2">
                <label
                  htmlFor="name"
                  className="text-sm text-[#101828] font-bold"
                >
                  Organisation Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-[#E6EAEF] rounded-md text-[15px] text-[#344054] focus:outline-none focus:ring-2 focus:ring-[#6868F7]"
                />
              </div>

              {/* Title/Role */}
              <div className="space-y-2">
                <label
                  htmlFor="title"
                  className="text-sm text-[#101828] font-bold"
                >
                  Nature of Business
                </label>
                <input
                  id="title"
                  type="text"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full px-3 py-2 border border-[#E6EAEF] rounded-md text-[15px] text-[#344054] focus:outline-none focus:ring-2 focus:ring-[#6868F7]"
                />
              </div>

              <div className="space-y-2 z-80">
                <label
                  htmlFor="title"
                  className="text-sm text-[#101828] font-bold"
                >
                  Country
                </label>

                <UpdateCustomSelect
                  options={countries}
                  placeholder="Select an option..."
                  onChange={setCountry}
                  defaultValue={country}
                  isDisabled={false}
                />
              </div>
            </div>

            {/* Right side - Profile Picture */}
            <div className="w-full px-4 py-3 space-y-6 sm:w-[230px] sm:pl-6 sm:pr-3">
              <div className="space-y-2">
                <h3 className="text-sm text-[#101828] font-bold">
                  Organisation Logo
                </h3>
                <div className="flex flex-col items-start gap-4">
                  {avatar ? (
                    <div className="relative w-full aspect-square border rounded-[9px] sm:w-[192px] sm:h-[192px]">
                      <Image
                        src={avatar}
                        alt={name}
                        width={192}
                        height={192}
                        className="rounded-[9px] object-cover w-full h-full"
                      />
                    </div>
                  ) : (
                    <div className="w-full aspect-square border object-cover rounded-xl flex items-center justify-center text-3xl text-blue-200 font-bold sm:w-[192px] sm:h-[192px]">
                      {getInitials(name)}
                    </div>
                  )}
                  <div className="space-y-1 w-full">
                    <Button
                      variant="outline"
                      onClick={triggerFileInput}
                      className="text-[13px] h-8 text-[#344054] border-[#E6EAEF] gap-2 w-full flex items-center justify-center"
                    >
                      <Upload size={14} />
                      <span>Upload photo</span>
                    </Button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                    <Button
                      onClick={handleRemovePhoto}
                      className="text-[13px] h-8 text-[#6868F7] gap-2 py-0 w-full"
                    >
                      Remove photo
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 px-4 py-5 border-t border-[#E6EAEF] bg-white">
          <Button
            variant="outline"
            onClick={onClose}
            className="text-sm text-[#344054] h-9 border-[#E6EAEF]"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            className="d-flex items-center gap-2 bg-[#6868F7] text-white h-9 text-sm hover:bg-[#5151d3]"
            disabled={buttonLoading || isReadingImage}
          >
            Save Changes {buttonLoading && <Loading />}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditOrganisationDialog;
