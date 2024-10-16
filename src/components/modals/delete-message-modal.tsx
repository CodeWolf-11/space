"use client";


import React, { useState } from 'react'
import qs from 'query-string';
import { useModal } from '@/hooks/use-modal-store';
import axios from 'axios';
import { Button } from '@/components/ui/button';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";



function DeleteMessageModal() {


    const { isOpen, onClose, type, data } = useModal();
    const isModalOpen = isOpen && type === "deleteMessage";
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { apiUrl, query } = data;

    const onClick = async () => {
        try {

            setIsLoading(true);

            const url = qs.stringifyUrl({
                url: apiUrl || "",
                query
            });

            await axios.delete(url);

            onClose();

        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent className="bg-white text-black p-0 overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        Delete Message
                    </DialogTitle>

                    <DialogDescription className='text-center text-zinc-500'>
                        Are you sure you want to delete the message ?
                    </DialogDescription>


                </DialogHeader>

                <DialogFooter className='bg-gray-100 px-6 py-4'>
                    <div className='flex items-center justify-between w-full'>
                        <Button disabled={isLoading} variant={"ghost"} onClick={() => onClose()}>
                            Cancel
                        </Button>

                        <Button onClick={onClick} disabled={isLoading} variant={"primary"}>
                            Confirm
                        </Button>
                    </div>
                </DialogFooter>

            </DialogContent>
        </Dialog>
    )
}

export default DeleteMessageModal;