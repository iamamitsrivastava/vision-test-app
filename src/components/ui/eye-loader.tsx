"use client";

export function EyeLoader() {
    return (
        <div className="flex items-center justify-center w-full h-full min-h-[50vh]">
            <svg
                className="w-32 h-32 md:w-48 md:h-48 text-blue-600"
                viewBox="0 0 100 100"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                xmlns="http://www.w3.org/2000/svg"
            >
                {/* Eye Contour */}
                <path
                    d="M10 50C10 50 30 25 50 25C70 25 90 50 90 50C90 50 70 75 50 75C30 75 10 50 10 50Z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="animate-draw-eye"
                />

                {/* Pupil */}
                <circle
                    cx="50"
                    cy="50"
                    r="12"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="animate-draw-pupil"
                />
            </svg>
            <style jsx>{`
                .animate-draw-eye {
                    stroke-dasharray: 300;
                    stroke-dashoffset: 300;
                    animation: draw-eye 2.5s ease-in-out infinite;
                }
                .animate-draw-pupil {
                    stroke-dasharray: 100;
                    stroke-dashoffset: 100;
                    animation: draw-pupil 2.5s ease-in-out infinite 0.5s;
                }
                @keyframes draw-eye {
                    0%, 100% { stroke-dashoffset: 300; }
                    50% { stroke-dashoffset: 0; }
                }
                @keyframes draw-pupil {
                    0%, 100% { stroke-dashoffset: 100; }
                    50% { stroke-dashoffset: 0; }
                }
            `}</style>
        </div>
    );
}
