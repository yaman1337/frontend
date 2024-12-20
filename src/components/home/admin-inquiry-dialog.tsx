"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PhoneInput } from "@/components/ui/phone-input";
import { addAdminInquiry } from "@/server/inquiry/write-admin-inquiry";
import {
  AdminInquiryFormSchema,
  TAdminInquiryForm,
} from "@/validators/admin-inquiry-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Label } from "../ui/label";
import { Text } from "../ui/text";
import { Textarea } from "../ui/textarea";
import { getCurrentUserData } from "@/server/auth/get-me";
import { useQuery } from "@tanstack/react-query";
import { TUser } from "@/types/auth";
import { TriangleAlert } from "lucide-react";
import { useCurrentUser } from "@/hooks/user-current-user";
export const AdminInquiryDialog = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const form = useForm<TAdminInquiryForm>({
    resolver: zodResolver(AdminInquiryFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    },
  });
  async function onSubmit(values: TAdminInquiryForm) {
    setLoading(true);
    const payload = form.getValues();
    const res = await addAdminInquiry(payload);
    if (res.status === 200) {
      setLoading(false);
      toast.success("Successfully sent an inquiry to admin!");
    } else {
      setLoading(false);
      toast.error(`${res?.error?.message}`);
    }
  }
  const { data: user, isLoading } = useCurrentUser();
  return (
    <div className="relative">
      <Text className="w-full text-center" variant={"text-md"}>
        Leave a message
      </Text>
      {!user ? (
        <span className="my-4 flex items-center gap-x-3">
          <TriangleAlert size={16} />
          <p className="font-semibold italic text-yellow-400">
            You need to be logged in to perform this operation
          </p>
        </span>
      ) : (
        <Form {...form}>
          <form
            className="space-y-3 text-black md:space-y-4"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <Label required className="text-white">
                    Name
                  </Label>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} required />
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
                    <Input placeholder="john.doe@email.com" {...field} />
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
                    <PhoneInput
                      defaultCountry="NP"
                      initialValueFormat="national"
                      placeholder="977 **********"
                      {...field}
                      value={field.value as any}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <Label required className="text-white">
                    Subject
                  </Label>
                  <FormControl>
                    <Input placeholder="e.g. Guide session" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <Label required className="text-white">
                    Message
                  </Label>
                  <FormControl>
                    <Textarea {...field} placeholder="Your message" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="mt-8 flex flex-col justify-center gap-y-2 sm:justify-center">
              <Button
                isLoading={loading}
                type="submit"
                className="w-full gap-x-3 self-end !bg-white px-10 py-4 font-poppins font-bold text-foreground sm:py-6"
              >
                Send
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};
