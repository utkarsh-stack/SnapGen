"use client"
import React, { ChangeEvent, ChangeEventHandler, useEffect, useState, useTransition } from 'react'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"

import {
  Form
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { aspectRatioOptions, creditFee, defaultValues, transformationTypes } from '@/constants'
import { CustomField } from './CustomField'
import { AspectRatioKey, debounce, deepMergeObjects } from '@/lib/utils'
import MediaUploader from './MediaUploader'
import TransformedImage from './TransformedImage'
import { updateCredit } from '@/lib/actions/user.action'
import { getCldImageUrl } from 'next-cloudinary'
import { addImage, updateImage } from '@/lib/actions/image.action'
import { useRouter } from 'next/navigation'
import { InsufficientCreditsModal } from './InsufficientCreditsModal'

export const formSchema = z.object({
  title: z.string(),
  aspectRatio: z.string().optional(),
  color: z.string().optional(),
  prompt: z.string().optional(),
  publicId: z.string()
})



const TransformationForm = ({ action, data = null, userId, type, creditBalance, config = null, isPublicState }: TransformationFormProps) => {
  const transformationType = transformationTypes[type];
  const [image, setImage] = useState(data);
  const [newTransformation, setnewTransformation] = useState<Transformations | null>(null);
  const [isSubmitting, setisSubmitting] = useState(false)
  const [isTransforming, setisTransforming] = useState(false)
  const [transformationConfig, settransformationConfig] = useState(config)
  const [isPending, startTransition] = useTransition()
  const [isPublic, setisPublic] = React.useState(isPublicState)
  const router = useRouter()

  const initialValues = data && action === 'Update' ? {
    title: data?.title,
    aspectRatio: data?.aspectRatio,
    color: data?.color,
    prompt: data?.prompt,
    publicId: data?.publicId,
  } : defaultValues

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues
  })

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Fetch image from publicId
    // Get config from newTransformation
    // Update transformationConfig
    // Save in database
    setisSubmitting(true)
    if (data || image) {
      const transformationUrl = getCldImageUrl({
        width: image?.width,
        height: image?.height,
        src: image?.publicId,
        ...transformationConfig
      })

      const imageData = {
        title: values.title,
        publicId: image?.publicId,
        width: image?.width,
        height: image?.height,
        secureURL: image?.secureURL,
        transformationType: type,
        config: transformationConfig,
        transformationURL: transformationUrl,
        aspectRatio: values.aspectRatio,
        prompt: values.prompt,
        color: values.color,
        public: isPublic
      }

      if (action === 'Add') {
        try {
          const newImage = await addImage({
            image: imageData,
            userId,
            path: '/'
          })

          if (newImage) {
            form.reset()
            setImage(data)
            router.push(`/transformations/${newImage._id}`)

          }
        } catch (error) {
          console.log(error)
        }
      }
      if (action === 'Update') {
        try {
          const updatedImage = await updateImage({
            image: {
              ...imageData,
              _id: data._id
            },
            userId,
            path: `/transformations/${data._id}`
          })

          if (updatedImage) {
            router.push(`/transformations/${updatedImage._id}`)

          }
        } catch (error) {
          console.log(error)
        }
      }
    }

    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    setisSubmitting(false)
  }

  const onSelectFieldHandler = (value: string, onChangeField: (value: string) => void) => {
    // We're fetching initial image data and applying new aspect ratio on top of that
    const imageSize = aspectRatioOptions[value as AspectRatioKey]
    setImage((prevState: any) => ({
      ...prevState,
      aspectRatio: imageSize.aspectRatio,
      width: imageSize.width,
      height: imageSize.height
    }))
    // Setting new transformation type we'r setting new state because same function is used in two pages
    setnewTransformation(transformationType.config)
    return onChangeField(value)
  }

  // TODO: Return to update credit 
  const onInputChangeHandler = (
    fieldName: string,
    value: string,
    type: string,
    onChangeField: (value: string) => void
  ) => {
    // This function gets triggerred as soon as we enter something in input field
    // To minimize credit balance reduction unnecessary, added wait for 10sec before registering user input
    debounce(() => {
      // Setting new transformation object
      setnewTransformation((prevState: any) => ({
        ...prevState,
        [type]: {
          ...prevState?.[type],
          [fieldName === 'prompt' ? 'prompt' : 'to']: value
        }
      }))
    }, 1000)();
    return onChangeField(value)
  }

  const onTransformationHandler = async () => {
    setisTransforming(true)
    settransformationConfig(
      deepMergeObjects(newTransformation, transformationConfig)
    )
    setnewTransformation(null)
    startTransition(async () => {
      await updateCredit(userId, creditFee)
    })
  }

  useEffect(() => {
    if (image && (type === 'restore' || type === 'removeBackground')) {
      setnewTransformation(transformationType.config)
    }

  }, [image, transformationType.config, type])

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {creditBalance < Math.abs(creditFee) && <InsufficientCreditsModal />}
          <CustomField
            control={form.control}
            name='title'
            formLabel='Image Title'
            className='w-full'
            render={({ field }) => <Input {...field} className='input-field' />}
          />
          {type === 'fill' && (
            <CustomField
              control={form.control}
              name='aspectRatio'
              formLabel='Aspect Ratio'
              className='w-full'
              render={({ field }) => (
                <Select
                  onValueChange={(value) => onSelectFieldHandler(value, field.onChange)}
                  value={field.value}
                >
                  <SelectTrigger className="select-field">
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(aspectRatioOptions).map(
                      (key) => (
                        <SelectItem key={key} value={key} className='select-item'>
                          {aspectRatioOptions[key as AspectRatioKey].label}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
              )}
            />
          )}
          {((type === 'remove') || (type === 'recolor')) && (
            <div className='prompt-field'>
              <CustomField
                control={form.control}
                name='prompt'
                formLabel={
                  type === 'remove' ? 'Object to remove' : 'Object to recolor'
                }
                className='w-full'
                render={({ field }) =>
                  <Input
                    value={field.value}
                    className='input-field'
                    onChange={(e) => onInputChangeHandler(
                      'prompt',
                      e.target.value,
                      type,
                      field.onChange
                    )} />}
              />
              {(type === 'recolor') && (
                <CustomField
                  name='color'
                  control={form.control}
                  className='w-full'
                  formLabel='Replacement color'
                  render={({ field }) => <Input
                    value={field.value}
                    className='input-field'
                    onChange={(e) => onInputChangeHandler(
                      'color',
                      e.target.value,
                      'recolor',
                      field.onChange
                    )}
                  />}
                />
              )}
            </div>
          )}
          <div className="items-top flex space-x-2">
            <Checkbox id="shareWithFriends" checked ={isPublic} onClick={()=>{setisPublic(!isPublic)}} />
            <div className="grid gap-1.5 leading-none">
              <label
                htmlFor="terms1"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Share with friends
              </label>
            </div>
          </div>
          <div className='media-uploader-field'>
            <CustomField
              control={form.control}
              name='publicId'
              className='flex size-full flex-col'
              render={({ field }) =>
                <MediaUploader
                  onValueChange={field.onChange}
                  setImage={setImage}
                  publicId={field.value}
                  image={image}
                  type={type}
                />
              }
            />
            <TransformedImage
              image={image}
              type={type}
              title={form.getValues().title}
              isTransforming={isTransforming}
              setIsTransforming={setisTransforming}
              transformationConfig={transformationConfig}
            />
          </div>
          <div className='flex gap-4'>
            <Button
              type="button"
              className='submit-button capitalize'
              disabled={isTransforming || newTransformation === null}
              onClick={onTransformationHandler}
            >
              {isTransforming ? 'Transforming...' : 'Apply Transformation'}
            </Button>
            <Button
              type="submit"
              className='submit-button capitalize'
              disabled={isSubmitting}
            >{
                isSubmitting ? 'Submitting...' : 'Save Image'
              }</Button>
          </div>
        </form>
      </Form>
    </>
  )
}

export default TransformationForm