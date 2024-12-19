"use client";
/* eslint-disable react/no-unescaped-entities */
import Image from "next/image";
import React, { useState } from "react";
import qs from "qs";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "./select-outline";

import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Badge } from "@/components/ui/badge";
import { Button } from "../ui/button";
import { m, domMax, LazyMotion } from "framer-motion";
import { Text } from "../ui/text";
import {
  BookAppointmentFormSchema,
  TBookAppointmentSchemaProvider,
} from "@/validators/book-appointment-validator";
import { useForm, UseFormGetValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { makeAppointment } from "@/server/appointments/post-appointment";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { APIResponseCollection } from "@/types/types";
import { endOfDay, format, startOfDay, subDays } from "date-fns";
import { Skeleton } from "../ui/skeleton";
import { toast } from "sonner";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { cn } from "@/lib/utils";
import { PhoneInput } from "@/components/ui/phone-input";
import { Calendar } from "../ui/calendar";
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { TUser } from "@/types/auth";
import axios from "axios";
import { getUsers } from "@/server/users/get-users";
import { axiosInstance } from "@/lib/server-axios-instance";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
const CloudImage = ({ src, alt, position }: any) => (
  <div className={`absolute ${position} w-full`}>
    <Image src={src} alt={alt} width={1920} height={150} className="w-full" />
  </div>
);

export default function BookAppointment() {
  const [book, setBook] = useState(false);
  return (
    <LazyMotion features={domMax}>
      <m.section
        initial={{ opacity: 0, y: "-10%" }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative my-8 flex min-h-[60vh] items-center bg-cover bg-center bg-no-repeat lg:my-16 lg:min-h-[80vh]"
        style={{
          backgroundImage: "url('/images/experts.jpeg')",
          filter: "grayscale(100%)",
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>

        <div className="from-gray absolute top-0 h-20 w-full bg-gradient-to-b"></div>
        {!book ? (
          <div className="container py-8 lg:py-16">
            <div className="relative z-10 text-white lg:text-center">
              <h1 className="comp-heading mb-6">Talk to Experts</h1>
              <Button
                className="rounded-full border border-white bg-transparent px-10 py-8 text-base text-white lg:text-xl"
                onClick={() => setBook(true)}
              >
                Book An Appointment
              </Button>
            </div>
          </div>
        ) : (
          <AppointmentForm />
        )}

        <CloudImage
          src="/images/cloudup.png"
          alt="cloud"
          position="left-0 top-0 lg:-top-12"
        />
        <CloudImage
          src="/images/cloud.png"
          alt="cloud"
          position="bottom-0 left-0 lg:-bottom-10"
        />
      </m.section>
    </LazyMotion>
  );
}
const AppointmentForm = () => {
  const [step, setStep] = useState(1);

  const [activeTime, setActiveTime] = useState(0);
  const [loading, setLoading] = useState(false);
  const form = useForm<TBookAppointmentSchemaProvider>({
    resolver: zodResolver(BookAppointmentFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      expectation: "",
      appointment_date: new Date(),
      //guide: 14,
    },
  });
  const {
    data: guides,
    isLoading: isLoadingGuides,
    isError: isErrorGuides,
  } = useQuery<TUser[]>({
    queryKey: ["guides"],
    queryFn: async () => {
      try {
        const params = new URLSearchParams();
        params.set("filters[userType][$eqi]", "merchant");
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_STRAPI_URL}api/users?${params.toString()}&populate[0]=profilePicture`,
        );
        return res.data;
      } catch (error) {
        console.log(error);
      }
    },
  });

  const {
    data: packages,
    isLoading: isLoadingPackages,
    isError: isErrorPackages,
  } = useQuery<APIResponseCollection<"api::package.package">>({
    queryKey: ["packages-appointment"],
    queryFn: async () => {
      try {
        const params = new URLSearchParams();
        params.set("filters[userType][$eqi]", "merchant");
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_STRAPI_URL}api/packages`,
        );
        return res.data;
      } catch (error) {
        console.log(error);
      }
    },
  });

  const {
    data: availableTime,
    isLoading,
    isError,
  } = useQuery<APIResponseCollection<"api::calendar.calendar">>({
    queryKey: ["calendars", form.watch("appointment_date")],
    queryFn: async () => {
      const getDateBounds = (dateStr: string) => {
        console.log(dateStr);
        const date = new Date(dateStr);

        return {
          start: startOfDay(date),
          end: endOfDay(date),
        };
      };
      const { start, end } = getDateBounds(
        form.getValues("appointment_date").toString(),
      );
      try {
        const query = qs.stringify({
          filters: {
            guides: {
              id: form.getValues().guide,
            },
            is_available: true,
            $and: [
              {
                start_date: {
                  $lte: end,
                },
              },
              {
                end_date: {
                  $gte: start,
                },
              },
            ],
          },
        });
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_STRAPI_URL}api/calendars?${query}`,
        );
        const data = await res.json();
        return data;
      } catch (err) {
        console.log(err);
      }
    },
    placeholderData: keepPreviousData,
  });

  async function onSubmit(values: TBookAppointmentSchemaProvider) {
    console.log("Not even here");
    setLoading(true);
    const appointment_date = availableTime?.data.find(
      (i) => i.id === activeTime,
    )?.attributes.start_date;
    if (!appointment_date) {
      setLoading(false);
      toast.success("Appointment date is invalid");
      return;
    }
    const payload = {
      ...form.getValues(),
      appointment_date: new Date(appointment_date),
    };
    const res = await makeAppointment(payload);
    if (res.status === 200) {
      setLoading(false);
      toast.success("Successfully made an appointment!");
    } else {
      setLoading(false);
      toast.error(`${res?.error?.message}`);
    }
  }
  const tw =
    "rounded-none border-0 border-b-2 bg-transparent text-base placeholder:text-white text-white";
  return (
    <div className="container relative py-8 lg:py-16">
      <div className="relative z-10 space-y-6 text-white lg:text-center">
        <h1 className="comp-heading uppercase tracking-wider">
          Book an Appointment
        </h1>
        <Text
          as="h3"
          variant="display-sm"
          className="text-3xl uppercase tracking-wide"
          bold
        >
          {step === 1 ? "Select package & date" : "Contact Details"}
        </Text>
        <Form {...form}>
          <form
            className="relative z-20 mx-auto max-w-screen-md space-y-3 text-black md:space-y-4"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <span
              className={cn(
                step === 1 ? "flex" : "hidden",
                "w-full flex-col justify-center gap-x-5 transition-all ease-in-out md:flex-row md:items-center",
              )}
            >
              <FormField
                control={form.control}
                name="package"
                render={({ field }) => (
                  <FormItem>
                    {/*TODO: use combobox*/}
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value?.toString()}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select package" />
                        </SelectTrigger>
                        <SelectContent>
                          {isLoadingPackages ? (
                            <p>Loading...</p>
                          ) : !packages?.data || packages.data.length === 0 ? (
                            <p>No package available</p>
                          ) : (
                            packages.data.map((i) => (
                              <SelectItem
                                value={i.id.toString()}
                                key={`package--${i.id}`}
                                className=""
                              >
                                <div className="flex flex-row items-center gap-x-2">
                                  {i.attributes.package_name}
                                </div>
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="guide"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value?.toString()}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Guide" />
                        </SelectTrigger>
                        <SelectContent>
                          {isLoadingGuides ? (
                            <p>Loading...</p>
                          ) : !guides || guides.length === 0 ? (
                            <p>No guides available</p>
                          ) : (
                            guides.map((i) => (
                              <SelectItem
                                value={i.id.toString()}
                                key={`user-merchant-${i.id}`}
                                className=""
                              >
                                <div className="flex flex-row items-center gap-x-2">
                                  <Avatar className="hidden h-fit w-fit">
                                    {i.profilePicture && (
                                      <AvatarImage
                                        src={i.profilePicture?.url}
                                        className="size-6 rounded-full object-cover"
                                        height={8}
                                        width={8}
                                      />
                                    )}
                                    <AvatarFallback className="hidden bg-black text-white">
                                      {i.username}
                                    </AvatarFallback>
                                  </Avatar>
                                  {i.username}
                                </div>
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="appointment_date"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full items-center gap-x-2 rounded-none border-0 border-b-2 bg-transparent pl-3 text-left text-base font-normal text-white hover:bg-transparent hover:text-white",
                                !field.value && "text-muted-foreground",
                              )}
                            >
                              {field.value ? (
                                format(field.value, "dd, MMM, yyyy ")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date < subDays(new Date(), 1) ||
                              date < new Date("1900-01-01")
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </span>
            <span
              className={cn(step === 2 ? "grid grid-cols-2 gap-4" : "hidden")}
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <Label required className="text-white">
                      Name
                    </Label>
                    <FormControl>
                      <Input
                        className={tw}
                        placeholder="John Doe"
                        {...field}
                        required
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <Label required className="text-white">
                      Email
                    </Label>
                    <FormControl>
                      <Input
                        className={tw}
                        placeholder="john.doe@email.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <Label required className="text-white">
                      Phone
                    </Label>

                    <FormControl>
                      <Input className={tw} placeholder="Phone" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="expectation"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <Label required className="text-white">
                      Message
                    </Label>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Your expectation"
                        className={tw}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </span>

            <div className={cn(step === 1 ? "block" : "hidden")}>
              <Text
                as="h3"
                variant="text-xl"
                className="text-3xlmb-6 mx-auto w-fit capitalize tracking-wider text-white drop-shadow-md"
                bold
              >
                Select time
              </Text>
              {availableTime?.data && availableTime?.data?.length > 0 ? (
                <span className="flex flex-wrap items-center justify-center gap-x-2">
                  {availableTime?.data.map((time) => (
                    <Badge
                      onClick={() => setActiveTime(time.id)}
                      className={cn(
                        time.id === activeTime
                          ? "bg-primary text-white"
                          : "bg-gray-200 text-black",
                        "cursor-pointer rounded-none px-4 text-lg font-bold transition ease-linear hover:bg-primary hover:text-white",
                      )}
                      key={`availabletime-${time.id}`}
                    >
                      {format(new Date(time.attributes.start_date), "h:mm aa")}
                    </Badge>
                  ))}
                </span>
              ) : isLoading ? (
                <Skeleton className="flex flex-row gap-x-2 bg-background/10">
                  <Skeleton className="h-10 w-24 rounded-full bg-primary/10" />
                  <Skeleton className="h-10 w-24 rounded-full bg-primary/10" />
                  <Skeleton className="h-10 w-24 rounded-full bg-primary/10" />
                </Skeleton>
              ) : (
                <Text variant="text-sm" className="italic text-yellow-500">
                  No time slots available, select another date
                </Text>
              )}
            </div>
            <div
              className={cn(
                step === 3 ? "grid" : "hidden",
                "grid-cols-2 gap-5 text-left text-white",
              )}
            >
              {Object.entries(form.getValues()).map(([key, value]) => (
                <div key={`appointment-${key}`} className="space-y-2">
                  <Text variant="text-xl" className="capitalize tracking-wide">
                    {key}:
                  </Text>

                  <Text variant="text-md" className="tracking-wide">
                    {value &&
                      (key === "appointment_date"
                        ? format(value, "yyyy-MM-dd (EEEE)")
                        : value.toString())}
                  </Text>
                </div>
              ))}
            </div>

            <Button
              isLoading={loading}
              type="submit"
              //disabled={!activeTime}
              className={cn(
                step === 3 ? "flex" : "hidden",
                "mx-auto w-fit gap-x-3 self-end rounded-full border border-white !bg-transparent px-10 py-4 font-poppins font-bold text-white drop-shadow-xl sm:py-6",
              )}
            >
              Send
            </Button>
          </form>
        </Form>
        <span className="container relative left-1/2 top-1/2 mx-auto flex w-full -translate-x-1/2 -translate-y-1/2 items-center justify-between md:absolute lg:max-w-screen-lg [&>button]:text-black">
          <Button
            disabled={step === 1}
            onClick={() => {
              if (step !== 1) {
                setStep(step - 1);
              }
            }}
            className="w-fit rounded-full bg-white p-2"
          >
            <ChevronLeft className="size-4 md:size-6" />
          </Button>

          <Button
            disabled={step >= 3}
            onClick={() => {
              if (step < 3) {
                setStep(step + 1);
              }
            }}
            className="w-fit rounded-full bg-white p-2"
          >
            <ChevronRight className="size-4 md:size-6" />
          </Button>
        </span>
      </div>
    </div>
  );
};

const ConfirmDetails = ({
  values,
  step,
}: {
  values: UseFormGetValues<TBookAppointmentSchemaProvider>;
  step: number;
}) => {
  //: key==="guide"?guides && (guides?.find(i=>i.id===value).username)||'':value.toString())}
  return (
    <div
      className={cn(
        step === 3 ? "grid" : "hidden",
        "grid-cols-2 gap-5 text-left text-white",
      )}
    >
      {Object.entries(values()).map(([key, value]) => (
        <div key={`appointment-${key}`} className="space-y-2">
          <Text variant="text-xl" className="capitalize tracking-wide">
            {key}:
          </Text>

          <Text variant="text-md" className="tracking-wide">
            {value &&
              (key === "appointment_date"
                ? format(value, "yyyy-MM-dd (EEEE)")
                : value.toString())}
          </Text>
        </div>
      ))}
    </div>
  );
};
