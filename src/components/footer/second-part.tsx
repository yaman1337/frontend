import Image from "next/image";
import Link from "next/link";
import { APIResponseCollection } from "@/types/types";
import { getPackageRegions } from "@/server/packages/get-package-regionts";
import { getPackageCategories } from "@/server/packages/get-package-categories";
import { getPackageTypes } from "@/server/packages/get-package-types";

export default async function UsefulLinksSection() {
  // TODO: add is popular in package category and package types
  const packageRegion = await getPackageRegions({ isPopular: true });
  const packageCategory = await getPackageCategories({ isPopular: true });
  const packageTypes = await getPackageTypes({ isPopular: true });
  const socialLinks = [
    { href: "#", src: "/icons/facebook.png", alt: "Facebook" },
    { href: "#", src: "/icons/instagram.png", alt: "Instagram" },
    { href: "#", src: "/icons/twitter.png", alt: "Twitter" },
    { href: "#", src: "/icons/whatsApp.png", alt: "WhatsApp" },
    { href: "#", src: "/icons/youtube.png", alt: "YouTube" },
  ];

  const baseUsefulLinks = [
    {
      title: "Popular Regions",
      links: packageRegion?.data?.map((i) => ({
        name: i.attributes.name,
        href: `/packages?key=region&filter=${i.id}`,
      })),
    },
  ];
  const transformedCategories =
    packageCategory?.data && packageCategory.data.length > 0
      ? packageCategory?.data.map((i) => ({
          title: i.attributes.name,
          links:
            i.attributes.packages?.data &&
            i.attributes.packages?.data.length > 0
              ? i.attributes.packages?.data.map((j) => ({
                  name: j.attributes.package_name,
                  href: `/packages/${j.id}`,
                }))
              : [],
        }))
      : [];
  const transformedPackageTypes =
    packageTypes?.data && packageTypes.data.length > 0
      ? packageTypes.data.map((i) => ({
          title: i.attributes.name,
          links:
            i.attributes.packages?.data && i.attributes.packages.data.length > 0
              ? i.attributes.packages.data.map((j) => ({
                  name: j.attributes.package_name,
                  href: `/packages/${j.id}`,
                }))
              : [],
        }))
      : [];
  const usefulLinks = [
    ...baseUsefulLinks,
    ...transformedCategories,
    ...transformedPackageTypes,
  ];

  const paymentMethods = [
    { src: "/images/visa.png", alt: "Visa" },
    { src: "/images/visa.png", alt: "MasterCard" },
    { src: "/images/visa.png", alt: "American Express" },
  ];

  const affiliations = [
    { src: "/images/visa.png", alt: "Affiliation 1" },
    { src: "/images/visa.png", alt: "Affiliation 2" },
  ];

  const recommendations = [
    { src: "/images/visa.png", alt: "Recommendation 1" },
    { src: "/images/visa.png", alt: "Recommendation 2" },
  ];

  const renderList = (items: { src: string; alt: string }[]) =>
    items.map((item, index) => (
      <li key={index} className="inline-block">
        <Image src={item.src} alt={item.alt} width={50} height={24} />
      </li>
    ));

  return (
    <section className="-mt-4 bg-black py-8 text-white">
      <div className="container">
        <div className="flex flex-col justify-between gap-4 py-4 md:flex-row md:py-8">
          <div className="flex">
            <Link
              href={"/about-us"}
              className="border border-white px-6 py-2 text-sm text-white md:text-base"
            >
              About Us
            </Link>
          </div>
          <div className="flex gap-6">
            {socialLinks.map((social, index) => (
              <Link
                href={social.href}
                key={index}
                aria-label={social.alt}
                className="flex items-center"
              >
                <Image
                  src={social.src}
                  alt={social.alt}
                  width={24}
                  height={24}
                  className="h-6 w-6 bg-black" // Tailwind classes for consistent size
                />
              </Link>
            ))}
          </div>
        </div>

        <div className="border-b-2 border-white pb-8">
          <h1 className="mb-6 text-xl font-semibold lg:text-2xl">
            Useful Links
          </h1>
          <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-6">
            {usefulLinks.map((column, idx) => (
              <div key={idx}>
                <h2 className="mb-4 font-semibold lg:text-lg">
                  {column.title}
                </h2>
                <ul className="space-y-2">
                  {column?.links?.map((link, index) => (
                    <li key={index}>
                      <Link href={link.href}>
                        <div className="text-sm hover:underline md:text-base">
                          {link.name}
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col justify-between gap-8 border-b-2 border-white py-8 md:flex-row">
          <div>
            <h3 className="mb-4 font-semibold lg:text-lg">We Accept</h3>
            <ul className="flex gap-6">{renderList(paymentMethods)}</ul>
          </div>

          <div>
            <h3 className="mb-4 font-semibold lg:text-lg">Affiliated with</h3>
            <ul className="flex gap-6">{renderList(affiliations)}</ul>
          </div>

          <div>
            <h3 className="mb-4 font-semibold lg:text-lg">Recommended by</h3>
            <ul className="flex gap-6">{renderList(recommendations)}</ul>
          </div>
        </div>

        <div className="flex justify-center pt-4">
          <p className="text-center text-sm md:text-base">
            Copyright © 2024, Gurukul Hub Pvt. Ltd. All Rights reserved.
          </p>
        </div>
      </div>
    </section>
  );
}
