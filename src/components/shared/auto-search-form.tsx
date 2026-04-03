"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type Props = {
    label: string;
    placeholder: string;
    inputName?: string;
};

export function AutoSearchForm({
                                   label,
                                   placeholder,
                                   inputName = "q",
                               }: Props) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [value, setValue] = useState(searchParams.get(inputName) ?? "");

    useEffect(() => {
        setValue(searchParams.get(inputName) ?? "");
    }, [searchParams, inputName]);

    function applySearch(nextValue: string) {
        const params = new URLSearchParams(searchParams.toString());

        if (nextValue.trim()) {
            params.set(inputName, nextValue.trim());
        } else {
            params.delete(inputName);
        }

        params.set("page", "1");

        const queryString = params.toString();
        router.replace(queryString ? `${pathname}?${queryString}` : pathname);
    }

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        applySearch(value);
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm"
        >
            <label className="mb-2 block text-sm font-semibold text-slate-700">
                {label}
            </label>

            <div className="flex flex-col gap-3 md:flex-row">
                <input
                    name={inputName}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder={placeholder}
                    className="flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-cyan-400 focus:bg-white"
                />

                <button
                    type="submit"
                    className="rounded-2xl bg-slate-900 px-5 py-3 font-bold text-white"
                >
                    Ara
                </button>
            </div>
        </form>
    );
}