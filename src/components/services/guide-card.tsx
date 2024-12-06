"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";
import { Text } from "../ui/text";
import { TUser, TUserDeep } from "@/types/auth";
import EverestImg from "/public/images/everest.png";
import { Dispatch, SetStateAction, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronLeftCircle, UserIcon } from "lucide-react";
import {
  TGuideDialogType,
  useGuideDialog,
} from "@/store/get-guide-dialog-type";
import { MessageDialog } from "./message-dialog";
import { cn } from "@/lib/utils";
import { BookAppointmentDialog } from "./book-appointment";

export const GuideCard = ({ user }: { user: TUserDeep }) => {
  const [showCard, setShowCard] = useState(false);
  return (
    <Dialog>
      <DialogTrigger
        className="group rounded-tr-[43px] bg-neutral-100 pb-2 pl-2 pr-4 pt-4 text-center font-poppins transition-all ease-in-out hover:bg-primary"
        onClick={() => setShowCard(!showCard)}
      >
        {user.profilePicture ? (
          <Image
            src={user.profilePicture.url}
            width={user.profilePicture.width}
            height={user.profilePicture.height}
            alt={user.profilePicture.name || user.username + " profile picture"}
            className="aspect-square rounded-tr-[35px] object-cover"
          />
        ) : (
          <div className="relative mx-auto grid w-fit place-items-center rounded-full bg-white p-5">
            <UserIcon size={48} />
          </div>
        )}
        <div className="flex flex-col py-8">
          <Text
            variant={"text-lg"}
            className="font-extrabold capitalize group-hover:text-background"
          >
            {user.username}
          </Text>
          <span className="flex flex-col gap-y-2">
            <Text
              variant={"text-sm"}
              className="capitalize group-hover:text-background"
            >
              Trekker
            </Text>

            <Text
              variant={"text-sm"}
              className="capitalize group-hover:text-background"
            >
              Extreme Adventure
            </Text>
          </span>
        </div>
      </DialogTrigger>
      <GuideCardOverlay user={user} setShowCard={setShowCard} />
    </Dialog>
  );
};
const GuideCardOverlay = ({
  user,
  setShowCard,
}: {
  user: TUserDeep;
  setShowCard: Dispatch<SetStateAction<boolean>>;
}) => {
  const { type, setType, setDialogOpen } = useGuideDialog();

  const typeMap: { [key in TGuideDialogType]: React.ReactNode } = {
    details: <UserDetails user={user} />,
    message: <MessageDialog user={user} />,
    appointments: <BookAppointmentDialog user={user} />,
  };
  return (
    <DialogContent
      className={cn(
        type === "details" && "lg:pb-48",
        "table-scrollbar max-h-[90vh] overflow-auto rounded-3xl bg-black py-10 font-poppins text-white sm:rounded-3xl lg:py-20",
      )}
    >
      {/* Go back button for when it's other dialog than details*/}
      {type !== "details" && (
        <span
          onClick={() => setType("details")}
          className="absolute left-4 top-4 cursor-pointer text-primary"
        >
          <ChevronLeftCircle size={30} />
        </span>
      )}
      {/*Overlay image*/}
      <Image
        src={EverestImg}
        alt="Cover image"
        className="absolute -z-10 h-full w-full object-cover opacity-90"
      />
      <div className="flex flex-col place-items-center gap-y-8">
        {user.profilePicture && (
          <Image
            src={user.profilePicture.url}
            width={user.profilePicture.width}
            height={user.profilePicture.height}
            alt={user.profilePicture.name || user.username + " profile picture"}
            className="aspect-square size-24 rounded-full border-2 border-primary object-cover"
          />
        )}
        <Text variant="text-md">{user?.username}</Text>
      </div>
      {typeMap[type]}
    </DialogContent>
  );
};
const UserDetails = ({ user }: { user: TUserDeep }) => {
  const { type, setType, setDialogOpen } = useGuideDialog();
  const socialMedia = {
    facebook: user.about?.facebook,
    instagram: user.about?.instagram,
    whatsapp: user.about?.whatsapp,
  };
  return (
    <div className="relative space-y-8">
      {user?.contact?.birthday && (
        <span className="flex items-center gap-3">
          <Text variant="text-sm" bold>
            Date of birth
          </Text>
          <Button className="bg-white text-black hover:bg-white/80">
            {user.contact?.birthday}
          </Button>
        </span>
      )}
      {user?.about?.description && (
        <Text variant="text-sm">{user.about.description}</Text>
      )}
      <div className="grid grid-cols-[auto_14px_auto] gap-4">
        <Text variant="text-sm">Service Provided</Text>
        <Text variant="text-sm">:</Text>
        <Text variant="text-sm">Lorem</Text>

        {user?.email && (
          <>
            <Text variant="text-sm">Email</Text>
            <Text variant="text-sm">:</Text>
            <Text variant="text-sm">{user.email}</Text>
          </>
        )}
        {user?.contact?.phone && (
          <>
            <Text variant="text-sm">Contact no.</Text>
            <Text variant="text-sm">:</Text>
            <Text variant="text-sm">{user.contact.phone}</Text>
          </>
        )}

        {user?.contact?.address && (
          <>
            <Text variant="text-sm">Address</Text>
            <Text variant="text-sm">:</Text>
            <Text variant="text-sm">{user.contact.address}</Text>
          </>
        )}
      </div>
      <div className="flex flex-col gap-4 lg:gap-6 [&>button]:py-2 [&>button]:font-semibold [&>button]:lg:py-6">
        <Link href={`/profile/${user.id}`}>
          <Button className="w-full rounded-xl py-2 font-semibold md:py-6">
            Full Profile
          </Button>
        </Link>
        <Button
          className="w-full rounded-xl"
          onClick={() => setType("message")}
        >
          Message
        </Button>
        <Button
          className="w-full rounded-xl bg-gray-200 text-black"
          onClick={() => setType("appointments")}
        >
          Book an appointment
        </Button>
      </div>
    </div>
  );
};
