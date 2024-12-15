"use server";

import { APIResponseCollection, APIResponseData } from "@/types/types";
import { AxiosResponse, type AxiosError } from "axios";
export const getProjects = async ({
  key,
  filter,
  operator,
}: {
  key?: string;
  filter?: string;
  operator?: string;
}) => {
  try {
    // const queryGenerator = (key?: string, filter?: string) => {
    //   if (key === "season") {
    //     return `filters[adventure_specification][season][name][$eqi]=${filter}`;
    //   } else if (key === "altitude") {
    //     return `filters[adventure_specification][max_altitude][$gte]=${filter}`;
    //   } else if (key === "type") {
    //   } else if (key === "fitness") {
    //     return `filters[adventure_specification][fitness][name][$eqi]=${filter}`;
    //   } else if (key === "grade") {
    //     return `filters[adventure_specification][grade][id][$eqi]=${filter}`;
    //   } else if (key === "") {
    //   } else {
    //     return "";
    //   }
    // };
    // const query = queryGenerator(key, filter);

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}api/projects?fields[0]=title&populate[package][populate][0]=image&populate[package][populate][1]=adventure_specification`,
      {
        next: {
          tags: ["projects"],
        },
        cache: "no-cache",
      },
    );
    const data: APIResponseCollection<"api::project.project"> =
      await res.json();
    return data;
  } catch (error: AxiosError | any) {
    console.log(error);
  }
};
