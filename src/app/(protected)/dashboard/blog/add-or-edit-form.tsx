"use client";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import rehypeSanitize from "rehype-sanitize";
import { Text } from "@/components/ui/text";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { TWorkForm, WorkFormSchema } from "@/validators/work-validator";
import FileDropZone from "@/components/ui/file-dropzone";
import MDEditor from "@uiw/react-md-editor";
import { toast } from "sonner";
import { BlogFormSchema, TBlogForm } from "@/validators/blog-form";
import BlogForm from "./form/page";
export const BlogAddOrEditForm = ({
  type,
  data,
}: {
  type: "edit" | "add";
  data?: TBlogForm;
}) => {
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const router = useRouter();
  const form = useForm<TBlogForm>({
    resolver: zodResolver(BlogFormSchema),
    defaultValues: {
      title: "",
      categories: "",
      description: "",
      image: "",
    },
  });

  const [content, setContent] = useState<string | undefined>(
    "**Hello World!**",
  );
  async function onSubmit(values: TBlogForm) {
    setLoading(true);
    const payload = { ...form.getValues(), description: content };
    toast.success("Edited successfully");
  }
  useEffect(() => {
    console.log(form.getValues());
  }, [form]);
  return (
    <section className="max-w-4xl">
      <div className="my-4 [&>*]:text-neutral-900">
        <Text
          variant="display-sm"
          className="text-left font-poppins !text-xl font-bold capitalize sm:!text-2xl"
        >
          {type} Blog
        </Text>
      </div>
      <Form {...form}>
        <form className="space-y-7" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-1.5">
            <FormLabel className="dark:text-gray-100">Image</FormLabel>
            <FileDropZone
              required={true}
              value={file}
              onChange={(file) => {
                setFile(file || null);
              }}
            />
          </div>

          <FormField
            control={form.control}
            name="categories"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Categories</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="tag-1">tag-1</SelectItem>
                    <SelectItem value="tag-2">tag-2</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Blog</FormLabel>
                <FormControl>
                  <div data-color-mode="light" className="space-y-10">
                    <MDEditor
                      preview="edit"
                      value={content}
                      onChange={setContent}
                      previewOptions={{
                        rehypePlugins: [[rehypeSanitize]],
                      }}
                    />
                    <MDEditor.Markdown
                      source={content}
                      style={{ whiteSpace: "pre-wrap" }}
                      className="rounded-lg border !border-input p-2"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex flex-col justify-center gap-y-2 sm:justify-center">
            <Button
              type="submit"
              onClick={() => form.handleSubmit(onSubmit)}
              //disabled={!form.formState.isValid}
              className="w-fit items-center gap-x-3 self-start rounded-full bg-foreground px-10 py-6 font-poppins font-bold"
              isLoading={loading}
            >
              Done
            </Button>
          </div>
        </form>
      </Form>
    </section>
  );
};
