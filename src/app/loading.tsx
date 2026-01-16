"use client";

import { EyeLoader } from "@/components/ui/eye-loader";

export default function Loading() {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#00102d]/90 backdrop-blur-sm">
            <EyeLoader />
        </div>
    );
}
