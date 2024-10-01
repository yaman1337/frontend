"use client";
import { filterCategories } from "@/config/packages-filters";
import useUpdateQueryString from "@/hooks/use-update-query-string";
import { APIResponseCollection } from "@/types/types";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import PackageCard from "./package-card";
import { PackageCardSkeleton } from "./package-card-skeleton";
import { useOverflowDetection } from "@/hooks/use-overflow-detection";
import { ChevronLeft, ChevronRight, SlidersHorizontal } from "lucide-react";
import { Button } from "../ui/button";

export default function PackagesList() {
  const pathname = usePathname();
  // for handling navlinks overflow in mobile
  const containerRef = useRef<HTMLDivElement>(null);
  const overflowDir = useOverflowDetection(containerRef);
  const [curScrollX, setCurScrollX] = useState(0);
  useEffect(() => {
    const scrollFn = (e: Event) => {
      setCurScrollX(containerRef?.current?.scrollLeft || 0);
    };
    containerRef?.current?.addEventListener("scroll", scrollFn);
    return () => containerRef?.current?.removeEventListener("scroll", scrollFn);
  }, []);
  const updateQueryString = useUpdateQueryString();
  const searchParams = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState<{
    name: string;
    key: string;
  }>({
    name: searchParams.get("key") || "All",
    key: searchParams.get("filter") || "none",
  });
  const { data, isFetching, isRefetching, status, error } = useQuery<
    APIResponseCollection<"api::package.package">
  >({
    queryKey: [
      "packages",
      selectedCategory,
      searchParams.get("filter"),
      searchParams.get("key"),
    ],
    queryFn: async () => {
      try {
        const params = new URLSearchParams();
        params.set("populate", "*");
        const filter = searchParams.get("filter");
        const key = searchParams.get("key");
        if (filter && key && selectedCategory.name !== "All") {
          if (key === "altitude") {
            const filterName = `filters[${key}][$gte]`;
            params.set(filterName, filter);
          } else {
            const filterName = `filters[${key}]`;
            params.set(filterName, filter);
          }
        }

        const data = await axios.get(
          `${process.env.NEXT_PUBLIC_STRAPI_URL}api/packages?${params.toString()}`,
        );
        return data.data;
      } catch (error) {
        console.error("Error fetching", error);
      }
    },
    placeholderData: keepPreviousData,
  });

  const [filters, setFilters] = useState();
  const [filteredPackages, setFilteredPackages] = useState<
    APIResponseCollection<"api::package.package"> | null | undefined
  >(null);

  useEffect(() => {
    if (data) {
      setFilteredPackages(data);
    }
  }, [data]);

  return (
    <section className="container relative">
      <div className="relative mb-8 flex items-center gap-x-2">
        {overflowDir === "left" || overflowDir === "both" ? (
          <div className="absolute left-4 top-1/2 z-10 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full bg-black shadow-lg shadow-white/10 lg:hidden">
            <ChevronLeft
              className="animate-chevron-left absolute text-xl text-primary"
              onClick={() =>
                containerRef?.current?.scroll({
                  top: 0,
                  left: curScrollX - 150,
                  behavior: "smooth",
                })
              }
            />
          </div>
        ) : null}
        <div className="hide-scrollbar flex overflow-x-auto" ref={containerRef}>
          {filterCategories.map((category, index) => (
            <button
              key={index}
              onClick={() => {
                if (category.key === "none") {
                  updateQueryString({}, ["filter", "key"]);
                  setSelectedCategory({
                    name: category.name,
                    key: category.key,
                  });
                } else {
                  updateQueryString({
                    key: category.key,
                    filter: category.name,
                  });
                  setSelectedCategory({
                    name: category.name,
                    key: category.key,
                  });
                }
              }}
              className={`mx-4 flex cursor-pointer flex-col items-center border-b-2 py-2 text-sm font-extrabold md:text-base ${
                searchParams.get("filter") === category.name ||
                (category.name === "All" && searchParams.get("filter") === null)
                  ? "border-b-2 border-primary text-primary"
                  : "border-transparent text-neutral-500"
              }`}
            >
              {category.icon}
              <span className="max-w-24 text-center text-sm">
                {category.label}
              </span>
            </button>
          ))}
        </div>

        {overflowDir === "right" || overflowDir === "both" ? (
          <div className="absolute right-4 top-1/2 z-10 grid aspect-square h-8 w-8 -translate-y-1/2 place-items-center rounded-full bg-black shadow-xl shadow-white/10 lg:hidden">
            <ChevronRight
              className="animate-chevron-right absolute text-xl text-primary"
              onClick={() =>
                containerRef?.current?.scroll({
                  top: 0,
                  left: curScrollX + 150,
                  behavior: "smooth",
                })
              }
            />
          </div>
        ) : null}
        <Button className="bg-white text-primary hover:text-white">
          <SlidersHorizontal size={16} />
          <p>View filters</p>
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
        {isFetching || isRefetching || status === "pending" ? (
          <div className="w-full md:col-span-2 lg:col-span-4">
            <PackageCardSkeleton />
          </div>
        ) : status === "error" || data.data.length === 0 ? (
          <span>No packages are available</span>
        ) : (
          data?.data?.map((pkg, index) => <PackageCard key={index} pkg={pkg} />)
        )}
      </div>
    </section>
  );
}
