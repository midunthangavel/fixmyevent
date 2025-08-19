
'use client';

import { PageWrapper } from "@/components/shared/page-wrapper";
import { Store } from "lucide-react";
import { AddListingForm } from "@/components/add-listing/add-listing-form";

export default function AddListingPage() {
    return (
        <PageWrapper
            icon={Store}
            title="Create a Listing"
            description="Add your service to our platform and reach thousands of potential customers."
        >
            <div className="max-w-4xl mx-auto">
                <AddListingForm />
            </div>
        </PageWrapper>
    );
}
