import { FormMakerInterface } from '@/components/shared/form-maker'
import TextEditorInput from '@/components/shared/input/TextEditorInput - Copy'
import { Button } from '@/components/ui/button'
import React, { useState } from 'react'
import Image from 'next/image'
import { ClipboardMinus } from 'lucide-react'

// Mock data for existing notes
const mockNotes = [
    {
        id: 1,
        content: 'یعنی اگه وسط جمله باشه باید سه تا تکست درست کنی',
        author: 'مینا فرجاد',
        date: '۱۴۰۴/۲/۱۷ ۱۶:۲۳ PM',
        hasFollowUp: false
    },
    {
        id: 2,
        content: 'یعنی اگه وسط جمله باشه باید سه تا تکست درست کنی',
        author: 'امیر محمدی',
        date: '۱۴۰۴/۲/۱۷ ۱۶:۲۳ PM',
        hasFollowUp: true
    },
    {
        id: 3,
        content: 'یعنی اگه وسط جمله باشه باید سه تا تکست درست کنی',
        author: 'مینا فرجاد',
        date: '۱۴۰۴/۲/۱۷ ۱۶:۲۳ PM',
        hasFollowUp: false
    }
]

export default function NoteTabContent() {
    const [noteValue, setNoteValue] = useState('')
    const [notes, setNotes] = useState(mockNotes)

    const item: FormMakerInterface["fields"][0] = {
        component: "text-editor",
        key: "note",
        className: 'w-full  h-24 text-right',
        floating: false,
        placeholder: 'یادداشت خود را اینجا بنویسید...'
    }

    const handleSetFieldValue = (key: string, value: any) => {
        if (key === 'note') {
            setNoteValue(value)
        }
    }

    const handleSubmit = () => {
        if (noteValue.trim()) {
            const newNote = {
                id: Date.now(),
                content: noteValue,
                author: 'کاربر فعلی', // You can get this from user context
                date: new Date().toLocaleDateString('fa-IR', {
                    year: 'numeric',
                    month: 'numeric',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true
                }),
                hasFollowUp: false
            }
            setNotes([newNote, ...notes])
            setNoteValue('')
        }
    }

    return (
        <div className='w-full h-full flex flex-col gap-6'>
            {/* Text Editor Section */}
            <div className='w-full flex  p-4 rounded-b-lg border border-[#D5D7DA] flex-col gap-4'>
                {/* Label */}
                {/* <label className='text-sm font-medium text-gray-700 text-right'>
                    متن یادداشت خود را بنویسید...
                </label> */}

                {/* Text Editor */}
                <div className=' border-[#D5D7DA]  rounded-lg overflow-hidden'>
                    <TextEditorInput
                        item={item}
                        form={{
                            values: { note: noteValue },
                            setFieldValue: handleSetFieldValue
                        }}
                    />
                </div>

                {/* Submit Button */}
                <div className='flex justify-start'>
                    <Button
                        variant={"info"}
                        onClick={handleSubmit}
                       className='px-12 mt-5'
                    >
                        ثبت
                    </Button>
                </div>
            </div>

            {/* Notes List Section */}
            <div className='w-full border border-[#D5D7DA] rounded-[16px] p-4 flex flex-col gap-4'>
                {/* Section Title */}
                <div className='flex items-center gap-2 justify-end'>
                    <h3 className='text-lg font-semibold text-gray-800'>
                        یادداشت ها
                    </h3>
                    <ClipboardMinus size={20} />
                </div>

                {/* Notes List */}
                <div className='flex flex-col gap-3'>
                    {notes.map((note) => (
                        <div
                            key={note.id}
                            className='bg-[#FAFAFA] border border-[#D5D7DA] rounded-[12px] p-2'
                        >
                        

                            {/* Content - Right aligned */}
                            <div className='text-right text-base font-normal  text-[#181D27] mt-2 mb-3 leading-relaxed'>
                                {note.content}
                            </div>

                            {/* Author - Below content */}
                            <div className='flex items-start justify-between'>
                                <div className='text-sm font-normal text-[#212B36]'>
                                    {note.date}
                                </div>
                                <span className='text-sm text-gray-600'>
                                    {note.author}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}