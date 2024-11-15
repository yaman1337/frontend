"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Text } from "@/components/ui/text";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Pencil, Trash } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function BlogCard({
  blogId,
  blog,
  variant,
}: {
  blogId?: number;
  blog: any;
  variant?: "default" | "edit";
}) {
  return (
    <article className="group relative flex w-full flex-col items-start justify-center gap-y-4 rounded-xl border p-4 pb-2">
      {/*Overlay buttons for edit*/}
      {variant === "edit" && (
        <div className="invisible absolute inset-0 -z-20 flex w-full items-center justify-center gap-x-2 rounded-xl bg-black/40 transition-all ease-in-out group-hover:visible group-hover:z-20">
          <Link href="/dashboard/blog/form?type=edit">
            <Button className="aspect-square h-auto bg-white text-blue-400 hover:bg-blue-400 hover:text-white">
              <Pencil size={24} />
            </Button>
          </Link>
          <Button className="aspect-square h-auto bg-white text-red-500 hover:bg-red-500 hover:text-white">
            <Trash size={24} />
          </Button>
        </div>
      )}
      <Link
        href={`/blog/${blogId ? blogId : blog?.slug}`}
        target="_blank"
        className="h-[10rem] w-full self-stretch overflow-hidden rounded-sm bg-gray-200"
        prefetch={false}
      >
        <Image
          src={
            blog?.thumbnail?.data?.attributes?.url ||
            "https://plus.unsplash.com/premium_photo-1677002240252-af3f88114efc?q=80&w=2925&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          }
          alt={blog?.title}
          width={600}
          height={400}
          className="h-full w-full rounded-xl object-cover saturate-0 transition-transform duration-300 group-hover:scale-105"
        />
      </Link>

      <div className="flex flex-col items-start gap-2 self-stretch">
        <div className="items-center gap-4 self-start">
          <Badge className="flex rounded-md bg-blue-50 !px-3 !py-1 text-center text-xs font-medium leading-6 text-blue-700 ring-0">
            {blog?.blog_tags?.data?.[0]?.attributes?.name}
          </Badge>
          <Text variant="text-sm" className="text-gray-500"></Text>
        </div>
        <Link
          href={`/blog/${blogId ? blogId : blog?.slug}`}
          target="_blank"
          className="space-y-2.5 self-stretch underline-offset-1 hover:[&>h2]:underline"
          prefetch={false}
        >
          <Text
            as="h2"
            variant="text-lg"
            medium
            className="line-clamp-2 text-left text-base tracking-tight md:h-14 md:text-lg"
          >
            {blog?.title}
          </Text>
        </Link>

        <div className="mt-4 flex items-center gap-2 self-stretch">
          <Avatar>
            <AvatarImage
              src={blog?.author_image?.data?.attributes?.url}
              className="saturate-0"
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>

          <Text variant="text-sm" className="line-clamp-1 text-gray-500">
            {blog?.author_name}
          </Text>
          <Text as="span" variant="text-md" className="text-gray-500" bold>
            ·
          </Text>
          <Text variant="text-sm" className="line-clamp-1 text-gray-500">
            {formatDate(blog?.createdAt)}
          </Text>
        </div>
      </div>
    </article>
  );
}
