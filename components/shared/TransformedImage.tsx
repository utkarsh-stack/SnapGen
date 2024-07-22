"use client";
import { dataUrl, debounce, download, getImageSize } from '@/lib/utils'
import { CldImage, getCldImageUrl } from 'next-cloudinary'
import { PlaceholderValue } from 'next/dist/shared/lib/get-img-props'
import Image from 'next/image'
import React from 'react'

const TransformedImage = (
  {
    image,
    type,
    title,
    isTransforming = true,
    setIsTransforming,
    transformationConfig,
    hasDownload = false
  }: TransformedImageProps) => {
  const downloadHandler = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    download(
      getCldImageUrl({
        width: image?.width,
        height: image?.height,
        src: image?.publicId,
        ...transformationConfig
      }), title)
  }
  return (
    <div className='flex flex-col gap-4'>
      <div className='flex-between'>
        <h3 className='h3-bold text-dark-600'>
          TRANSFORMED
        </h3>
        {hasDownload && (
          <div>
            <button
              data-tooltip-target="tooltip-default"
              className='download-btn'
              onClick={downloadHandler}
            >
              <Image
                src="/assets/icons/download.svg"
                alt='Download'
                width={24}
                height={24}
                className="pb-[6px]"
              />
            </button>
            <div id="tooltip-default" role="tooltip" className="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700">
              Tooltip content
              <div className="tooltip-arrow" data-popper-arrow></div>
            </div>
          </div>
        )}
      </div>
      {image?.publicId && transformationConfig ? (
        <div className='relative'>
          <CldImage
            src={image?.publicId}
            height={getImageSize(type, image, "height")}
            width={getImageSize(type, image, "width")}
            alt='Image'
            sizes={"(max-width: 767px) 100vw, 50vw"}
            placeholder={dataUrl as PlaceholderValue}
            onLoad={() => {
              setIsTransforming && setIsTransforming(false)
            }}
            onError={() => {
              debounce(() => {
                setIsTransforming && setIsTransforming(false)
              }, 8000)()
            }}
            {...transformationConfig}
          />
          {isTransforming && (
            <div className='transforming-loader'>
              <Image
                src="/assets/icons/spinner.svg"
                width={50}
                height={50}
                alt='Transforming'
              />
              <p className="text-white/80">Please wait...</p>
            </div>
          )}

        </div>

      ) : (
        <div className='transformed-placeholder'>
          Transformed Image
        </div>
      )}
    </div>
  )
}

export default TransformedImage