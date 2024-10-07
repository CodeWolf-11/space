"use client";

import React from 'react'
import { UploadDropzone } from '@/lib/uploadthing';
import Image from 'next/image';
import { X } from 'lucide-react';

interface FileUploadProps {
    onChange: (url?: string) => void;
    value: string
    endpoint: "serverImage" | "messageFile"
}

function FileUpload({ onChange, endpoint, value }: FileUploadProps) {

    const fileType = value?.split(".").pop();

    if (value && fileType !== "pdf") {
        return (
            <div className='relative h-20 w-20'>
                <Image
                    fill
                    src={value}
                    alt="Upload"
                    className='rounded-full'
                />
                <button onClick={() => onChange("")} className='bg-rose-500 text-white p-1 rounded-full absolute top-0 right-0 shadow-sm'>
                    <X className='h-4 w-4' />
                </button>
            </div>
        )
    }

    return (

        <UploadDropzone
            endpoint={endpoint}
            onClientUploadComplete={(res) => {
                onChange(res?.[0].url)
            }}
            onUploadError={(error: Error) => {
                console.log(Error)
            }} />

    )
}

export default FileUpload