"use client";

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAllInvoices, getUserInvoices } from '@/api/invoices';
import { Invoice } from '@/types/invoice';
import InvoiceList from './invoice-list';
import InvoicePreviewModal from './invoice-preview-modal';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, Download, FileText, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';


interface InvoicePageProps {
    chadcoCustomerId?: number;
    isAdmin?: boolean;
}

const InvoicePage: React.FC<InvoicePageProps> = ({
    chadcoCustomerId,
    isAdmin = false
}) => {
    const [activeTab, setActiveTab] = useState<'all' | 'paid' | 'unpaid' | 'pending_payment' | 'pending_approval'>('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

    // Fetch invoices based on user type
    const { data: invoiceData, isLoading, error } = useQuery({
        queryKey: ['invoices', chadcoCustomerId, isAdmin],
        queryFn: () => {
            if (isAdmin) {
                return getAllInvoices();
            } else if (chadcoCustomerId) {
                return getUserInvoices(chadcoCustomerId);
            }
            return Promise.resolve({ data: [] });
        },
    });

    const invoices: Invoice[] = invoiceData?.data || [];

    // Filter invoices based on active tab and search term
    const filteredInvoices = invoices.filter((invoice) => {
        const matchesTab = activeTab === 'all' || invoice.status === activeTab;
        const matchesSearch = searchTerm === '' ||
            invoice.orderTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
            invoice.orderNumber.includes(searchTerm) ||
            invoice.packageType.toLowerCase().includes(searchTerm.toLowerCase());

        return matchesTab && matchesSearch;
    });

    const handlePreview = (invoice: Invoice) => {
        console.log('Preview invoice:', invoice);
    };

    const handleDownload = (invoice: Invoice) => {
        console.log('Download invoice:', invoice);
        // Implement download logic here
    };

    const handleView = (invoice: Invoice) => {
        console.log('View invoice:', invoice);
        // Implement view logic here
    };

  
    const handleClosePreview = () => {
        setIsPreviewOpen(false);
        setSelectedInvoice(null);
    };

    const tabs = [
        { key: 'all', label: 'همه', count: invoices.length },
        { key: 'paid', label: 'پرداخت شده', count: invoices.filter(i => i.status === 'paid').length },
        { key: 'unpaid', label: 'پرداخت نشده', count: invoices.filter(i => i.status === 'unpaid').length },
        { key: 'pending_payment', label: 'در انتظار پرداخت', count: invoices.filter(i => i.status === 'pending_payment').length },
        { key: 'pending_approval', label: 'در انتظار تایید', count: invoices.filter(i => i.status === 'pending_approval').length },
    ];

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">در حال بارگذاری...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-12">
                <p className="text-red-600 mb-4">خطا در بارگذاری فاکتورها</p>
                <Button onClick={() => window.location.reload()}>
                    تلاش مجدد
                </Button>
            </div>
        );
    }

    return (
        <main className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">فاکتورها</h1>
                    <p className="text-gray-600 mt-1">
                        {isAdmin ? 'مدیریت فاکتورها' : 'فاکتورهای شما'}
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <Button
                        variant="default"
                        size="sm"
                        // onClick={handleTestPreview}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                        <Eye className="w-4 h-4 ml-2" />
                        تست پیش نمایش
                    </Button>
                    <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 ml-2" />
                        دانلود همه
                    </Button>
                    <Button variant="outline" size="sm">
                        <Filter className="w-4 h-4 ml-2" />
                        فیلتر
                    </Button>
                </div>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                    type="text"
                    placeholder="جستجو در فاکتورها..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200">
                <nav className="flex space-x-8 overflow-x-auto">
                    {tabs.map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key as any)}
                            className={cn(
                                'flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap',
                                activeTab === tab.key
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            )}
                        >
                            {tab.label}
                            <Badge variant="secondary" className="text-xs">
                                {tab.count}
                            </Badge>
                        </button>
                    ))}
                </nav>
            </div>

            {/* Invoice List */}
            {filteredInvoices.length === 0 ? (
                <div className="text-center py-12">
                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                        فاکتوری یافت نشد
                    </h3>
                    <p className="text-gray-600">
                        {searchTerm ? 'نتیجه‌ای برای جستجوی شما یافت نشد' : 'هنوز فاکتوری ثبت نشده است'}
                    </p>
                </div>
            ) : (
                <InvoiceList
                    invoices={filteredInvoices}
                    onPreview={handlePreview}
                    onDownload={handleDownload}
                    onView={handleView}
                />
            )}

            {/* Pagination */}
            {filteredInvoices.length > 0 && (
                <div className="flex items-center justify-between py-4">
                    <p className="text-sm text-gray-700">
                        نمایش {filteredInvoices.length} فاکتور
                    </p>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" disabled>
                            قبلی
                        </Button>
                        <Button variant="outline" size="sm" className="bg-blue-600 text-white">
                            1
                        </Button>
                        <Button variant="outline" size="sm">
                            2
                        </Button>
                        <Button variant="outline" size="sm">
                            3
                        </Button>
                        <Button variant="outline" size="sm">
                            بعدی
                        </Button>
                    </div>
                </div>
            )}

            {/* Test Preview Modal */}
            {selectedInvoice && (
                <InvoicePreviewModal
                    invoice={selectedInvoice}
                    isOpen={isPreviewOpen}
                    onClose={handleClosePreview}
                    onOpen={() => handleView(selectedInvoice)}
                    onDownload={handleDownload}
                />
            )}
        </main>
    );
};

export default InvoicePage;
