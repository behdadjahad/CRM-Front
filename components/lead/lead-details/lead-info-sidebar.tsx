"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import Tag from '@/components/shared/tag';
import { cn } from '@/lib/utils';

interface LeadInfoCardProps {
    name: string;
    email: string;
    phone?: string;
    tags?: string[];
    description?: string;
    className?: string;
}

function LeadInfoCard({ name, email, phone, tags, description, className }: LeadInfoCardProps) {
    return (
        <div className={cn("bg-white border border-gray-200 rounded-lg p-4 space-y-3", className)}>
            <div className="flex items-start justify-between">
                <div className="space-y-1">
                    <h3 className="font-medium text-gray-900">{name}</h3>
                    <p className="text-sm text-gray-600">{email}</p>
                    {phone && <p className="text-sm text-gray-600">{phone}</p>}
                </div>
                {tags && tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                        {tags.map((tag, index) => (
                            <Tag
                                key={index}
                                text={tag}
                                variant={tag === 'داغ' ? 'hot' : tag === 'پولدار' ? 'success' : tag === 'پیگیر' ? 'info' : 'default'}
                                size="sm"
                            />
                        ))}
                    </div>
                )}
            </div>
            {description && (
                <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
            )}
        </div>
    );
}

interface LeadInfoSidebarProps {
    className?: string;
}

export default function LeadInfoSidebar({ className }: LeadInfoSidebarProps) {
    const leadData = [
        {
            name: "سیما احدى",
            email: "SimaAhadi@Gmail.Com",
            tags: ["داغ"],
            description: "داده نمونه: احتمال خرید بلیط و تور پاریس یکطرفه"
        },
        {
            name: "مینا فرجاد",
            email: "MinaFarjad@Gmail.Com",
            phone: "۰۹۱۷۷۸۹۵۲۳۶",
            tags: ["پولدار", "پیگیر", "خوش اخلاق"]
        },
        {
            name: "پارس ایر",
            email: "ParsAir@Gmail.Com",
            phone: "۰۹۱۷۷۸۹۵۲۳۶"
        }
    ];

    return (
        <div className={cn("w-full space-y-4", className)}>
            {/* Lead Information Cards */}
            <div className="space-y-4">
                {leadData.map((lead, index) => (
                    <LeadInfoCard
                        key={index}
                        name={lead.name}
                        email={lead.email}
                        phone={lead.phone}
                        tags={lead.tags}
                        description={lead.description}
                    />
                ))}
            </div>

            {/* Close Request Button */}
            <div className="pt-4 border-t border-gray-200">
                <Button
                    variant="outline"
                    className="w-full text-gray-700 border-gray-300 hover:bg-gray-50"
                >
                    بستن درخواست
                </Button>
            </div>
        </div>
    );
}
