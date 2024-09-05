/* eslint-disable jsx-a11y/alt-text */
import Image from "next/image";
import React from "react";
export type GalleryImageProp = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

export default function Gallery({ images }: { images: GalleryImageProp[] }) {
  // const images = [
  //   {
  //     src: "https://s3-alpha-sig.figma.com/img/a40f/2c34/2e3e5994a8aee606ffd6278fa0787690?Expires=1726444800&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=C26MpQNZaWT~e1MEEwZkD5MGRKtnRkL0NCHelw0pGCR7LEIVgZ-R3dwVkyWd1lbQVaQkiUTHL4zXMEn31eaAW4mxXOGaQBReaT4uQDL-5A4xz-Vsqv2GhzKTtZW-MkWSJZN8bIV1DdmQ90pEGGAAab-Pzhb9x0iIS-G8muuLnti0c9Y4j4bUWS5Et6vyXhFbGawnB5Z~cYBcl0CNOyAkmUhw9VXHFUvI8xRi8HsYiXr6AWnG-QBs3o6ghFJ1ZhYYPOJ740i2ZZyaBTR1DiJRTcVYLzNkskLl6dgoWmbTEfGuPgjzf13pN0fltktaWaY0~j1YQ4kvh3p4V16N8eTZdw__",
  //     alt: "Main Image",
  //     className: "col-span-3 h-80",
  //   },
  //   {
  //     src: "https://s3-alpha-sig.figma.com/img/a40f/2c34/2e3e5994a8aee606ffd6278fa0787690?Expires=1726444800&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=C26MpQNZaWT~e1MEEwZkD5MGRKtnRkL0NCHelw0pGCR7LEIVgZ-R3dwVkyWd1lbQVaQkiUTHL4zXMEn31eaAW4mxXOGaQBReaT4uQDL-5A4xz-Vsqv2GhzKTtZW-MkWSJZN8bIV1DdmQ90pEGGAAab-Pzhb9x0iIS-G8muuLnti0c9Y4j4bUWS5Et6vyXhFbGawnB5Z~cYBcl0CNOyAkmUhw9VXHFUvI8xRi8HsYiXr6AWnG-QBs3o6ghFJ1ZhYYPOJ740i2ZZyaBTR1DiJRTcVYLzNkskLl6dgoWmbTEfGuPgjzf13pN0fltktaWaY0~j1YQ4kvh3p4V16N8eTZdw__",
  //     alt: "Image 1",
  //   },
  //   {
  //     src: "https://s3-alpha-sig.figma.com/img/a40f/2c34/2e3e5994a8aee606ffd6278fa0787690?Expires=1726444800&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=C26MpQNZaWT~e1MEEwZkD5MGRKtnRkL0NCHelw0pGCR7LEIVgZ-R3dwVkyWd1lbQVaQkiUTHL4zXMEn31eaAW4mxXOGaQBReaT4uQDL-5A4xz-Vsqv2GhzKTtZW-MkWSJZN8bIV1DdmQ90pEGGAAab-Pzhb9x0iIS-G8muuLnti0c9Y4j4bUWS5Et6vyXhFbGawnB5Z~cYBcl0CNOyAkmUhw9VXHFUvI8xRi8HsYiXr6AWnG-QBs3o6ghFJ1ZhYYPOJ740i2ZZyaBTR1DiJRTcVYLzNkskLl6dgoWmbTEfGuPgjzf13pN0fltktaWaY0~j1YQ4kvh3p4V16N8eTZdw__",
  //     alt: "Image 2",
  //   },
  //   {
  //     src: "https://s3-alpha-sig.figma.com/img/a40f/2c34/2e3e5994a8aee606ffd6278fa0787690?Expires=1726444800&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=C26MpQNZaWT~e1MEEwZkD5MGRKtnRkL0NCHelw0pGCR7LEIVgZ-R3dwVkyWd1lbQVaQkiUTHL4zXMEn31eaAW4mxXOGaQBReaT4uQDL-5A4xz-Vsqv2GhzKTtZW-MkWSJZN8bIV1DdmQ90pEGGAAab-Pzhb9x0iIS-G8muuLnti0c9Y4j4bUWS5Et6vyXhFbGawnB5Z~cYBcl0CNOyAkmUhw9VXHFUvI8xRi8HsYiXr6AWnG-QBs3o6ghFJ1ZhYYPOJ740i2ZZyaBTR1DiJRTcVYLzNkskLl6dgoWmbTEfGuPgjzf13pN0fltktaWaY0~j1YQ4kvh3p4V16N8eTZdw__",
  //     alt: "Image 3",
  //   },
  // ];
  return (
    <div className="relative grid grid-cols-3 gap-4 lg:gap-8">
      {/* Main Image */}
      <div className="col-span-3">
        <div
          className="rounded-lg border bg-white p-2 lg:p-4"
          style={{ boxShadow: "0px 4px 12px 4px rgba(0, 0, 0, 0.3)" }}
        >
          <Image
            src={images?.[0]?.src}
            alt="Main"
            className="object-cover grayscale lg:max-h-96 lg:w-full"
            height={images?.[0]?.height}
            width={images?.[0]?.width}
          />
        </div>
      </div>

      {/* Images */}
      {images?.slice(1)?.map((img, index) => (
        <div className="col-span-1" key={index}>
          <div
            className="h-full rounded-lg bg-white p-2 shadow-xl lg:p-4"
            style={{ boxShadow: "0px 4px 12px 4px rgba(0, 0, 0, 0.3)" }}
          >
            <Image
              src={img?.src}
              className="h-full w-full object-cover grayscale"
              alt={`${img.alt}`}
              height={img?.height}
              width={img?.width}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
